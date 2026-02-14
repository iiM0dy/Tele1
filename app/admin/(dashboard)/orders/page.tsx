import { getAdminOrders } from "../../../../lib/admin-actions";
import OrdersClient from "./OrdersClient";

export const revalidate = 60; // Revalidate every minute for admin

export default async function AdminOrdersPage() {
    const data = await getAdminOrders(1, 50);

    return <OrdersClient orders={data.orders} />;
}
