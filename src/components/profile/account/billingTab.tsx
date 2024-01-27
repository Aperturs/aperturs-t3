import { api } from "~/utils/api";
import ManageSubscription from "./manageSubscription";
import BillingCard from "./paymentCards";

const soloCreatorFeatures = [
  {
    name: "testing something",
    available: true,
  },
  {
    name: "testing",
    available: false,
  },
];

function extractPrice(priceRange: string, position: 1 | 2): number | null {
  // Split the price range into an array of prices
  const prices = priceRange.split(" - ");

  // Ensure that the prices array has at least two elements
  if (prices.length < 2) {
    console.error("Invalid price range format");
    return null;
  }

  // Extract the desired price based on the position parameter
  const selectedPrice = position === 1 ? prices[0] : prices[1];

  // Parse the selected price into a number
  if (typeof selectedPrice !== "string") {
    console.error("Invalid price format");
    return null;
  }

  const parsedPrice = parseFloat(
    selectedPrice.replace("$", "").replace(",", "")
  );

  // Check if the parsed price is a valid number
  if (isNaN(parsedPrice)) {
    console.error("Invalid price format");
    return null;
  }

  return parsedPrice;
}

export default function BillingTab() {
  const { data: billingPlans } = api.subscription.getProducts.useQuery();
  const { mutateAsync: subscribe } =
    api.subscription.createCheckout.useMutation();

  console.log(billingPlans);

  const handleSubscribe = async (productId: string) => {
    await subscribe({ productId: parseInt(productId) }).then((res) => {
      console.log(res);
      // window.location.href = res;
    });
  };
  const { data: getSubscription } =
    api.subscription.getSubscriptions.useQuery();

  return (
    <div>
      <ManageSubscription
        isCanceled={getSubscription?.isCanceled ?? false}
        lsCurrentPeriodEnd={getSubscription?.lsCurrentPeriodEnd ?? 0}
        updatePaymentMethodURL={getSubscription?.updatePaymentMethodURL ?? ""}
      />
      <div className="gird-cols-1 grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3">
        {billingPlans?.data
          .slice()
          .reverse()
          .map((plan) => (
            <BillingCard
              key={plan.attributes.name}
              features={soloCreatorFeatures}
              name={plan.attributes.name}
              pricing={extractPrice(plan.attributes.price_formatted, 1) ?? 0}
              onClick={() => handleSubscribe(plan.id)}
              id={plan.id}
              currentPlan={
                getSubscription?.subscription.data.attributes.product_name
              }
            />
          ))}
      </div>
    </div>
  );
}
