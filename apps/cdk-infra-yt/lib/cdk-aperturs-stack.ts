import { join } from "path";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as logs from "aws-cdk-lib/aws-logs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class CdkApertursStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "VPC", { isDefault: true });
    const cluster = new ecs.Cluster(this, "UploaderCluster");
    const uploaderImage = new DockerImageAsset(this, "UploaderImage", {
      directory: join(__dirname, "..", "uploader"),
    });

    const logGroup = new logs.LogGroup(this, "UploaderLogGroup", {
      logGroupName: "/ecs/uploader",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const uploaderTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      "UploaderTaskDefinition",
      {
        cpu: 1024,
        memoryLimitMiB: 1024,
        runtimePlatform: {
          cpuArchitecture: ecs.CpuArchitecture.ARM64,
        },
      },
    );

    // Create a new S3 bucket with public access blocked
    const youtubeUploadsBucket = new s3.Bucket(this, "YoutubeUploadsBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    uploaderTaskDefinition.addContainer("UploaderContainer", {
      image: ecs.ContainerImage.fromDockerImageAsset(uploaderImage),
      logging: ecs.LogDrivers.awsLogs({
        logGroup: logGroup,
        streamPrefix: "Uploader",
      }),
    });

    // Grant the ECS task read access to the S3 bucket
    youtubeUploadsBucket.grantRead(uploaderTaskDefinition.taskRole);

    const uploaderTaskSecurityGroup = new ec2.SecurityGroup(
      this,
      "UploaderTaskSecurityGroup",
      {
        vpc,
        allowAllOutbound: true,
        description: "Security group for Uploader ECS task",
      },
    );

    new cdk.CfnOutput(this, "YoutubeUploadsBucketName", {
      value: youtubeUploadsBucket.bucketName,
      exportName: "CdkApertursStack-YoutubeUploadsBucketName",
    });
    new cdk.CfnOutput(this, "ClusterName", {
      value: cluster.clusterName,
      exportName: "CdkApertursStack-ClusterName",
    });
    new cdk.CfnOutput(this, "ContainerName", {
      value: "UploaderContainer",
      exportName: "CdkApertursStack-ContainerName",
    });
    new cdk.CfnOutput(this, "SecurityGroupId", {
      value: uploaderTaskSecurityGroup.securityGroupId,
      exportName: "CdkApertursStack-SecurityGroupId",
    });
    new cdk.CfnOutput(this, "TaskDefinitionName", {
      value: uploaderTaskDefinition.taskDefinitionArn,
      exportName: "CdkApertursStack-TaskDefinitionName",
    });
  }
}
