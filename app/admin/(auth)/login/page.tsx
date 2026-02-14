"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import { MdPerson, MdLock } from "react-icons/md";

export default function AdminLoginPage() {
    const router = useRouter();
    const { t, dir } = useLanguage();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                username,
                password,
                rememberMe: rememberMe ? "true" : "false",
                redirect: false,
            });

            if (result?.error) {
                setError(t("admin.login.invalidCredentials"));
            } else {
                router.push("/admin/dashboard");
            }
        } catch (err) {
            setError(t("admin.login.errorGeneric"));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const isRtl = dir === "rtl";
    const inputPadding = isRtl ? "pr-11 pl-4" : "pl-11 pr-4";

    return (
        <div
            className="bg-background dark min-h-screen flex items-center justify-center p-6 relative overflow-hidden text-foreground"
            dir={dir}
        >
            <div className="absolute top-6 right-6 z-20">
                <LanguageToggle />
            </div>
            <div className="w-full max-w-[440px] z-10">
                <div className="bg-surface-light rounded-2xl border border-[#e6dbdf] dark:border-white/10 p-10 md:p-12">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-10">
                        <img
                            src="/Ruby-Beauty-Logo.jpeg"
                            alt="Ruby Beauty"
                            className="h-16 w-auto object-contain mb-4"
                        />
                        <h1 className="text-text-main text-2xl font-extrabold tracking-tight">
                            {t("admin.login.title")}
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label
                                className={`text-xs font-bold uppercase tracking-widest text-text-sub ${isRtl ? "mr-1" : "ml-1"}`}
                                htmlFor="username"
                            >
                                {t("admin.login.username")}
                            </label>
                            <div className="relative">
                                <span className={`absolute inset-y-0 ${isRtl ? "right-0" : "left-0"} flex items-center ${isRtl ? "pr-4" : "pl-4"} text-text-sub/60`}>
                                    <MdPerson className="text-[20px]" />
                                </span>
                                <input
                                    className={`w-full ${inputPadding} py-3.5 bg-background border border-[#e6dbdf] dark:border-white/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary text-text-main placeholder:text-text-sub/40 transition-all outline-none`}
                                    id="username"
                                    placeholder={t("admin.login.usernamePlaceholder")}
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label
                                    className="text-xs font-bold uppercase tracking-widest text-text-sub"
                                    htmlFor="password"
                                >
                                    {t("admin.login.password")}
                                </label>
                            </div>
                            <div className="relative">
                                <span className={`absolute inset-y-0 ${isRtl ? "right-0" : "left-0"} flex items-center ${isRtl ? "pr-4" : "pl-4"} text-text-sub/60`}>
                                    <MdLock className="text-[20px]" />
                                </span>
                                <input
                                    className={`w-full ${inputPadding} py-3.5 bg-background border border-[#e6dbdf] dark:border-white/10 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary text-text-main placeholder:text-text-sub/40 transition-all outline-none`}
                                    id="password"
                                    placeholder={t("admin.login.passwordPlaceholder")}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    className="w-4 h-4 rounded border-[#e6dbdf] dark:border-white/20 text-primary focus:ring-primary/20 transition-all"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="text-sm text-text-sub dark:text-white/60 group-hover:text-text-main dark:group-hover:text-white transition-colors">
                                    {t("admin.login.rememberMe")}
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? t("admin.login.signingIn") : t("admin.login.submitButton")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
