"use client";

import { useState } from "react";
import { deleteUser } from "@/lib/user-actions";
import { toast } from "react-hot-toast";
import Link from "next/link";
import UserModal from "./UserModal";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdChevronRight, MdPersonAdd, MdEdit, MdDelete } from "react-icons/md";

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
    createdAt: Date | string;
}

export default function UsersClient({ users }: { users: User[] }) {
    const { t, dir } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, username: string) => {
        if (username === 'admin') {
            toast.error(t('admin.cannotDeleteAdmin'));
            return;
        }

        if (confirm(t('admin.confirmDeleteUser').replace('{username}', username))) {
            try {
                const result = await deleteUser(id);
                if (result.success) {
                    toast.success("User deleted successfully");
                } else {
                    toast.error(result.error || "Failed to delete user");
                }
            } catch (error) {
                toast.error("An unexpected error occurred");
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-6 md:gap-8 pb-10">

                    {/* Page Heading & Breadcrumbs */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="flex flex-col gap-1">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-sm text-text-sub dark:text-gray-400 mb-1">
                                <Link href="/admin/dashboard" className="hover:text-primary cursor-pointer transition-colors">{t('admin.dashboard')}</Link>
                                <MdChevronRight className={`text-[12px] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                <span className="text-text-main dark:text-white font-medium">{t('admin.userManagement')}</span>
                            </div>
                            <h2 className="text-3xl font-extrabold text-text-main dark:text-white tracking-tight uppercase">{t('admin.systemUsers')}</h2>
                            <p className="text-text-sub dark:text-gray-400 text-sm font-medium uppercase tracking-widest">{t('admin.manageSubAdmins')}</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedUser(null);
                                setIsModalOpen(true);
                            }}
                            className="bg-gold hover:bg-gold/90 text-white h-12 px-6 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-gold/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <MdPersonAdd className="text-[20px]" />
                            {t('admin.addNewUser')}
                        </button>
                    </div>

                    <UserModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedUser(null);
                        }}
                        user={selectedUser}
                    />

                    <div className="bg-surface-light dark:bg-surface-dark border border-admin-border rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-background-light dark:bg-gray-800/50 border-b border-admin-border text-[10px] font-bold text-text-sub dark:text-gray-400 uppercase tracking-widest">
                                        <th className={`p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.username')}</th>
                                        <th className={`p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.role')}</th>
                                        <th className={`p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.permissionsSummary')}</th>
                                        <th className={`p-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.createdAt')}</th>
                                        <th className={`p-5 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-admin-border">
                                    {users.map((user) => (
                                        <tr key={user.id} className="group hover:bg-gold/5 dark:hover:bg-gold/10 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold text-xs">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="font-bold text-text-main dark:text-white text-xs uppercase tracking-tight">{user.username}</p>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.role === 'SUPER_ADMIN'
                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    : 'bg-gold/10 text-gold'
                                                    }`}>
                                                    {user.role === 'SUPER_ADMIN' ? t('admin.superAdmin') : user.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.role === 'SUPER_ADMIN' ? (
                                                        <span className="text-[10px] font-bold text-text-sub dark:text-gray-400 italic uppercase tracking-widest">{t('admin.unlimitedAccess')}</span>
                                                    ) : (
                                                        <>
                                                            {user.canManageProducts && <span className="text-[10px] font-bold bg-gold/5 dark:bg-gold/10 px-2 py-0.5 rounded text-gold uppercase tracking-widest border border-gold/10">{t('admin.products')}{!user.canDeleteProducts && " (No Delete)"}</span>}
                                                            {user.canManageCategories && <span className="text-[10px] font-bold bg-gold/5 dark:bg-gold/10 px-2 py-0.5 rounded text-gold uppercase tracking-widest border border-gold/10">{t('admin.categories')}{!user.canDeleteCategories && " (No Delete)"}</span>}
                                                            {user.canManageBanners && <span className="text-[10px] font-bold bg-gold/5 dark:bg-gold/10 px-2 py-0.5 rounded text-gold uppercase tracking-widest border border-gold/10">{t('admin.banners')}{!user.canDeleteBanners && " (No Delete)"}</span>}
                                                            {user.canManageOrders && <span className="text-[10px] font-bold bg-gold/5 dark:bg-gold/10 px-2 py-0.5 rounded text-gold uppercase tracking-widest border border-gold/10">{t('admin.orders')}{!user.canDeleteOrders && " (No Delete)"}</span>}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-5 text-[10px] font-bold text-text-sub dark:text-gray-400 uppercase tracking-widest">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className={`p-5 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                                                <div className={`flex items-center ${dir === 'rtl' ? 'justify-start' : 'justify-end'} gap-2`}>
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="size-9 rounded-lg flex items-center justify-center text-text-sub dark:text-gray-400 hover:text-gold hover:bg-gold/10 transition-colors"
                                                        title={t('admin.editUser')}
                                                    >
                                                        <MdEdit className="text-[20px]" />
                                                    </button>
                                                    {user.username !== 'admin' && (
                                                        <button
                                                            onClick={() => handleDelete(user.id, user.username)}
                                                            className="size-9 rounded-lg flex items-center justify-center text-text-sub dark:text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                            title={t('admin.deleteUser')}
                                                        >
                                                            <MdDelete className="text-[20px]" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
