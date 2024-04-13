import { join } from "path";
import type { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import * as ecs from "aws-cdk-lib/aws-ecs";
import { CfnEventBusPolicy, EventBus, Rule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as s3 from "aws-cdk-lib/aws-s3";

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
        cpu: 512,
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

    // Define the custom Event Bus
    const apertursScheduleBus = new EventBus(this, "ApertursSchedulerBus", {
      eventBusName: "ApertursSchedulerBus",
    });

    const schedulerLambda = new lambda.Function(this, "SchedulerLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "scheduler.handler",
      code: lambda.Code.fromAsset(join(__dirname, "..", "lambda")),
    });

    new CfnEventBusPolicy(this, "EventBusPolicy", {
      statementId: "AllowPutEvents",
      action: "events:PutEvents",
      principal: "*", // Here you might want to restrict to specific principals
      eventBusName: apertursScheduleBus.eventBusName,
      condition: {
        type: "StringEquals",
        key: "aws:PrincipalOrgID",
        value: process.env.AWS_ORGID, // Example, specify your AWS Organization ID or another condition
      },
    });
    const rule = new Rule(this, "DynamicScheduleRule", {
      eventBus: apertursScheduleBus,
      eventPattern: {
        source: ["custom.myapp.scheduler"],
      },
    });

    rule.addTarget(new LambdaFunction(schedulerLambda));

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
