import { useRouter } from "next/router";
import LensAuthenticate from "~/components/lens/lens-auth";

export default function LensProtoCol() {
  const router = useRouter();
  return (
    <div className="flex h-full  min-h-screen w-full items-center justify-center">
      <div className="w-[30vw] rounded-lg p-16 shadow-md">
        <h1 className="whitespace-nowrap text-center text-2xl font-semibold">
          Connect your Wallet
        </h1>
        <div className="my-5">
          <LensAuthenticate />
          <button
            className="btn w-full"
            onClick={() => router.push("/socials")}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
