import { getPromoCodes } from "../../../../lib/admin-actions";
import PromoCodesClient from "./PromoCodesClient";

export default async function PromoCodesPage() {
    const promoCodes = await getPromoCodes();
    return <PromoCodesClient promoCodes={promoCodes} />;
}
