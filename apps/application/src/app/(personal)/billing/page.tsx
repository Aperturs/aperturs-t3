import SubscriptionCard from "./_subscription/subscription-card";

export const metadata = {
  title: "Billing",
};

export default async function Billing() {
  return (
    <section className="flex flex-col gap-2">
      <h1>Billing</h1>
      <SubscriptionCard />
    </section>
  );
}
