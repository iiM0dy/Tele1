import { getAdminOrders } from "../../../../lib/admin-actions";
import OrdersClient from "./OrdersClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 60; // Revalidate every minute for admin

export default async function AdminOrdersPage() {
    // const session = await getServerSession(authOptions);
    //
    // if (!session || (session.user.role !== 'SUPER_ADMIN' && !session.user.canManageOrders)) {
    //     redirect('/admin/dashboard');
    // }

    const data = await getAdminOrders(1, 50);

    return <OrdersClient orders={data.orders} />;
}
