import Details from "~/components/details/details";
import { DetailsProvider } from "~/components/details/details-provider";

export default function DetailsPage() {
  return (
    <section className="flex min-h-screen w-screen items-center justify-center  p-7 ">
      <div className="max-w-7xl">
        <DetailsProvider>
          <Details />
        </DetailsProvider>
      </div>
    </section>
  );
}
