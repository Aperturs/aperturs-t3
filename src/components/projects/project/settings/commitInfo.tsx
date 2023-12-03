import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Select,
  Option,
  CardFooter,
} from "@material-tailwind/react";
import { useState } from "react";

export default function CommitDescriptionSettingsCard() {
  const [commitDescription, setCommitDescription] = useState("simple");

  const handleCommitDescriptionChange = (value: string | undefined) => {
    if (value) {
      setCommitDescription(value);
    }
  };

  return (
    <Card className="mt-6 ">
      <CardHeader color="blue-gray">
        <Typography
          variant="h5"
          color="white"
          className="grid h-24 place-items-center"
        >
          Commit Description
        </Typography>
      </CardHeader>
      <CardBody>
        <Typography color="blue-gray" className="mb-4">
          Choose the level of detail you write in your commit messages
        </Typography>
        <Select
          label="Commit Info"
          value={commitDescription}
          onChange={handleCommitDescriptionChange}
          className="mb-4 w-full"
        >
          <Option value="simple">Simple</Option>
          <Option value="vague">Vague</Option>
          <Option value="descriptive">Descriptive</Option>
        </Select>
      </CardBody>
      <CardFooter>
        <button
          className="btn btn-primary w-full text-white"
          onClick={() => {
            // Your logic to generate posts based on commits
            console.log(`${commitDescription}`);
          }}
        >
          Save
        </button>
      </CardFooter>
    </Card>
  );
}
