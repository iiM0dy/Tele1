import { getAdminUser } from "../../../../lib/admin-actions";
import SettingsClient from "./SettingsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPER_ADMIN') {
        redirect('/admin/dashboard');
    }

    const adminUser = await getAdminUser();

    return <SettingsClient initialUser={adminUser} />;
}
