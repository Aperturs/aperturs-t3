import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactElement } from "react";
import toast from "react-hot-toast";
import { Layout, ProjectLayout } from "~/components";
import { type ProjectQnA } from "~/types/project";
import { api } from "~/utils/api";

const Settings = () => {
  const router = useRouter();

  const { data } = api.github.project.getProject.useQuery(
    router.query.id as string
  );

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
    const id = router.query.id as string;
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
          <Typography
            variant="h5"
            color="white"
            className=" grid h-24 place-items-center"
          >
            Project Info
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          <Typography color="blue-gray" className="mb-4">
            Add some information about your project. This will be used to
            generate better the post.
          </Typography>
          <Input
            label="Name"
            className="mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            crossOrigin={undefined}
          />
          <Input
            label="Tagline or one line description about your project"
            className="mb-4"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            crossOrigin={undefined}
          />
          <Textarea
            label="Project Descripton"
            value={description}
            size="lg"
            onChange={(e) => setDescription(e.target.value)}
          />
        </CardBody>
        <CardFooter>
          <button
            disabled={isLoading}
            className={`btn btn-primary w-full text-white ${
              isLoading ? "loading" : ""
            }`}
            onClick={() =>
              // Your logic to generate posts based on commits
              submit()
            }
          >
            Save Changes
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

Settings.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <ProjectLayout>{page}</ProjectLayout>
    </Layout>
  );
};

export default Settings;
