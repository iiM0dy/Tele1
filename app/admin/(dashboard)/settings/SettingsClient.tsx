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
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-2xl mx-auto">
                        <p className="text-center text-white/60 italic uppercase tracking-[0.2em] text-[10px] font-black">{t('admin.unableToLoadUser')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-hide">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/[0.01] rounded-[2.5rem] border border-white/5 p-8 sm:p-10 shadow-2xl">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase mb-2">
                                {t('admin.settings')}
                            </h2>
                            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                                {t('admin.adminAccountSettings')}
                            </p>
                        </div>

                        <form onSubmit={handleAccountSubmit} className="space-y-10">
                            {/* Current Password */}
                            <div className="space-y-4">
                                <label htmlFor="currentPassword" className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">
                                    {t('admin.currentPassword')} *
                                </label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder={t('admin.enterCurrentPassword')}
                                    required
                                    className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/[0.02] text-white focus:border-accent/50 transition-all outline-none text-[10px] font-black uppercase tracking-[0.2em] placeholder:text-white/40"
                                />
                                <p className="text-[9px] text-white/60 font-black uppercase tracking-[0.2em] ml-1">
                                    {t('admin.requiredToVerify')}
                                </p>
                            </div>

                            <div className="border-t border-white/5 pt-10">
                                <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-8">
                                    {t('admin.changeCredentials')}
                                </h3>

                                {/* New Username */}
                                <div className="space-y-4 mb-8">
                                    <label htmlFor="newUsername" className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">
                                        {t('admin.username')}
                                    </label>
                                    <input
                                        id="newUsername"
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder={t('admin.enterNewUsername')}
                                        aria-label={t('admin.username') || "New username"}
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/[0.02] text-white focus:border-accent/50 transition-all outline-none text-[10px] font-black uppercase tracking-[0.2em] placeholder:text-white/40"
                                    />
                                </div>

                                {/* New Password */}
                                <div className="space-y-4 mb-8">
                                    <label htmlFor="newPassword" className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">
                                        {t('admin.newPassword')}
                                    </label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder={t('admin.leaveBlank')}
                                        aria-label={t('admin.newPassword') || "New password"}
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/[0.02] text-white focus:border-accent/50 transition-all outline-none text-[10px] font-black uppercase tracking-[0.2em] placeholder:text-white/40"
                                    />
                                    <p className="text-[9px] text-white/60 font-black uppercase tracking-[0.2em] ml-1">
                                        {t('admin.minChars')}
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                {newPassword && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label htmlFor="confirmPassword" className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] ml-1">
                                            {t('admin.confirmNewPassword')}
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder={t('admin.reEnterNewPassword')}
                                            className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/[0.02] text-white focus:border-accent/50 transition-all outline-none text-[10px] font-black uppercase tracking-[0.2em] placeholder:text-white/40"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-accent hover:opacity-90 text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                                <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 animate-in zoom-in-95 duration-300">
                                    <div className="flex gap-4">
                                        <MdWarning className="text-accent text-2xl shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                                {t('admin.passwordChangeNotice')}
                                            </p>
                                            <p className="text-[9px] text-white/60 mt-1 uppercase tracking-[0.2em] font-black">
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
