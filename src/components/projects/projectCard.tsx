import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  repoName: string;
  repoDescription: string;
  lastUpdated: string;
  repoImage?: string;
  projectId: string;
};

export default function GithubCard({
  repoName,
  repoDescription,
  lastUpdated,
  repoImage,
  projectId,
}: Props) {
  const router = useRouter();
  return (
    <Card className="w-auto">
      {repoImage && (
        <CardHeader shadow={false} floated={false} className="h-56">
          <Image
            src={repoImage}
            className="h-full w-full object-cover"
            alt="repo image"
            style={{
              objectFit: "cover",
            }}
          />
        </CardHeader>
      )}
      <CardBody>
        <div className="mb-2 flex items-center justify-between">
          <Typography color="blue-gray" className="font-medium">
            {repoName}
          </Typography>
          <Typography color="blue-gray" className="text-xs">
            Updated At {lastUpdated}
          </Typography>
        </div>
        <Typography
          variant="small"
          color="gray"
          className="font-normal opacity-75"
        >
          {repoDescription}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          ripple={false}
          fullWidth={true}
          onClick={() => {
            router.push(`/project/${projectId}/context`);
          }}
          className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
        >
          Overview
        </Button>
      </CardFooter>
    </Card>
  );
}
