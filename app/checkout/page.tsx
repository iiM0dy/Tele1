"use client";

import { useCart } from "@/app/context/CartContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineShoppingBag, HiOutlineShieldCheck, HiOutlineTruck, HiOutlineArrowLeft, HiOutlineQuestionMarkCircle, HiOutlineTag, HiOutlineChevronDown } from "react-icons/hi";
import { createOrder, validatePromoCode } from "@/lib/public-actions";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();
    const { t, language } = useLanguage();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [discountCode, setDiscountCode] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<{ id: string, percentage: number } | null>(null);
    const [promoError, setPromoError] = useState("");
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [isFormSummaryOpen, setIsFormSummaryOpen] = useState(false);
    const discountInputRef = useRef<HTMLInputElement>(null);

    // Form state matching Order model
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        streetAddress: "",
        city: "",
        postalCode: "",
        phone: ""
    });

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const shippingCost = 35.00;
    
    // Calculate discount from promo code
    const promoDiscount = appliedPromo ? (subtotal * appliedPromo.percentage) / 100 : 0;
    const totalAmount = subtotal - promoDiscount + shippingCost;

    const totalSavings = items.reduce((acc, item) => {
        if (item.originalPrice && item.originalPrice > item.price) {
            return acc + (item.originalPrice - item.price) * item.quantity;
        }
        return acc;
    }, 0) + promoDiscount;

    const handleApplyPromo = async () => {
        if (!discountCode.trim()) return;
        
        setLoading(true);
        setPromoError("");
        try {
            const result = await validatePromoCode(discountCode);
            if (result.success) {
                setAppliedPromo({
                    id: result.promoId!,
                    percentage: result.discountPercentage!
                });
            } else {
                setPromoError(result.error || "Invalid promo code");
                setAppliedPromo(null);
            }
        } catch (error) {
            setPromoError("Failed to apply promo code");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        
        setLoading(true);
        try {
            const result = await createOrder({
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: "", // Removed from UI
                phone: formData.phone,
                streetAddress: formData.streetAddress,
                city: formData.city,
                postalCode: formData.postalCode,
                totalAmount: totalAmount,
                discount: promoDiscount,
                promoCodeId: appliedPromo?.id,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            });

            if (result.success) {
                clearCart();
                router.push(`/order-success?id=${result.orderId}`);
            } else {
                console.error("Order creation failed on server:", result.error);
                alert(`Failed to create order: ${result.error || "Please try again."}`);
            }
        } catch (error) {
            console.error("Order submission error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-[107px]">
                <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                    <HiOutlineShoppingBag className="w-10 h-10 text-zinc-300" />
                </div>
                <h1 className="text-2xl font-bold mb-4">{t('cart.emptyCart')}</h1>
                <p className="text-zinc-500 mb-8 text-center max-w-md">
                    {t('cart.emptyCartDescription')}
                </p>
                <Link 
                    href="/products" 
                    className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                >
                    {t('cart.continueShopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Custom Checkout Header */}
            <header className="bg-white border-b border-[#e1e1e1] py-3.5 lg:h-[95px] lg:py-0 flex items-center">
                <div className="w-full max-w-[1100px] mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center">
                    <div className="w-11 hidden lg:block"></div> {/* Spacer to keep logo centered on desktop */}
                    
                    <div className="flex-1 flex justify-center lg:justify-center">
                        <div className="w-full max-w-[404px] lg:max-w-none flex justify-between lg:justify-center items-center">
                            <div className="w-5 lg:hidden"></div> {/* Spacer for mobile logo centering */}
                            
                            <Link href="/" className="inline-block">
                                <span className="text-xl md:text-2xl font-sans font-black tracking-tighter uppercase text-black">
                                    TELE1<span className="text-accent">.</span>
                                </span>
                            </Link>

                            <div className="flex justify-end lg:hidden">
                                <Link href="/cart" aria-label="Cart" className="text-[#333] hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.2">
                                        <path d="m2.007 10.156.387-4.983a1 1 0 0 1 .997-.923h7.218a1 1 0 0 1 .997.923l.387 4.983c.11 1.403-1.16 2.594-2.764 2.594H4.771c-1.605 0-2.873-1.19-2.764-2.594"></path>
                                        <path d="M5 3.5c0-1.243.895-2.25 2-2.25S9 2.257 9 3.5V5c0 1.243-.895 2.25-2 2.25S5 6.243 5 5z"></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="w-11 hidden lg:flex justify-end">
                        <Link href="/cart" aria-label="Cart" className="text-[#333] hover:text-black transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <path d="m2.007 10.156.387-4.983a1 1 0 0 1 .997-.923h7.218a1 1 0 0 1 .997.923l.387 4.983c.11 1.403-1.16 2.594-2.764 2.594H4.771c-1.605 0-2.873-1.19-2.764-2.594"></path>
                                <path d="M5 3.5c0-1.243.895-2.25 2-2.25S9 2.257 9 3.5V5c0 1.243-.895 2.25-2 2.25S5 6.243 5 5z"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Mobile Summary Toggle */}
            <div className="lg:hidden bg-[#fafafa] border-b border-[#e1e1e1] px-4 md:px-8 z-[90]">
                <div className="max-w-[404px] mx-auto">
                    <button 
                        onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                        className="w-full flex justify-between items-center text-black text-[0.9rem] h-[65px]"
                    >
                        <div className="flex items-center gap-2">
                            <span>{t('cart.orderSummary')}</span>
                            <HiOutlineChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSummaryOpen ? 'rotate-180' : ''}`} />
                        </div>
                        <span className="text-[#333] font-medium text-[1rem]">
                            ${totalAmount.toFixed(2)}
                        </span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-[55fr_45fr] min-h-[calc(100vh-95px)]">
                {/* Right Column: Order Summary (appears first on mobile under toggle) */}
                <aside className={`lg:bg-[#f5f5f5] lg:border-l lg:border-[#e1e1e1] flex justify-center lg:justify-start order-1 lg:order-2 transition-colors duration-300 ${isSummaryOpen ? 'bg-[#f5f5f5]' : 'bg-white'}`}>
                    <div className={`w-full max-w-[404px] grid transition-all duration-300 ease-in-out lg:grid-rows-[1fr] lg:opacity-100 ${isSummaryOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className={`overflow-hidden px-4 md:px-8 lg:px-12 py-[30px] lg:py-16 lg:border-b-0 ${isSummaryOpen ? 'border-b border-[#e1e1e1]' : ''}`}>
                            <h2 className="text-[1.5rem] font-medium mb-6 text-[#333] hidden lg:block text-left">
                                {t('cart.orderSummary')}
                            </h2>
                                
                                {/* Item List */}
                                <div className="space-y-4 mb-8">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <Link href={`/products/${item.slug}`} className="relative w-16 h-16 bg-white border border-[#e1e1e1] rounded-md shrink-0 hover:border-black transition-colors group">
                                                <Image 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    fill 
                                                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                                                />
                                                <span className="absolute -top-2 -right-2 bg-[#666] text-white text-[0.7rem] w-5 h-5 flex items-center justify-center rounded-full z-10 font-medium">
                                                    {item.quantity}
                                                </span>
                                            </Link>
                                            <div className="flex-1 min-w-0 text-left">
                                                <Link href={`/products/${item.slug}`} className="text-[0.9rem] font-medium text-[#333] truncate hover:underline block">
                                                    {item.name}
                                                </Link>
                                                {item.originalPrice && item.originalPrice > item.price && (
                                                    <div className="text-[0.75rem] color-[#707070] flex items-center gap-1 mt-0.5">
                                                        <span>{t('checkout.discount')} (-${(item.originalPrice - item.price).toFixed(2)})</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                {item.originalPrice && item.originalPrice > item.price ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.8rem] text-[#707070] line-through">
                                                            ${(item.originalPrice * item.quantity).toFixed(2)}
                                                        </span>
                                                        <span className="text-[0.9rem] text-[#333] font-medium">
                                                            {item.price === 0 ? 'Free' : `$${(item.price * item.quantity).toFixed(2)}`}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[0.9rem] text-[#333]">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Discount Field */}
                                <div className="space-y-2 mb-8">
                                    <div className="flex gap-2.5">
                                        <div className="relative flex-1">
                                            <input 
                                                type="text" 
                                                placeholder={t('checkout.promoCode')} 
                                                value={discountCode}
                                                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                                className={`w-full px-3 py-3 border rounded-md text-[0.9rem] text-black focus:outline-none focus:ring-1 focus:ring-black transition-all uppercase ${promoError ? 'border-red-500' : 'border-[#e1e1e1]'}`}
                                            />
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={handleApplyPromo}
                                            disabled={!discountCode.trim() || loading}
                                            className={`px-6 py-3 rounded-md text-white text-sm font-medium transition-all ${
                                                discountCode.trim() && !loading
                                                    ? 'bg-black cursor-pointer hover:bg-zinc-800' 
                                                    : 'bg-[#e1e1e1] cursor-not-allowed'
                                            }`}
                                        >
                                            {loading ? '...' : t('apply')}
                                        </button>
                                    </div>
                                    {promoError && (
                                        <p className="text-red-500 text-[0.8rem] ml-1">{promoError}</p>
                                    )}
                                    {appliedPromo && (
                                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md w-fit">
                                            <HiOutlineTag className="w-4 h-4 text-[#666]" />
                                            <span className="text-[0.85rem] font-medium text-[#333]">
                                                {discountCode.toUpperCase()} applied ({appliedPromo.percentage}%)
                                            </span>
                                            <button 
                                                onClick={() => {
                                                    setAppliedPromo(null);
                                                    setDiscountCode("");
                                                }}
                                                className="text-[#666] hover:text-black text-[1.1rem] leading-none ml-1"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Cost Summary */}
                                <div className="border-t border-[#e1e1e1] pt-6 space-y-3">
                                    <div className="flex justify-between text-[0.95rem] text-[#333]">
                                        <span>{t('cart.subtotal')} · {totalItems} {t('items')}</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    {appliedPromo && (
                                        <div className="flex justify-between text-[0.95rem] text-green-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <HiOutlineTag className="w-4 h-4" />
                                                <span>{t('checkout.discount')}</span>
                                            </div>
                                            <span>-${promoDiscount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[0.95rem] text-[#333]">
                                        <div className="flex items-center gap-2">
                                            <span>{t('cart.shipping')}</span>
                                            <HiOutlineQuestionMarkCircle className="w-4 h-4 text-[#666]" />
                                        </div>
                                        <span>${shippingCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-[#e1e1e1] text-[1.2rem] font-bold text-[#333]">
                                        <span>{t('cart.total')}</span>
                                        <span className="flex items-center gap-1.5">
                                            <small className="text-[0.7rem] text-[#666] font-normal">USD</small>
                                            ${totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                    {totalSavings > 0 && (
                                        <div className="flex items-center gap-2 text-[#333] font-bold text-[0.85rem] mt-4">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                <path d="M12.75 3.25v2.844a2.5 2.5 0 0 1-.708 1.743L7.75 12.25m1-10.5H6.699a2 2 0 0 0-1.414.586L1.737 5.883a1.75 1.75 0 0 0 0 2.475l2.332 2.331a1.5 1.5 0 0 0 2.121 0l3.724-3.724a2 2 0 0 0 .586-1.414V3.5a1.75 1.75 0 0 0-1.75-1.75"/>
                                                <circle cx="7.75" cy="4.5" r="0.563"/>
                                            </svg>
                                            <span>{t('checkout.totalSavings')} ${totalSavings.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                {/* Left Column: Checkout Form */}
                <div className="px-4 py-8 md:py-16 lg:px-12 flex justify-center lg:justify-end border-r border-[#e1e1e1] lg:border-r-0 order-2 lg:order-1">
                    <div className="w-full max-w-[404px]">
                        <form onSubmit={handleSubmit} className="space-y-8 text-left">
                            {/* Delivery Section */}
                            <section>
                                <h2 className="text-[1.35rem] font-medium text-[#1a1a1a] mb-4">{t('checkout.shippingInformation')}</h2>
                                <div className="space-y-3.5">
                                    <div className="grid grid-cols-2 gap-3.5">
                                        <input 
                                            name="firstName"
                                            placeholder={`${t('checkout.firstName')} (optional)`} 
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                            className="w-full px-4 py-3.5 border border-[#d1d1d1] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-black transition-all text-[0.95rem] text-black placeholder:text-[#707070]" 
                                        />
                                        <input 
                                            required 
                                            name="lastName"
                                            placeholder={t('checkout.lastName')} 
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                            className="w-full px-4 py-3.5 border border-[#d1d1d1] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-black transition-all text-[0.95rem] text-black placeholder:text-[#707070]" 
                                        />
                                    </div>
                                    <input 
                                        required 
                                        name="streetAddress"
                                        placeholder={t('checkout.address')} 
                                        value={formData.streetAddress}
                                        onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                                        className="w-full px-4 py-3.5 border border-[#d1d1d1] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-black transition-all text-[0.95rem] text-black placeholder:text-[#707070]" 
                                    />
                                    <div className="grid grid-cols-2 gap-3.5">
                                        <input 
                                            required 
                                            name="city"
                                            placeholder={t('checkout.city')} 
                                            value={formData.city}
                                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                                            className="w-full px-4 py-3.5 border border-[#d1d1d1] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-black transition-all text-[0.95rem] text-black placeholder:text-[#707070]" 
                                        />
                                        <input 
                                            name="postalCode"
                                            placeholder={`${t('checkout.postalCode')} (optional)` }
                                            value={formData.postalCode}
                                            onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                                            className="w-full px-4 py-3.5 border border-[#d1d1d1] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-black transition-all text-[0.95rem] text-black placeholder:text-[#707070]" 
                                        />
                                    </div>
                                    <div className="relative">
                                        <input 
                                            required 
                                            name="phone"
                                            placeholder={t('checkout.phoneNumber')} 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-4 py-3.5 border border-[#d1d1d1] rounded-[4px] focus:outline-none focus:ring-1 focus:ring-black transition-all text-[0.95rem] text-black placeholder:text-[#707070]" 
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Mobile Form Dropdown Summary (Before Place Order Button) */}
                            <div className="lg:hidden mt-8 border-t border-[#e1e1e1] pt-4">
                                <div className={`grid transition-all duration-300 ease-in-out ${!isFormSummaryOpen ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                setIsFormSummaryOpen(true);
                                                setTimeout(() => {
                                                    discountInputRef.current?.focus();
                                                    discountInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                }, 100);
                                            }}
                                            className="flex items-center gap-2 px-3 py-1.5 border border-[#e1e1e1] rounded-[4px] text-[0.85rem] font-medium text-[#1a1a1a] hover:bg-gray-50 transition-colors"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                <path d="M12.75 3.25v2.844a2.5 2.5 0 0 1-.708 1.743L7.75 12.25m1-10.5H6.699a2 2 0 0 0-1.414.586L1.737 5.883a1.75 1.75 0 0 0 0 2.475l2.332 2.331a1.5 1.5 0 0 0 2.121 0l3.724-3.724a2 2 0 0 0 .586-1.414V3.5a1.75 1.75 0 0 0-1.75-1.75"/>
                                                <circle cx="7.75" cy="4.5" r="0.563"/>
                                            </svg>
                                            {t('checkout.addDiscount')}
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    type="button"
                                    onClick={() => setIsFormSummaryOpen(!isFormSummaryOpen)}
                                    className="w-full text-left py-2"
                                >
                                    {isFormSummaryOpen ? (
                                        <div className="flex justify-between items-center text-black">
                                            <div className="flex items-center gap-2 text-[0.9rem]">
                                                <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" className={`transition-transform duration-300 ${isFormSummaryOpen ? 'rotate-180' : ''}`}>
                                                    <path d="m2 5 5 5 5-5" strokeWidth="1.2"/>
                                                </svg>
                                                <span>{t('cart.orderSummary')}</span>
                                            </div>
                                            <span className="text-[1.1rem] font-semibold text-[#000]">
                                                ${totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center">
                                                    {items.slice(0, 2).map((item, idx) => (
                                                        <div 
                                                            key={item.id} 
                                                            className={`relative w-10 h-10 bg-white border border-[#e1e1e1] rounded-[4px] shadow-sm overflow-hidden ${idx > 0 ? '-ml-6 z-[1]' : 'z-[2]'}`}
                                                        >
                                                            <Image 
                                                                src={item.image} 
                                                                alt={item.name} 
                                                                fill 
                                                                className="object-contain p-0.5"
                                                            />
                                                        </div>
                                                    ))}
                                                    {items.length > 2 && (
                                                        <div className="relative w-10 h-10 bg-[#f5f5f5] border border-[#e1e1e1] rounded-[4px] -ml-6 z-0 flex items-center justify-center text-[0.7rem] text-[#666] font-medium pt-1 pl-4">
                                                            +{items.length - 2}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[1.1rem] font-medium text-[#1a1a1a] leading-tight">Total</span>
                                                    <span className="text-[0.85rem] text-[#707070]">{totalItems} items</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[0.65rem] text-[#707070] font-medium px-1.5 py-0.5 bg-[#f0f0f0] rounded-[4px] uppercase tracking-wider">USD</span>
                                                    <span className="text-[1.15rem] font-semibold text-[#1a1a1a]">${totalAmount.toFixed(2)}</span>
                                                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" className="transition-transform duration-300">
                                                        <path d="m2 5 5 5 5-5" strokeWidth="1.2"/>
                                                    </svg>
                                                </div>
                                                {totalSavings > 0 && (
                                                    <div className="flex items-center gap-1.5 text-[0.8rem] text-[#707070] font-medium mt-1">
                                                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                            <path d="M12.75 3.25v2.844a2.5 2.5 0 0 1-.708 1.743L7.75 12.25m1-10.5H6.699a2 2 0 0 0-1.414.586L1.737 5.883a1.75 1.75 0 0 0 0 2.475l2.332 2.331a1.5 1.5 0 0 0 2.121 0l3.724-3.724a2 2 0 0 0 .586-1.414V3.5a1.75 1.75 0 0 0-1.75-1.75"/>
                                                            <circle cx="7.75" cy="4.5" r="0.563"/>
                                                        </svg>
                                                        <span>{t('checkout.totalSavings')} ${totalSavings.toFixed(2)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </button>

                                <div className={`grid transition-all duration-300 ease-in-out ${isFormSummaryOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="space-y-4 pt-4">
                                            {/* Item List */}
                                            <div className="space-y-4">
                                                {items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <Link href={`/products/${item.slug}`} className="relative w-16 h-16 bg-white border border-[#e1e1e1] rounded-md shrink-0 hover:border-black transition-colors group">
                                                        <Image 
                                                            src={item.image} 
                                                            alt={item.name} 
                                                            fill 
                                                            className="object-contain p-1 group-hover:scale-105 transition-transform"
                                                        />
                                                        <span className="absolute -top-2 -right-2 bg-[#666] text-white text-[0.7rem] w-5 h-5 flex items-center justify-center rounded-full z-10">
                                                            {item.quantity}
                                                        </span>
                                                    </Link>
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <Link href={`/products/${item.slug}`} className="text-[0.9rem] font-medium text-[#333] truncate hover:underline block">
                                                            {item.name}
                                                        </Link>
                                                            {item.originalPrice && item.originalPrice > item.price && (
                                                                <div className="text-[0.75rem] color-[#707070] flex items-center gap-1 mt-0.5">
                                                                    <span>{t('checkout.discount')} (-${(item.originalPrice - item.price).toFixed(2)})</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            {item.originalPrice && item.originalPrice > item.price ? (
                                                                <div className="flex flex-col">
                                                                    <span className="text-[0.8rem] text-[#707070] line-through">
                                                                        ${(item.originalPrice * item.quantity).toFixed(2)}
                                                                    </span>
                                                                    <span className="text-[0.9rem] text-[#333] font-medium">
                                                                        {item.price === 0 ? 'Free' : `$${(item.price * item.quantity).toFixed(2)}`}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[0.9rem] text-[#333]">
                                                                    ${(item.price * item.quantity).toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Discount Field (Mobile) */}
                                            <div className="flex gap-2.5 pt-4">
                                                <div className="relative flex-1">
                                                    <input 
                                                        ref={discountInputRef}
                                                        type="text" 
                                                        placeholder={t('checkout.promoCode')} 
                                                        value={discountCode}
                                                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                                        className="w-full px-3 py-3 border border-[#e1e1e1] rounded-md text-[0.9rem] text-black focus:outline-none focus:ring-1 focus:ring-black transition-all uppercase"
                                                    />
                                                </div>
                                                <button 
                                                    type="button" 
                                                    disabled={!discountCode.trim()}
                                                    className={`px-6 py-3 rounded-md text-white text-sm font-medium transition-all ${
                                                        discountCode.trim() 
                                                            ? 'bg-black cursor-pointer' 
                                                            : 'bg-[#e1e1e1] cursor-not-allowed'
                                                    }`}
                                                >
                                                    Apply
                                                </button>
                                            </div>

                                            {/* Totals Summary */}
                                            <div className="border-t border-[#e1e1e1] pt-4 space-y-3">
                                                <div className="flex justify-between text-[0.95rem] text-[#333]">
                                                    <span>Subtotal · {totalItems} items</span>
                                                    <span>${subtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-[0.95rem] text-[#333]">
                                                    <div className="flex items-center gap-2">
                                                        <span>Shipping</span>
                                                        <HiOutlineQuestionMarkCircle className="w-4 h-4 text-[#666]" />
                                                    </div>
                                                    <span>${shippingCost.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-4 border-t border-[#e1e1e1] text-[1.1rem] font-bold text-[#333]">
                                                    <span>Total</span>
                                                    <span className="flex items-center gap-1.5">
                                                        <small className="text-[0.7rem] text-[#666] font-normal uppercase">USD</small>
                                                        ${totalAmount.toFixed(2)}
                                                    </span>
                                                </div>
                                                {totalSavings > 0 && (
                                                    <div className="flex items-center gap-2 text-[#333] font-bold text-[0.85rem] mt-4">
                                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                                                            <path d="M12.75 3.25v2.844a2.5 2.5 0 0 1-.708 1.743L7.75 12.25m1-10.5H6.699a2 2 0 0 0-1.414.586L1.737 5.883a1.75 1.75 0 0 0 0 2.475l2.332 2.331a1.5 1.5 0 0 0 2.121 0l3.724-3.724a2 2 0 0 0 .586-1.414V3.5a1.75 1.75 0 0 0-1.75-1.75"/>
                                                            <circle cx="7.75" cy="4.5" r="0.563"/>
                                                        </svg>
                                                        <span>TOTAL SAVINGS ${totalSavings.toFixed(2)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-[4px] font-bold text-[1.05rem] hover:bg-[#333] transition-all flex items-center justify-center gap-3 disabled:bg-[#ccc] disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Complete Order"
                                )}
                            </button>
                        </form>

                        <div className="mt-12 pt-6 border-t border-[#e1e1e1] flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2">
                            <Link href="/refund-policy" className="text-[0.75rem] underline text-[#1a1a1a]">Refund policy</Link>
                            <Link href="/shipping-policy" className="text-[0.75rem] underline text-[#1a1a1a]">Shipping</Link>
                            <Link href="/privacy-policy" className="text-[0.75rem] underline text-[#1a1a1a]">Privacy policy</Link>
                            <Link href="/terms-of-service" className="text-[0.75rem] underline text-[#1a1a1a]">Terms of service</Link>
                            <Link href="/contact" className="text-[0.75rem] underline text-[#1a1a1a]">Contact</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
