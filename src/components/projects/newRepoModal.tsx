import {
  Avatar,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Select,
  Typography,
} from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsInfoCircle } from "react-icons/bs";

const RepoOption = () => {
  return (
    <div className="w-full">
      <>
        <div className="flex items-center justify-between">
          <Avatar src={"/user.png"} alt="avatar" variant="square" />
          <p className="font-bold  text-black">replace it</p>
          <p>Owner : Test</p>
          <div className="flex">
            <Chip variant="ghost" value="replace it" />
          </div>
        </div>
      </>
    </div>
  );
};

  const NewRepoFormModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const [option, setOption] = useState();
  const [options, setOptions] = useState();
  const router = useRouter();

  const onConfirm =  () => {
    console.log("onConfirm event is triggered");
  };
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
              {/* <Select
              formatOptionLabel={RepoOption}
                value={option}
                options={options}
                placeholder="Search And Select your Repo"
                onChange={(value) => setOption(value as any)}
              /> */}
            </div>
          </>
        </DialogBody>
        <DialogFooter>
          <button className="btn mr-1 text-white btn-error" onClick={handleOpen}>
            <span>Cancel</span>
          </button>

          <button className="btn btn-success ml-1" onClick={onConfirm}>
            <span>Confirm</span>
          </button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default NewRepoFormModal;