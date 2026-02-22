"use client";

import { useState, useEffect } from "react";
import { createUser, updateUser } from "@/lib/user-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdClose, MdSync } from "react-icons/md";

interface User {
    id: string;
    username: string;
    role: string;
    canManageProducts: boolean;
    canDeleteProducts: boolean;
    canManageCategories: boolean;
    canDeleteCategories: boolean;
    canManageBanners: boolean;
    canDeleteBanners: boolean;
    canManageOrders: boolean;
    canDeleteOrders: boolean;
    canManagePromoCodes: boolean;
    canDeletePromoCodes: boolean;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export default function UserModal({ isOpen, onClose, user }: UserModalProps) {
    const { t, dir } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "ADMIN",
        canManageProducts: true,
        canDeleteProducts: true,
        canManageCategories: true,
        canDeleteCategories: true,
        canManageBanners: true,
        canDeleteBanners: true,
        canManageOrders: true,
        canDeleteOrders: true,
        canManagePromoCodes: true,
        canDeletePromoCodes: true,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                password: "", // Don't show password
                role: user.role,
                canManageProducts: user.canManageProducts,
                canDeleteProducts: user.canDeleteProducts,
                canManageCategories: user.canManageCategories,
                canDeleteCategories: user.canDeleteCategories,
                canManageBanners: user.canManageBanners,
                canDeleteBanners: user.canDeleteBanners,
                canManageOrders: user.canManageOrders,
                canDeleteOrders: user.canDeleteOrders,
                canManagePromoCodes: user.canManagePromoCodes,
                canDeletePromoCodes: user.canDeletePromoCodes,
            });
        } else {
            setFormData({
                username: "",
                password: "",
                role: "ADMIN",
                canManageProducts: true,
                canDeleteProducts: true,
                canManageCategories: true,
                canDeleteCategories: true,
                canManageBanners: true,
                canDeleteBanners: true,
                canManageOrders: true,
                canDeleteOrders: true,
                canManagePromoCodes: true,
                canDeletePromoCodes: true,
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user && !formData.password) {
            toast.error("Password is required for new users");
            return;
        }

        setIsSubmitting(true);
        try {
            let result;
            if (user) {
                result = await updateUser(user.id, formData);
            } else {
                result = await createUser(formData);
            }

            if (result.success) {
                toast.success(user ? "User updated successfully" : "User created successfully");
                onClose();
            } else {
                toast.error(result.error || "Something went wrong");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const handlePermissionChange = (name: string, checked: boolean) => {
        const newFormData = { ...formData, [name]: checked };

        // If unchecking a manage permission, also uncheck the corresponding delete permission
        if (!checked) {
            if (name === 'canManageProducts') newFormData.canDeleteProducts = false;
            if (name === 'canManageCategories') newFormData.canDeleteCategories = false;
            if (name === 'canManageBanners') newFormData.canDeleteBanners = false;
            if (name === 'canManageOrders') newFormData.canDeleteOrders = false;
            if (name === 'canManagePromoCodes') newFormData.canDeletePromoCodes = false;
        }

        setFormData(newFormData);
    };

    const PermissionCheckbox = ({ name, label, dependsOn }: { name: string, label: string, dependsOn?: string }) => {
        const isChecked = (formData as any)[name];
        const isParentChecked = dependsOn ? (formData as any)[dependsOn] : true;

        return (
            <label className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${!isParentChecked ? 'opacity-40 cursor-not-allowed bg-white/[0.01] border-transparent' :
                isChecked ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/[0.02] border-white/5 text-white/40'
                }`}>
                <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={!isParentChecked}
                    onChange={(e) => handlePermissionChange(name, e.target.checked)}
                    className="rounded border-white/10 bg-white/5 text-accent focus:ring-accent size-4 cursor-pointer"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
            </label>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#202126] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">
                                {user ? t('admin.editUserPermissions') : t('admin.addNewSubAdmin')}
                            </h2>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                                {user ? t('admin.updatingAccess').replace('{username}', user.username) : t('admin.createAccount')}
                            </p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                        >
                            <MdClose className="text-2xl" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('admin.username')}</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className={`w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl outline-none focus:border-accent/50 transition-all text-[10px] font-black uppercase tracking-[0.2em] text-white`}
                                    placeholder="e.g. jessica_editor"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={`text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                                    {user ? t('admin.newPasswordOptional') : t('admin.password')}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl outline-none focus:border-accent/50 transition-all text-[10px] font-black uppercase tracking-[0.2em] text-white`}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-4">
                            <label className={`text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('admin.accountRole')}</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'ADMIN' })}
                                    className={`p-5 rounded-3xl border ${dir === 'rtl' ? 'text-right' : 'text-left'} transition-all ${formData.role === 'ADMIN' ? 'border-accent bg-accent/10' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                                >
                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${formData.role === 'ADMIN' ? 'text-accent' : 'text-white'}`}>{t('admin.subAdminDefault')}</p>
                                    <p className="text-[9px] font-black text-white/30 mt-1 uppercase tracking-[0.2em]">{t('admin.limitedAccess')}</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'SUPER_ADMIN' })}
                                    className={`p-5 rounded-3xl border ${dir === 'rtl' ? 'text-right' : 'text-left'} transition-all ${formData.role === 'SUPER_ADMIN' ? 'border-accent bg-accent/10' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                                >
                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${formData.role === 'SUPER_ADMIN' ? 'text-accent' : 'text-white'}`}>{t('admin.superAdminRole')}</p>
                                    <p className="text-[9px] font-black text-white/30 mt-1 uppercase tracking-[0.2em]">{t('admin.fullAccess')}</p>
                                </button>
                            </div>
                        </div>

                        {/* Granular Permissions */}
                        {formData.role !== 'SUPER_ADMIN' && (
                            <div className="space-y-6 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
                                <div>
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6">{t('admin.permissionsChecklist')}</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <p className={`text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('admin.products')}</p>
                                            <PermissionCheckbox name="canManageProducts" label={t('admin.canCreateEdit').replace('{resource}', t('admin.products'))} />
                                            <PermissionCheckbox name="canDeleteProducts" label={t('admin.canDelete').replace('{resource}', t('admin.products'))} dependsOn="canManageProducts" />
                                        </div>

                                        <div className="space-y-3">
                                            <p className={`text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('admin.categories')}</p>
                                            <PermissionCheckbox name="canManageCategories" label={t('admin.canCreateEdit').replace('{resource}', t('admin.categories'))} />
                                            <PermissionCheckbox name="canDeleteCategories" label={t('admin.canDelete').replace('{resource}', t('admin.categories'))} dependsOn="canManageCategories" />
                                        </div>

                                        <div className="space-y-3">
                                            <p className={`text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('admin.banners')}</p>
                                            <PermissionCheckbox name="canManageBanners" label={t('admin.canManage').replace('{resource}', t('admin.banners'))} />
                                            <PermissionCheckbox name="canDeleteBanners" label={t('admin.canDelete').replace('{resource}', t('admin.banners'))} dependsOn="canManageBanners" />
                                        </div>

                                        <div className="space-y-3">
                                            <p className={`text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('admin.orders')}</p>
                                            <PermissionCheckbox name="canManageOrders" label={t('admin.canViewProcess').replace('{resource}', t('admin.orders'))} />
                                            <PermissionCheckbox name="canDeleteOrders" label={t('admin.canDelete').replace('{resource}', t('admin.orders'))} dependsOn="canManageOrders" />
                                        </div>

                                        <div className="space-y-3">
                                            <p className={`text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('admin.promoCodes')}</p>
                                            <PermissionCheckbox name="canManagePromoCodes" label={t('admin.canManage').replace('{resource}', t('admin.promoCodes'))} />
                                            <PermissionCheckbox name="canDeletePromoCodes" label={t('admin.canDelete').replace('{resource}', t('admin.promoCodes'))} dependsOn="canManagePromoCodes" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                            >
                                {t('admin.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-8 py-5 bg-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <MdSync className="animate-spin text-lg" />
                                ) : (
                                    user ? t('admin.updateUser') : t('admin.createUser')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
