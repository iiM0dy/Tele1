import { getDashboardStats } from "../../../../lib/admin-actions";
import DashboardClient from "./DashboardClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 60; // Revalidate every minute for admin

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/admin/login');
    }

    const stats = await getDashboardStats();

    return <DashboardClient stats={stats} />;
}
