"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdPerson, MdLock, MdArrowBack } from "react-icons/md";
import Link from "next/link";

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
            className="bg-[#202126] min-h-screen flex items-center justify-center p-6 text-white font-sans"
            dir={dir}
        >
            <div className={`absolute top-8 ${isRtl ? 'right-8' : 'left-8'} z-20`}>
                <Link
                    href="/"
                    className="flex items-center gap-2 text-white/30 hover:text-white transition-all group"
                >
                    <MdArrowBack className={`text-lg ${isRtl ? 'rotate-180' : ''}`} />
                    <span className="text-[11px] font-semibold tracking-wider">{t('admin.backToStore')}</span>
                </Link>
            </div>

            <div className="w-full max-w-[440px] z-10">
                <div className="bg-white/2 rounded-3xl border border-white/5 p-10 md:p-12 shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="mb-6">
                            <span className="text-3xl font-black tracking-tighter uppercase text-white">
                                TELE1<span className="text-accent">.</span>
                            </span>
                        </div>
                        <h1 className="text-white/60 text-[11px] font-semibold tracking-wider">
                            {t('admin.login.title')}
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider text-center animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label
                                className={`text-[11px] font-semibold tracking-wider text-white/20 block ${isRtl ? 'mr-1' : 'ml-1'}`}
                                htmlFor="username"
                            >
                                {t("admin.login.username")}
                            </label>
                            <div className="relative group/input">
                                <span className={`absolute inset-y-0 ${isRtl ? "right-0" : "left-0"} flex items-center ${isRtl ? "pr-4" : "pl-4"} text-white/10 group-focus-within/input:text-accent transition-colors`}>
                                    <MdPerson className="text-[18px]" />
                                </span>
                                <input
                                    className={`w-full ${inputPadding} py-4 bg-white/1 border border-white/5 rounded-2xl focus:border-accent/30 text-white placeholder:text-white/5 transition-all outline-none text-sm font-medium`}
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
                            <label
                                className={`text-[11px] font-semibold tracking-wider text-white/20 block ${isRtl ? 'mr-1' : 'ml-1'}`}
                                htmlFor="password"
                            >
                                {t("admin.login.password")}
                            </label>
                            <div className="relative group/input">
                                <span className={`absolute inset-y-0 ${isRtl ? "right-0" : "left-0"} flex items-center ${isRtl ? "pr-4" : "pl-4"} text-white/10 group-focus-within/input:text-accent transition-colors`}>
                                    <MdLock className="text-[18px]" />
                                </span>
                                <input
                                    className={`w-full ${inputPadding} py-4 bg-white/1 border border-white/5 rounded-2xl focus:border-accent/30 text-white placeholder:text-white/5 transition-all outline-none text-sm font-medium`}
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
                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-3 cursor-pointer group/check">
                                <input
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent focus:ring-accent/20 transition-all cursor-pointer"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="text-[11px] font-semibold tracking-widest text-white/20 group-hover/check:text-white/40 transition-colors">
                                    {t("admin.login.rememberMe")}
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full h-[56px] bg-accent hover:opacity-90 text-white font-black rounded-2xl transition-all transform active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider text-[12px]"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>{t("admin.login.signingIn")}</span>
                                </div>
                            ) : (
                                t("admin.login.submitButton")
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
