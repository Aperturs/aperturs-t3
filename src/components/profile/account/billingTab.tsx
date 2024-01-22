import { api } from "~/utils/api";
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
  const { data } = api.subscription.getProducts.useQuery();
  const { mutateAsync: subscribe } =
    api.subscription.createCheckout.useMutation();

  console.log(data);

  const handleSubscribe = async () => {
    await subscribe().then((res) => {
      console.log(res);
      window.location.href = res;
    });
  };

  return (
    <div className="gird-cols-1 grid md:grid-cols-2 lg:grid-cols-3">
      <BillingCard
        features={soloCreatorFeatures}
        name="testing"
        pricing={10}
        onClick={() => handleSubscribe()}
      />
    </div>
  );
}
