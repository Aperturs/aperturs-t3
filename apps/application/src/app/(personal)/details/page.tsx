import Details from "~/components/details/details";
import { DetailsProvider } from "~/components/details/details-provider";

export default function DetailsPage() {
  return (
    <DetailsProvider>
      <Details />
    </DetailsProvider>
  );
}
