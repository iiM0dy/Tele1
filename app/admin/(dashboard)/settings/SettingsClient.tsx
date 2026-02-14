"use client";

import { useState, useEffect } from "react";
import { MdWarning } from "react-icons/md";
import { updateAdminCredentials } from "../../../../lib/admin-actions";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/app/context/LanguageContext";

interface AdminUser {
    id: string;
    username: string;
    createdAt: string;
    updatedAt: string;
}

export default function SettingsClient({ 
    initialUser
}: { 
    initialUser: AdminUser | null
}) {
    const { t } = useLanguage();
    
    // Account Settings State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialUser) {
            setNewUsername(initialUser.username);
        }
    }, [initialUser]);

    const handleAccountSubmit = async (e: React.FormEvent) => {
         e.preventDefault();

         if (!currentPassword) {
             toast.error(t('admin.currentPasswordRequired'));
             return;
         }

         if (newPassword && newPassword !== confirmPassword) {
             toast.error(t('admin.passwordsDoNotMatch'));
             return;
         }

         if (newPassword && newPassword.length < 6) {
             toast.error(t('admin.passwordTooShort'));
             return;
         }

         setIsSubmitting(true);

         try {
             const result = await updateAdminCredentials({
                 currentPassword,
                 newUsername: newUsername !== initialUser?.username ? newUsername : undefined,
                 newPassword: newPassword || undefined,
             });

             if (result.success) {
                 toast.success(result.message || t('admin.settingsUpdated'));
                 setCurrentPassword("");
                 setNewPassword("");
                 setConfirmPassword("");

                 // If password was changed, sign out
                 if (newPassword) {
                     toast.success(t('admin.passwordChangedLogout'));
                     setTimeout(() => {
                         signOut({ callbackUrl: "/admin/login" });
                     }, 2000);
                 }
             } else {
                 toast.error(result.error || t('admin.failedToUpdate'));
             }
         } catch (error) {
             console.error("Error updating settings:", error);
             toast.error(t('admin.failedToUpdate'));
         } finally {
             setIsSubmitting(false);
         }
     };

    if (!initialUser) {
        return (
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-2xl mx-auto">
                        <p className="text-center text-gray-500 italic uppercase tracking-widest text-[10px] font-bold">{t('admin.unableToLoadUser')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-8 scrollbar-hide">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-admin-sidebar rounded-2xl border border-admin-border p-5 sm:p-8 shadow-2xl">
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase mb-2">
                                {t('admin.settings')}
                            </h2>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                                {t('admin.adminAccountSettings')}
                            </p>
                        </div>

                        <form onSubmit={handleAccountSubmit} className="space-y-8">
                            {/* Current Password */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-white uppercase tracking-widest">
                                    {t('admin.currentPassword')} *
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder={t('admin.enterCurrentPassword')}
                                    required
                                    className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                />
                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                                    {t('admin.requiredToVerify')}
                                </p>
                            </div>

                            <div className="border-t border-admin-border pt-8">
                                <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6 opacity-50">
                                    {t('admin.changeCredentials')}
                                </h3>

                                {/* New Username */}
                                <div className="space-y-3 mb-6">
                                    <label className="text-[10px] font-bold text-white uppercase tracking-widest">
                                        {t('admin.username')}
                                    </label>
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder={t('admin.enterNewUsername')}
                                        className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                    />
                                </div>

                                {/* New Password */}
                                <div className="space-y-3 mb-6">
                                    <label className="text-[10px] font-bold text-white uppercase tracking-widest">
                                        {t('admin.newPassword')}
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder={t('admin.leaveBlank')}
                                        className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                    />
                                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                                        {t('admin.minChars')}
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                {newPassword && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-[10px] font-bold text-white uppercase tracking-widest">
                                            {t('admin.confirmNewPassword')}
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder={t('admin.reEnterNewPassword')}
                                            className="w-full h-12 px-4 rounded-xl border border-admin-border bg-black/20 text-white focus:ring-1 focus:ring-gold/20 focus:border-gold/30 hover:border-gold/30 transition-all outline-none text-[10px] font-bold uppercase tracking-widest"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gold hover:bg-gold/90 text-white h-12 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-gold/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                            {t('admin.updating')}
                                        </span>
                                    ) : (
                                        t('admin.updateSettings')
                                    )}
                                </button>
                            </div>

                            {newPassword && (
                                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 animate-in zoom-in-95 duration-300">
                                    <div className="flex gap-3">
                                        <MdWarning className="text-gold text-xl shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-bold text-white uppercase tracking-widest">
                                                {t('admin.passwordChangeNotice')}
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                                                {t('admin.logoutNotice')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
