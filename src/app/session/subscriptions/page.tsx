import { fetchSubscriptions } from "./actions";
import { Subscriptions } from "@/components/session/subscriptions/subscriptions";

export default async function SubscriptionsPage() {
  const subscriptionsData = await fetchSubscriptions();

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <Subscriptions
        cardClassName="w-full p-4 gap-4"
        subscriptionData={subscriptionsData.data}
      />
    </div>
  );
}
