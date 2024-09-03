import Details from "~/components/details/details";
import { DetailsProvider } from "~/components/details/details-provider";

export default function DetailsPage() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center  py-7 ">
      <DetailsProvider>
        <Details />
      </DetailsProvider>
    </div>
  );
}
