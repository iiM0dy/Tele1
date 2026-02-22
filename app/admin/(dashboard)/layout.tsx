import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import DashboardLayoutClient from "./DashboardLayoutClient";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // const session = await getServerSession(authOptions);

    // Don't check auth for login page - it's handled by route group
    // This layout only applies to protected routes
    // if (!session) {
    //     redirect("/admin/login");
    // }

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
