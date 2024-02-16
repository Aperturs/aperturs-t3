"use client";

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BsInfoCircle } from "react-icons/bs";
import Select from "react-select";

import { Avatar, AvatarImage } from "@aperturs/ui/avatar";
import { Badge } from "@aperturs/ui/badge";
import { Button } from "@aperturs/ui/button";
import { Dialog, DialogFooter, DialogHeader } from "@aperturs/ui/dialog";
import { Input } from "@aperturs/ui/input";
import { Textarea } from "@aperturs/ui/textarea";

import { useGithub } from "~/hooks/useGithub";
import { api } from "~/utils/api";
import LogoLoad from "../custom/loading/logoLoad";
import SimpleLoader from "../custom/loading/simple-loading";

interface RepoOptionType {
  value: Repo;
  label: string;
}
const RepoOption = ({ label, value }: RepoOptionType) => {
  return (
    <div className="w-full">
      {value && (
        <>
          <div className="flex items-center justify-between">
            <Avatar>
              <AvatarImage
                src={value.owner.avatar_url}
                alt="avatar"
                className="rounded-sm"
              />
            </Avatar>

            <p className="font-bold  text-black">{label}</p>
            <p>Owner : {value.owner.type}</p>
            <div className="flex">
              <Badge>{value.visibility}</Badge>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const NewRepoFormModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const { data: githubTokens, isLoading } =
    api.user.getGithubAccounts.useQuery();

  const { getRepositories } = useGithub(
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    githubTokens?.at(0)?.access_token!,
  );

  // useEffect(() => {
  //   if (!githubTokens || githubTokens.length <= 0) {
  //     toast.error("Go to settings and add github");
  //     router.push("/settings");
  //   }
  // }, [githubTokens]);
  const [option, setOption] = useState({} as RepoOptionType);
  const [commitsCount, setCommitsCount] = useState(3);
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState([] as RepoOptionType[]);
  const router = useRouter();
  useEffect(() => {
    getRepositories()
      .then((res) => {
        const repos = res?.data as Repo[];
        if (repos) {
          const repoOptions: RepoOptionType[] = repos.map((repo) => {
            return {
              value: repo,
              label: repo.full_name,
            } as RepoOptionType;
          });
          // console.log({ repoOptions })
          setOptions(repoOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const { mutateAsync: addProject, isLoading: projectLoading } =
    api.github.project.addProject.useMutation({
      onSuccess: (data) => {
        router.push(`/project/${data.id}/commits`);
      },
    });

  // useEffect(() => {
  //   if (failure) {
  //     toast.error(`Could Not Create  due to the Error , ${error}`);
  //   }
  // }, [failure]);

  const onConfirm = async () => {
    // console.log("onConfirm event is triggered");

    await toast
      .promise(
        addProject({
          repoId: option.value.id.toString(),
          commitCount: commitsCount,
          questionsAnswersJsonString: [
            {
              question: "description",
              answer: description,
            },
          ],
          repoDescription: tagline || option.value.description || "",
          repoName: option.value.name,
          repoUrl: option.value.html_url,
        }),
        {
          loading: "loading...",
          success: "connected",
          error: "there is some error",
        },
      )
      .catch((err) => {
        console.log(err);
      });
  };
  if (isLoading) return <LogoLoad />;
  return (
    <Dialog>
      <Button className="btn btn-primary px-8 text-white" onClick={handleOpen}>
        Connect new Repo
      </Button>
      <DialogHeader>Select your Repo ....</DialogHeader>
      {/* {loading && user ? (
              <Spinner className="h-12 w-12" />
            ) : ( */}
      <>
        <div className="my-7 w-full">
          <p className="mt-2 flex items-center gap-1 font-normal">
            <BsInfoCircle className="-mt-px h-4 w-4" />
            Search And Select your Repo
          </p>
          <Select
            formatOptionLabel={RepoOption}
            value={option}
            options={options}
            placeholder="Search And Select your Repo"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(value) => setOption(value as any)}
          />
          <div className="mt-5 flex flex-col gap-3">
            {/* <Input
                  max={"10"}
                  min={"3"}
                  defaultValue={3}
                  value={commitsCount}
                  onChange={(event) =>
                    setCommitsCount(parseInt(event.target.value))
                  }
                  type="number"
                  label="Number Of Commits"
                  crossOrigin={undefined}
                />
                <Typography
                  variant="small"
                  color="gray"
                  className="mt-2 flex items-center gap-1 font-normal"
                >
                  <BsInfoCircle className="-mt-px h-4 w-4" />
                  Select How many lastest commits will be taken in consideration
                  before making a post
                </Typography> */}
            <div>
              <span>Tagline</span>
              <Input
                value={tagline}
                placeholder="One line description about your project"
                onChange={(event) => setTagline(event.target.value)}
              />
            </div>
            <div>
              <span>Description</span>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="short description about your project"
              />
            </div>
          </div>
        </div>
      </>
      <DialogFooter>
        <button className="btn btn-error mr-1 text-white" onClick={handleOpen}>
          <span>Cancel</span>
        </button>
        <Button
          className="!btn !btn-success ml-1"
          color="green"
          onClick={onConfirm}
        >
          {projectLoading ? <SimpleLoader /> : "Confirm"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default NewRepoFormModal;
