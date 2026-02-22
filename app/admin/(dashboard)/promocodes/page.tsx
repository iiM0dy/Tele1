import { getPromoCodes } from "../../../../lib/admin-actions";
import PromoCodesClient from "./PromoCodesClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PromoCodesPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'SUPER_ADMIN' && !session.user.canManagePromoCodes)) {
        redirect('/admin/dashboard');
    }

    const promoCodes = await getPromoCodes();
    return <PromoCodesClient promoCodes={promoCodes} />;
}
