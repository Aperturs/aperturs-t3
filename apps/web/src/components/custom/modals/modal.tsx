import { Button } from "~/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";

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
    <DialogContent>
      <DialogHeader>{DialogHeaderContent}</DialogHeader>
      <div>{DialogBodyContent}</div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" onClick={onClose} className="mr-1">
            <span>Cancel</span>
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" onClick={onConfirm}>
            <span>Confirm</span>
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

export default ConfirmationDialog;
