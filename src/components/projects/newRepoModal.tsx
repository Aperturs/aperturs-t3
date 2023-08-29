import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Spinner,
  Typography
} from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsInfoCircle } from "react-icons/bs";
import Select from "react-select";
import { useGithub } from "~/hooks/useGithub";
import { Repo } from "~/types/githubTypes";
import { api } from "~/utils/api";
type RepoOptionType = {
  value: Repo;
  label: string;
};
const RepoOption = ({ label, value }: RepoOptionType) => {
  return (
    <div className="w-full">
      {value && (
        <>
          <div className="flex items-center justify-between">
            <Avatar
              src={value.owner.avatar_url}
              alt="avatar"
              variant="square"
            />
            <p className="text-black  font-bold">{label}</p>
            <p>Owner : {value.owner.type}</p>
            <div className="flex">
              <Chip variant="ghost" value={value.visibility} />
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
  const { data: githubTokens, isLoading } = api.user.getGithubAccounts.useQuery();

  const { getRepositories, loading, error } = useGithub(
    githubTokens?.at(0)?.access_token as string
  );
  useEffect(() => {
    if (error) {
      toast.error(`Could Not Create  due to the Error , ${error}`);
    }
  }, [error])
  useEffect(() => {
    if (!githubTokens || githubTokens.length <= 0) {
      toast.error("Go to settings and add github")
      router.push("/settings")

    }
  }, [githubTokens])
  const [option, setOption] = useState({} as RepoOptionType);
  const [commitsCount, setCommitsCount] = useState(3);
  const [options, setOptions] = useState([] as RepoOptionType[]);
  const router = useRouter();
  useEffect(() => {
    getRepositories().then((res) => {
      const repos = res?.data as Repo[];
      const repoOptions: RepoOptionType[] = repos.map((repo) => {
        return {
          value: repo,
          label: repo.full_name,
        } as RepoOptionType;
      });
      // console.log({ repoOptions })
      setOptions(repoOptions);
    });
  }, []);
  const { mutateAsync: addProject,isLoading:projectLoading } = api.user.addProject.useMutation({
    onSuccess: (data) => {
      router.push(`/project/${data.id}/settings`)
    }
  })

  // useEffect(() => {
  //   if (failure) {
  //     toast.error(`Could Not Create  due to the Error , ${error}`);
  //   }
  // }, [failure]);

  const onConfirm = async () => {
    // console.log("onConfirm event is triggered");
    await addProject({
      repoId: option.value.id.toString(),
      commitCount: commitsCount,
      questionsAnswersJsonString: JSON.stringify({}),
      repoDescription: option.value.description,
      repoName: option.value.name,
      repoUrl: option.value.html_url,
    })

  };
  if (isLoading) return <Spinner className="h-12 w-12" />
  return (
    <>
      <button className="btn-primary btn px-8 text-white" onClick={handleOpen}>
        Connect new Repo
      </button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Select your Repo ....</DialogHeader>
        <DialogBody divider>
          {/* {loading && user ? (
              <Spinner className="h-12 w-12" />
            ) : ( */}
          <>
            <div className="my-7 w-full">
              <Typography
                variant="small"
                color="gray"
                className="mt-2 flex items-center gap-1 font-normal"
              >
                <BsInfoCircle className="-mt-px h-4 w-4" />
                Search And Select your Repo
              </Typography>
              <Select
                formatOptionLabel={RepoOption}
                value={option}
                options={options}
                placeholder="Search And Select your Repo"
                onChange={(value) => setOption(value as any)}
              />
              <div className="mt-5">
                <Input
                  max={"10"}
                  min={"3"}
                  defaultValue={3}
                  value={commitsCount}
                  onChange={(event) =>
                    setCommitsCount(parseInt(event.target.value))
                  }
                  type="number"
                  label="Number Of Commits"
                />
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center gap-1 font-normal mt-2"
                >
                  <BsInfoCircle className="w-4 h-4 -mt-px" />
                  Select How many lastest commits will be taken in
                  consideration before making a post
                </Typography>
              </div>
            </div>
          </>
        </DialogBody>
        <DialogFooter>
          <button className="btn mr-1 text-white btn-error" onClick={handleOpen}>
            <span>Cancel</span>
          </button>
          <Button  className="btn btn-success ml-1" onClick={onConfirm}>
            {projectLoading ? <Spinner className="h-12 w-12" /> : "Confirm"}
          </Button>
          <button   onClick={onConfirm}>
            <span>Confirm</span>
          </button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default NewRepoFormModal;