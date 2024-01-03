import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Example() {
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-center py-24">
      <div className="flex w-full max-w-lg flex-col items-center justify-center">
        <Image
          src="/logo.svg"
          className="max-w-sm"
          width={200}
          height={200}
          alt="logo"
        />
        <Typography className="my-4" variant="h2" color="indigo" textGradient>
          Welcome to Aperturs
        </Typography>
        <Typography className="text-center" variant="lead" color="gray">
          Aperturs gives you marketing superpowers with powerful features
        </Typography>
        <button
          className="btn btn-primary btn-wide my-3 text-white"
          onClick={async () => {
            await router.push("/onboarding/addSocial");
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
