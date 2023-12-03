import { Alert, Typography } from "@material-tailwind/react";
import React, { useState } from "react";
import { TbAlertTriangleFilled } from "react-icons/tb";

const UpgradeAlert = () => {
  const [openAlert, setOpenAlert] = useState(true);

  return (
    <Alert
      open={openAlert}
      className="mt-auto hidden bg-primary lg:block"
      onClose={() => setOpenAlert(false)}
    >
      <TbAlertTriangleFilled className="mb-4 h-12 w-12" />
      <Typography variant="h6" className="mb-1">
        Upgrade to PRO
      </Typography>
      <Typography variant="small" className="font-normal opacity-80">
        Upgrade to Aperturs PRO and get even more advanced features and premium.
      </Typography>
      <div className="mt-4 flex gap-3">
        <Typography
          as="a"
          href="#"
          variant="small"
          className="font-medium opacity-80"
          onClick={() => setOpenAlert(false)}
        >
          Dismiss
        </Typography>
        <Typography as="a" href="#" variant="small" className="font-medium">
          Upgrade Now
        </Typography>
      </div>
    </Alert>
  );
};

export default UpgradeAlert;
