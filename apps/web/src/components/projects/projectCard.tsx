import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

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
  return (
    <Card className="w-full">
      {repoImage && (
        <CardHeader className="h-56">
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
      <CardHeader>
        <div className="mb-2 flex flex-col gap-2">
          <h3 className="font-medium">{repoName}</h3>
          <h5 className="text-xs">Updated At {lastUpdated}</h5>
        </div>{" "}
      </CardHeader>
      <CardContent>
        <p color="gray" className="font-normal opacity-75">
          {repoDescription}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100">
          <Link href={`/project/${projectId}/drafts`}>Overview</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
