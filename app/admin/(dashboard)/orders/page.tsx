import { getAdminOrders } from "../../../../lib/admin-actions";
import OrdersClient from "./OrdersClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 60; // Revalidate every minute for admin

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'SUPER_ADMIN' && !session.user.canManageOrders)) {
        redirect('/admin/dashboard');
    }

    const params = await searchParams;
    const page = Number(params.page) || 1;
    const sortBy = (params.sortBy as string) || "createdAt";
    const sortDir = (params.sortDir as "asc" | "desc") || "desc";

    const data = await getAdminOrders(page, 50, sortBy, sortDir);

    return <OrdersClient orders={data.orders} pagination={data.pagination} />;
}
