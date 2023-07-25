import { useRouter } from "next/router";
import { ConnectSocials } from "~/components";

function AddSocial() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="w-[75%]">
        <ConnectSocials />
        <div className="flex justify-between">
          <button
            className="btn-primary btn-wide btn my-3 text-white"
            onClick={async () => {
              await router.push("/onboarding");
            }}
          >
            Back
          </button>
          <button
            className="btn-primary btn-wide btn my-3 text-white"
            onClick={async () => {
              await router.push("/dashboard");
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSocial;
