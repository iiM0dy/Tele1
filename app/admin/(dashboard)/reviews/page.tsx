import { getAdminReviews } from "../../../../lib/admin-actions";
import ReviewsClient from "./ReviewsClient";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ReviewsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'SUPER_ADMIN' && !session.user.canManageProducts)) {
        redirect('/admin/dashboard');
    }

    const { page: pageParam } = await searchParams;
    const page = parseInt(pageParam || "1");
    const { reviews, pagination } = await getAdminReviews(page);

    // Fetch all products for the review modal selection
    const products = await prisma.product.findMany({
        select: {
            id: true,
            Name: true,
        },
        orderBy: {
            Name: 'asc'
        }
    });

    return (
        <ReviewsClient 
            reviews={reviews} 
            products={products}
            pagination={pagination} 
        />
    );
}
