"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiOutlineCheckCircle, HiOutlineShoppingBag, HiOutlineArrowLeft } from "react-icons/hi";
import { Suspense } from "react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    return (
        <div className="bg-white min-h-screen">
            <div className="flex flex-col items-center justify-center px-4 py-12 md:py-24">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                            <HiOutlineCheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Thank you for your order!
                    </h1>

                    <p className="text-lg text-gray-600 mb-8">
                        Your order has been placed successfully.
                        {orderId && (
                            <span className="block mt-2 font-medium text-gray-900">
                                Order ID: {orderId}
                            </span>
                        )}
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/products"
                            className="w-full bg-black text-white py-4 px-8 rounded-md font-bold text-[0.95rem] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                            <HiOutlineShoppingBag className="w-5 h-5" />
                            Continue Shopping
                        </Link>

                        <Link
                            href="/"
                            className="w-full bg-white text-gray-600 py-4 px-8 rounded-md font-medium text-[0.95rem] hover:bg-gray-50 border border-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            <HiOutlineArrowLeft className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="mt-12 pt-12 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            If you have any questions, please contact our support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
