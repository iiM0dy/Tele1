import { getAdminBanners } from "../../../../lib/admin-actions";
import BannersClient from "./BannersClient";

export const revalidate = 60; // Revalidate every minute for admin

export default async function AdminBannersPage() {
    const banners = await getAdminBanners();

    return <BannersClient banners={banners} />;
}
