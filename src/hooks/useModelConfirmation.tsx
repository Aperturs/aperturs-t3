import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import ReactDOM from "react-dom";

interface NotificationDialogProps {
  title: string;
  content: React.ReactNode;
  labels?: { confirm?: string; cancel?: string };
  onCancel?: () => void;
  onConfirm?: () => void;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({
  title,
  content,
  labels = { confirm: "Confirm", cancel: "Cancel" },
  onCancel,
  onConfirm,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm?.();
  };

  return (
    <Dialog open={isOpen} handler={handleClose} size="xs">
      <DialogHeader>
        <Typography variant="h5" color="blue-gray">
          {title}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="grid place-items-center gap-4">
        {content}
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="text" color="red" onClick={handleClose}>
          {labels?.cancel}
        </Button>
        <Button variant="gradient" onClick={handleConfirm}>
          {labels?.confirm}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

// export const openNotificationDialog = (props: NotificationDialogProps) => {
//   const container = document.createElement("div");
//   document.body.appendChild(container);

//   const closeDialog = () => {
//     ReactDOM.unmountComponentAtNode(container);
//     document.body.removeChild(container);
//   };

//   ReactDOM.render(
//     <NotificationDialog {...props} onCancel={closeDialog} />,
//     container
//   );
// };
