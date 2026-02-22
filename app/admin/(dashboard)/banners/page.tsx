import { getAdminBanners } from "../../../../lib/admin-actions";
import BannersClient from "./BannersClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 60; // Revalidate every minute for admin

export default async function AdminBannersPage() {
    // const session = await getServerSession(authOptions);
    //
    // if (!session || (session.user.role !== 'SUPER_ADMIN' && !session.user.canManageBanners)) {
    //     redirect('/admin/dashboard');
    // }

    const banners = await getAdminBanners();

    return <BannersClient banners={banners} />;
}
