import { getDashboardStats } from "../../../../lib/admin-actions";
import DashboardClient from "./DashboardClient";

export const revalidate = 60; // Revalidate every minute for admin

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return <DashboardClient stats={stats} />;
}
