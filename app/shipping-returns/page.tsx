import { getI18n } from "@/lib/i18n";
import { MdLocalShipping, MdAutorenew, MdSupportAgent } from "react-icons/md";

export const metadata = {
  title: 'Shipping & Returns | TELE1',
  description: 'Our shipping and returns policies designed for you.',
};

export default async function ShippingReturnsPage() {
  const { t } = await getI18n();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-black flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566576912906-253c7b320b72?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {t('shippingReturns.title')}
          </h1>
          <p className="text-white/60 uppercase tracking-[0.2em] text-xs md:text-sm font-bold animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {t('shippingReturns.subtitle')}
          </p>
        </div>
      </section>

      <div className="flex flex-col md:flex-row">
              {/* Shipping Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
                    <MdLocalShipping className="text-4xl" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-4">
                    {t('shippingReturns.shippingTitle')}
                </h2>
            </div>
            
            <div className="bg-zinc-50 p-8 md:p-12 rounded-3xl border border-zinc-100 text-center space-y-6">
                 <p className="text-zinc-600 leading-relaxed text-lg font-medium">{t('shippingReturns.shippingText1')}</p>
                 <p className="text-zinc-600 leading-relaxed text-lg font-medium">{t('shippingReturns.shippingText2')}</p>
            </div>
        </div>
      </section>

      {/* Returns Section */}
      <section className="py-16 px-4 md:px-8 bg-white border-t border-zinc-100">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
                    <MdAutorenew className="text-4xl" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-black mb-4">
                    {t('shippingReturns.returnsTitle')}
                </h2>
            </div>
            
            <div className="bg-zinc-50 p-8 md:p-12 rounded-3xl border border-zinc-100 text-center space-y-6">
                 <p className="text-zinc-600 leading-relaxed text-lg font-medium">{t('shippingReturns.returnsText1')}</p>
                 <p className="text-zinc-600 leading-relaxed text-lg font-medium">{t('shippingReturns.returnsText2')}</p>
            </div>
        </div>
      </section>
      </div>

      {/* Promise Section */}
      <section className="py-24 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center mb-16">
            {t('shippingReturns.policyTitle')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Secure Delivery */}
            <div className="bg-zinc-800/50 p-10 rounded-3xl border border-zinc-700/50 hover:border-accent/30 hover:bg-zinc-800 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-accent text-white transition-colors duration-300">
                <MdLocalShipping className="text-3xl" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{t('shippingReturns.secure')}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {t('shippingReturns.secureDesc')}
              </p>
            </div>

            {/* Easy Returns */}
            <div className="bg-zinc-800/50 p-10 rounded-3xl border border-zinc-700/50 hover:border-accent/30 hover:bg-zinc-800 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-accent text-white transition-colors duration-300">
                <MdAutorenew className="text-3xl" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{t('shippingReturns.easy')}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {t('shippingReturns.easyDesc')}
              </p>
            </div>

            {/* Support */}
            <div className="bg-zinc-800/50 p-10 rounded-3xl border border-zinc-700/50 hover:border-accent/30 hover:bg-zinc-800 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-zinc-700 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-accent text-white transition-colors duration-300">
                <MdSupportAgent className="text-3xl" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{t('shippingReturns.support')}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {t('shippingReturns.supportDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
