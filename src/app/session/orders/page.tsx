import { fetchOrders } from "@/app/session/orders/actions";
import { OrderData } from "@/components/session/orders/orders";
import { Orders } from "@/components/session/orders/orders";

export default async function OrdersPage() {
  const ordersData = await fetchOrders();

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <Orders
        cardClassName="w-full p-4 gap-4"
        searchPlaceholder="Search"
        ordersData={ordersData.data as OrderData[]}
      />
    </div>
  );
}
