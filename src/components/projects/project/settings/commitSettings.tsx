import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Typography
} from "@material-tailwind/react";
import { useState } from "react";


export default function CommitSettings() {
  const [commits, setCommits] = useState(0);

  const handleCommitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommits(parseInt(e.target.value, 10));
  };


  return (
    <Card className="mt-6">
      <CardHeader color="blue-gray">
        <Typography variant="h5" color="white" className=" grid h-24 place-items-center">
          Number of Commits
        </Typography>
      </CardHeader>
      <CardBody>
        <Typography color="blue-gray" className="mb-4">
          Select the number of commits for which you want us to generate posts for you.
        </Typography>
        <Input
          type="number"
          label="Number of commits"
          value={commits}
          onChange={handleCommitsChange}
          className="mb-4"
        />
      </CardBody>
      <CardFooter>
        <button
          className="btn btn-primary w-full text-white"
          onClick={() => {
            // Your logic to generate posts based on commits
          }}
        >
          Save
        </button>
      </CardFooter>
    </Card>
  );
}
