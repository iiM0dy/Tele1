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
                    toast.success(t('admin.userDeletedSuccess'));
                } else {
                    toast.error(result.error || t('admin.failedToUpdate'));
                }
            } catch (error) {
                toast.error(t('admin.errorGeneric'));
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-hide">
                <div className="max-w-[1200px] mx-auto pb-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                        <div className="">
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                {t('admin.systemUsers')}
                            </h2>
                            <p className="text-white/60 mt-2 tracking-wider text-[11px] font-semibold">
                                {t('admin.manageSubAdmins')}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedUser(null);
                                setIsModalOpen(true);
                            }}
                            className="w-full md:w-auto bg-accent text-white px-8 py-3 rounded-2xl font-black tracking-wider text-[11px] hover:opacity-90 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            aria-label={t('admin.addNewUser') || "Add new user"}
                        >
                            <MdPersonAdd className="text-xl" />
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

                    <div className="bg-white/2 rounded-[2.5rem] border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/1">
                                        <th className={`p-6 text-[10px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.username')}</th>
                                        <th className={`p-6 text-[10px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.role')}</th>
                                        <th className={`p-6 text-[10px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.permissionsSummary')}</th>
                                        <th className={`p-6 text-[10px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('admin.createdAt')}</th>
                                        <th className={`p-6 text-[10px] font-semibold text-white/60 tracking-wider ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('admin.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((user) => (
                                        <tr key={user.id} className="group hover:bg-white/2 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 bg-accent/10 rounded-full flex items-center justify-center text-accent font-black text-xs border border-accent/20">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="font-semibold text-white text-[11px] tracking-wider">{user.username}</p>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold tracking-wider border ${user.role === 'SUPER_ADMIN'
                                                    ? 'bg-accent text-white border-accent'
                                                    : 'bg-accent/10 text-accent border-accent/20'
                                                    }`}>
                                                    {user.role === 'SUPER_ADMIN' ? t('admin.superAdmin') : user.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.role === 'SUPER_ADMIN' ? (
                                                        <span className="text-[10px] font-semibold text-white/60 tracking-wider">{t('admin.unlimitedAccess')}</span>
                                                    ) : (
                                                        <>
                                                            {user.canManageProducts && <span className="text-[10px] font-semibold bg-white/5 px-2.5 py-1 rounded-lg text-white/60 tracking-wider border border-white/5">{t('admin.products')}{!user.canDeleteProducts && " (No Delete)"}</span>}
                                                            {user.canManageCategories && <span className="text-[10px] font-semibold bg-white/5 px-2.5 py-1 rounded-lg text-white/60 tracking-wider border border-white/5">{t('admin.categories')}{!user.canDeleteCategories && " (No Delete)"}</span>}
                                                            {user.canManageBanners && <span className="text-[10px] font-semibold bg-white/5 px-2.5 py-1 rounded-lg text-white/60 tracking-wider border border-white/5">{t('admin.banners')}{!user.canDeleteBanners && " (No Delete)"}</span>}
                                                            {user.canManageOrders && <span className="text-[10px] font-semibold bg-white/5 px-2.5 py-1 rounded-lg text-white/60 tracking-wider border border-white/5">{t('admin.orders')}{!user.canDeleteOrders && " (No Delete)"}</span>}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6 text-[11px] font-semibold text-white/60 tracking-wider">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-6">
                                                <div className={`flex items-center ${dir === 'rtl' ? 'justify-start' : 'justify-end'} gap-1`}>
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5"
                                                        title={t('admin.editUser')}
                                                        aria-label={t('admin.editUser') || "Edit user"}
                                                    >
                                                        <MdEdit className="text-xl" />
                                                    </button>
                                                    {user.username !== 'admin' && (
                                                        <button
                                                            onClick={() => handleDelete(user.id, user.username)}
                                                            className="p-2.5 text-white/60 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all border border-transparent hover:border-red-500/10"
                                                            title={t('admin.deleteUser')}
                                                            aria-label={t('admin.deleteUser') || "Delete user"}
                                                        >
                                                            <MdDelete className="text-xl" />
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
