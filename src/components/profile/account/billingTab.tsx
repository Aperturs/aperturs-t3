import React from "react";
import BillingCard from "./paymentCards";

const soloCreatorFeatures = [
  {
    name: "testing",
    available: true,
  },
  {
    name: "testing",
    available: false,
  },
];

export default function BillingTab() {
  return (
    <div className="gird-cols-1 grid md:grid-cols-2 lg:grid-cols-3">
      <BillingCard
        features={soloCreatorFeatures}
        name="testing"
        pricing={10}
        onClick={() => console.log("clicked")}
      />
    </div>
  );
}
