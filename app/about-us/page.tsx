import { getI18n } from "@/lib/i18n";
import { getAboutUsContent } from "@/lib/site-content-actions";
import { MdVerified, MdLightbulb, MdPeople } from "react-icons/md";

export const metadata = {
  title: 'About Us | TELE1',
  description: 'Learn more about TELE1, our mission, and our commitment to quality electronics.',
};

export default async function AboutUsPage() {
  const { t, language } = await getI18n();
  const { content } = await getAboutUsContent();

  const isAr = language === 'ar';

  const data = {
    title: isAr ? (content?.titleAr || t('about.title')) : (content?.titleEn || t('about.title')),
    subtitle: isAr ? (content?.subtitleAr || t('about.subtitle')) : (content?.subtitleEn || t('about.subtitle')),
    heroImage: content?.heroImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",

    storyTitle: isAr ? (content?.storyTitleAr || t('about.storyTitle')) : (content?.storyTitleEn || t('about.storyTitle')),
    storyText1: isAr ? (content?.storyText1Ar || t('about.storyText1')) : (content?.storyText1En || t('about.storyText1')),
    storyText2: isAr ? (content?.storyText2Ar || t('about.storyText2')) : (content?.storyText2En || t('about.storyText2')),
    storyImage: content?.storyImage || "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1000&auto=format&fit=crop",

    valuesTitle: isAr ? (content?.valuesTitleAr || t('about.valuesTitle')) : (content?.valuesTitleEn || t('about.valuesTitle')),

    qualityTitle: isAr ? (content?.qualityTitleAr || t('about.quality')) : (content?.qualityTitleEn || t('about.quality')),
    qualityDesc: isAr ? (content?.qualityDescAr || t('about.qualityDesc')) : (content?.qualityDescEn || t('about.qualityDesc')),

    innovationTitle: isAr ? (content?.innovationTitleAr || t('about.innovation')) : (content?.innovationTitleEn || t('about.innovation')),
    innovationDesc: isAr ? (content?.innovationDescAr || t('about.innovationDesc')) : (content?.innovationDescEn || t('about.innovationDesc')),

    customerTitle: isAr ? (content?.customerTitleAr || t('about.customer')) : (content?.customerTitleEn || t('about.customer')),
    customerDesc: isAr ? (content?.customerDescAr || t('about.customerDesc')) : (content?.customerDescEn || t('about.customerDesc')),

    ctaTitle: isAr ? (content?.ctaTitleAr || t('home.innovationFirst')) : (content?.ctaTitleEn || t('home.innovationFirst')),
    ctaDesc: isAr ? (content?.ctaDescAr || t('home.innovationDesc')) : (content?.ctaDescEn || t('home.innovationDesc')),
    ctaImage: content?.ctaImage || content?.heroImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-black flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-1000"
          style={{ backgroundImage: `url('${data.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {data.title}
          </h1>
          <p className="text-white/60 uppercase tracking-[0.2em] text-sm md:text-base font-bold animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {data.subtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4 md:px-[48px] bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-4/5 bg-zinc-100 rounded-2xl overflow-hidden group shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${data.storyImage}')` }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">
              {data.storyTitle}
            </h2>
            <div className="space-y-6 text-zinc-600 leading-relaxed text-lg font-medium">
              <p>{data.storyText1}</p>
              <p>{data.storyText2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 md:px-[48px]">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center mb-16">
            {data.valuesTitle}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Quality */}
            <div className="bg-white p-10 rounded-3xl border border-zinc-100 hover:border-accent/30 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent text-accent group-hover:text-white transition-colors duration-300">
                <MdVerified className="text-4xl" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{data.qualityTitle}</h3>
              <p className="text-zinc-500 leading-relaxed">
                {data.qualityDesc}
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-white p-10 rounded-3xl border border-zinc-100 hover:border-accent/30 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent text-accent group-hover:text-white transition-colors duration-300">
                <MdLightbulb className="text-4xl" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{data.innovationTitle}</h3>
              <p className="text-zinc-500 leading-relaxed">
                {data.innovationDesc}
              </p>
            </div>

            {/* Customer Focus */}
            <div className="bg-white p-10 rounded-3xl border border-zinc-100 hover:border-accent/30 hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent text-accent group-hover:text-white transition-colors duration-300">
                <MdPeople className="text-4xl" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{data.customerTitle}</h3>
              <p className="text-zinc-500 leading-relaxed">
                {data.customerDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white text-center px-4 md:px-[48px] relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${data.ctaImage}')` }} />
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            {data.ctaTitle}
          </h2>
          <p className="text-white/60 uppercase tracking-widest text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {data.ctaDesc}
          </p>
        </div>
      </section>
    </div>
  );
}
