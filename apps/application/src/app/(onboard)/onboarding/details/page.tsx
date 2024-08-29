"use client";

import Details from "./_components/details";
import { DetailsProvider } from "./_components/details-provider";

export default function DetailsPage() {
  return (
    <DetailsProvider>
      <Details />
    </DetailsProvider>
  );
}
