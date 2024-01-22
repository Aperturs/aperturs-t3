import {
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";

export type HandleOpenRef = {
  handleOpen: () => void;
};

interface ConfirmationDialogProps {
  onConfirm: () => void;
  onClose: () => void;
  DialogHeaderContent: string;
  DialogBodyContent: string;
}

function ConfirmationDialog({
  onConfirm,
  onClose,
  DialogBodyContent,
  DialogHeaderContent,
}: ConfirmationDialogProps) {
  return (
    <>
      <DialogHeader>{DialogHeaderContent}</DialogHeader>
      <DialogBody>{DialogBodyContent}</DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-1">
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="black" onClick={onConfirm}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </>
  );
}

export default ConfirmationDialog;
