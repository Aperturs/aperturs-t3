"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type ProjectQnA } from "~/types/project";
import { api } from "~/utils/api";

const Settings = ({ params }: { params: { id: string } }) => {
  const { data } = api.github.project.getProject.useQuery(params.id);

  console.log(data);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  const [tagline, setTagline] = useState("");
  const {
    mutateAsync: updateContext,
    isLoading,
    error,
  } = api.github.project.updateProject.useMutation();

  useEffect(() => {
    if (data) {
      const questionAnswer = data?.questionsAnswersJsonString
        ? (data.questionsAnswersJsonString as unknown as ProjectQnA[]) // Parse JSON string to object
        : ([] as ProjectQnA[]);

      setName(data.projectName || data.repoName);
      setTagline(data.repoDescription);
      if (questionAnswer[0]) {
        setDescription(questionAnswer[0].answer);
      }
    }
  }, [data]);

  const submit = async () => {
    const id = params.id;
    if (!id) {
      toast.error("Something went wrong");
      return;
    }
    await toast.promise(
      updateContext({
        data: {
          projectName: name,
          questionsAnswersJsonString: [
            { question: "Description", answer: description },
          ],
          repoDescription: tagline,
        },
        id: id.toString(),
      }),
      {
        loading: "Saving Changes ...",
        success: "Saved Successfully",
        error: `Something went wrong ${error?.message as string}`,
      }
    );
  };
  return (
    <div className="mt-4 grid grid-cols-1 gap-11 sm:grid-cols-1">
      {/* <CommitSettings />
        <CommitDescriptionSettingsCard /> */}
      <Card className="mt-6">
        <CardHeader color="blue-gray">
          <h5 className=" grid h-24 place-items-center">Project Info</h5>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="mb-4">
            Add some information about your project. This will be used to
            generate better the post.
          </p>
          <Input
            placeholder="Name"
            className="mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Tagline or one line description about your project"
            className="mb-4"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
          <Textarea
            placeholder="Project Descripton"
            value={description}
            // size="lg"
            onChange={(e) => setDescription(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button
            disabled={isLoading}
            className="w-full"
            onClick={async () => await submit()}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
