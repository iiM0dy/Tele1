import { getAboutUsContent } from "@/lib/site-content-actions";
import AboutUsEditor from "./AboutUsEditor";
import { getI18n } from "@/lib/i18n";

export default async function SiteContentPage() {
    const { content } = await getAboutUsContent();
    const { t } = await getI18n();

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 scrollbar-hide">
                <div className="max-w-[1200px] mx-auto pb-10">
                    <div className="flex flex-col mb-10">
                        <h3 className="text-3xl font-black text-white uppercase tracking-[0.2em]">
                            {t('admin.siteContent')}
                        </h3>
                        <p className="text-white/60 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
                            {t('admin.siteContentDescription')}
                        </p>
                    </div>

                    <div className="bg-white/2 rounded-[2.5rem] border border-white/5 overflow-hidden">
                        <div className="flex border-b border-white/5 bg-white/1">
                            <button className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-accent border-b-2 border-accent">
                                {t('admin.aboutUsPage')}
                            </button>
                        </div>

                        <div className="p-8 sm:p-10">
                            <AboutUsEditor initialContent={content} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
