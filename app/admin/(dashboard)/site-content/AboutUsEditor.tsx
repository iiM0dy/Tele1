"use client";

import { useState } from "react";
import { updateAboutUsContent } from "@/lib/site-content-actions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/app/context/LanguageContext";
import { MdSave, MdImage, MdHistoryEdu, MdStarOutline } from "react-icons/md";

interface AboutUsEditorProps {
    initialContent: any;
}

export default function AboutUsEditor({ initialContent }: AboutUsEditorProps) {
    const { t, dir } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialContent);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await updateAboutUsContent(formData);
            if (result.success) {
                toast.success(t('admin.aboutUsEditor.successUpdate'));
            } else {
                toast.error(result.error || t('admin.aboutUsEditor.errorUpdate'));
            }
        } catch (error) {
            console.error("Error updating content:", error);
            toast.error(t('admin.aboutUsEditor.errorGeneric'));
        } finally {
            setIsLoading(false);
        }
    };

    const SectionHeader = ({ icon: Icon, title, subtitle }: any) => (
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">{title}</h4>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-tight mt-1">{subtitle}</p>
            </div>
        </div>
    );

    const InputGroup = ({ label, name, value, placeholder, type = "text", ar = false }: any) => (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">
                {label} {ar && <span className="text-accent">(Arabic)</span>}
            </label>
            {type === "textarea" ? (
                <textarea
                    name={name}
                    value={value || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    rows={4}
                    dir={ar ? "rtl" : "ltr"}
                    className="w-full bg-white/3 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:border-accent/30 focus:bg-white/5 outline-none transition-all resize-none"
                />
            ) : (
                <input
                    type="text"
                    name={name}
                    value={value || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    dir={ar ? "rtl" : "ltr"}
                    className="w-full h-14 bg-white/3 border border-white/5 rounded-2xl px-5 text-sm text-white focus:border-accent/30 focus:bg-white/5 outline-none transition-all"
                />
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-16">
            {/* Hero Section */}
            <div className="space-y-8">
                <SectionHeader
                    icon={MdImage}
                    title={t('admin.aboutUsEditor.heroSection')}
                    subtitle={t('admin.aboutUsEditor.heroSectionDescription')}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <InputGroup
                            label={t('admin.aboutUsEditor.heroImage')}
                            name="heroImage"
                            value={formData.heroImage}
                            placeholder="https://images.unsplash.com/..."
                        />
                        {formData.heroImage && (
                            <div className="mt-4 rounded-2xl overflow-hidden aspect-21/9 border border-white/5">
                                <img src={formData.heroImage} className="w-full h-full object-cover" alt="Hero Preview" />
                            </div>
                        )}
                    </div>
                    <InputGroup label={t('admin.aboutUsEditor.titleEn')} name="titleEn" value={formData.titleEn} placeholder="About Us" />
                    <InputGroup label={t('admin.aboutUsEditor.titleAr')} name="titleAr" value={formData.titleAr} placeholder="من نحن" ar />
                    <InputGroup label={t('admin.aboutUsEditor.subtitleEn')} name="subtitleEn" value={formData.subtitleEn} placeholder="Our mission..." />
                    <InputGroup label={t('admin.aboutUsEditor.subtitleAr')} name="subtitleAr" value={formData.subtitleAr} placeholder="مهمتنا..." ar />
                </div>
            </div>

            {/* Narrative Section */}
            <div className="space-y-8">
                <SectionHeader
                    icon={MdHistoryEdu}
                    title={t('admin.aboutUsEditor.ourStory')}
                    subtitle={t('admin.aboutUsEditor.ourStoryDescription')}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <InputGroup
                            label={t('admin.aboutUsEditor.storyImage')}
                            name="storyImage"
                            value={formData.storyImage}
                            placeholder="https://images.unsplash.com/..."
                        />
                        {formData.storyImage && (
                            <div className="mt-4 rounded-2xl overflow-hidden aspect-video max-w-md border border-white/5">
                                <img src={formData.storyImage} className="w-full h-full object-cover" alt="Story Preview" />
                            </div>
                        )}
                    </div>
                    <InputGroup label={t('admin.aboutUsEditor.storyTitleEn')} name="storyTitleEn" value={formData.storyTitleEn} />
                    <InputGroup label={t('admin.aboutUsEditor.storyTitleAr')} name="storyTitleAr" value={formData.storyTitleAr} ar />
                    <InputGroup label={t('admin.aboutUsEditor.storyText1En')} name="storyText1En" value={formData.storyText1En} type="textarea" />
                    <InputGroup label={t('admin.aboutUsEditor.storyText1Ar')} name="storyText1Ar" value={formData.storyText1Ar} type="textarea" ar />
                    <InputGroup label={t('admin.aboutUsEditor.storyText2En')} name="storyText2En" value={formData.storyText2En} type="textarea" />
                    <InputGroup label={t('admin.aboutUsEditor.storyText2Ar')} name="storyText2Ar" value={formData.storyText2Ar} type="textarea" ar />
                </div>
            </div>

            {/* Values Section */}
            <div className="space-y-8">
                <SectionHeader
                    icon={MdStarOutline}
                    title={t('admin.aboutUsEditor.coreValues')}
                    subtitle={t('admin.aboutUsEditor.coreValuesDescription')}
                />
                <div className="grid grid-cols-1 gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white/2 rounded-3xl border border-white/5">
                        <div className="md:col-span-2 font-black text-xs text-accent uppercase tracking-widest border-b border-white/5 pb-4">
                            {t('admin.aboutUsEditor.value1Quality')}
                        </div>
                        <InputGroup label={t('admin.aboutUsEditor.titleEn')} name="qualityTitleEn" value={formData.qualityTitleEn} />
                        <InputGroup label={t('admin.aboutUsEditor.titleAr')} name="qualityTitleAr" value={formData.qualityTitleAr} ar />
                        <InputGroup label={t('admin.aboutUsEditor.descriptionEn')} name="qualityDescEn" value={formData.qualityDescEn} type="textarea" />
                        <InputGroup label={t('admin.aboutUsEditor.descriptionAr')} name="qualityDescAr" value={formData.qualityDescAr} type="textarea" ar />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white/2 rounded-3xl border border-white/5">
                        <div className="md:col-span-2 font-black text-xs text-accent uppercase tracking-widest border-b border-white/5 pb-4">
                            {t('admin.aboutUsEditor.value2Innovation')}
                        </div>
                        <InputGroup label={t('admin.aboutUsEditor.titleEn')} name="innovationTitleEn" value={formData.innovationTitleEn} />
                        <InputGroup label={t('admin.aboutUsEditor.titleAr')} name="innovationTitleAr" value={formData.innovationTitleAr} ar />
                        <InputGroup label={t('admin.aboutUsEditor.descriptionEn')} name="innovationDescEn" value={formData.innovationDescEn} type="textarea" />
                        <InputGroup label={t('admin.aboutUsEditor.descriptionAr')} name="innovationDescAr" value={formData.innovationDescAr} type="textarea" ar />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white/2 rounded-3xl border border-white/5">
                        <div className="md:col-span-2 font-black text-xs text-accent uppercase tracking-widest border-b border-white/5 pb-4">
                            {t('admin.aboutUsEditor.value3CustomerFocus')}
                        </div>
                        <InputGroup label={t('admin.aboutUsEditor.titleEn')} name="customerTitleEn" value={formData.customerTitleEn} />
                        <InputGroup label={t('admin.aboutUsEditor.titleAr')} name="customerTitleAr" value={formData.customerTitleAr} ar />
                        <InputGroup label={t('admin.aboutUsEditor.descriptionEn')} name="customerDescEn" value={formData.customerDescEn} type="textarea" />
                        <InputGroup label={t('admin.aboutUsEditor.descriptionAr')} name="customerDescAr" value={formData.customerDescAr} type="textarea" ar />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-8">
                <SectionHeader
                    icon={MdImage}
                    title={t('admin.aboutUsEditor.ctaSection')}
                    subtitle={t('admin.aboutUsEditor.ctaSectionDescription')}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <InputGroup
                            label={t('admin.aboutUsEditor.ctaImage')}
                            name="ctaImage"
                            value={formData.ctaImage}
                            placeholder="https://images.unsplash.com/..."
                        />
                        {formData.ctaImage && (
                            <div className="mt-4 rounded-2xl overflow-hidden aspect-[21/9] border border-white/5">
                                <img src={formData.ctaImage} className="w-full h-full object-cover" alt="CTA Preview" />
                            </div>
                        )}
                    </div>
                    <InputGroup label={t('admin.aboutUsEditor.ctaTitleEn')} name="ctaTitleEn" value={formData.ctaTitleEn} />
                    <InputGroup label={t('admin.aboutUsEditor.ctaTitleAr')} name="ctaTitleAr" value={formData.ctaTitleAr} ar />
                    <InputGroup label={t('admin.aboutUsEditor.ctaSubtitleEn')} name="ctaSubtitleEn" value={formData.ctaSubtitleEn} />
                    <InputGroup label={t('admin.aboutUsEditor.ctaSubtitleAr')} name="ctaSubtitleAr" value={formData.ctaSubtitleAr} ar />
                    <InputGroup label={t('admin.aboutUsEditor.ctaButtonTextEn')} name="ctaButtonTextEn" value={formData.ctaButtonTextEn} />
                    <InputGroup label={t('admin.aboutUsEditor.ctaButtonTextAr')} name="ctaButtonTextAr" value={formData.ctaButtonTextAr} ar />
                </div>
            </div>

            <div className="sticky bottom-0 py-8 border-t border-white/5 flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-3 bg-accent text-white px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:opacity-90 transition-all disabled:opacity-50 shadow-2xl shadow-accent/20"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <MdSave size={20} />
                    )}
                    {isLoading ? t('admin.saving') : t('admin.saveChanges')}
                </button>
            </div>
        </form>
    );
}
