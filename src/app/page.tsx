"use client";
import Hero from "@/components/home/Hero";
import ReelsStrip from "@/components/home/ReelsStrip";
import Categories from "@/components/home/Categories";
import { OffersPopular, DestinationsTrendy, SponsoredOffers, ProvidersPopular, Banner } from "@/components/home/Sections";
import { offers } from "@/lib/data";
import OfferCard from "@/components/offer/OfferCard";
import { useI18n } from "@/lib/i18n/provider";

export default function Page() {
  const { t } = useI18n();
  return (
    <div>
      <Hero />
      <ReelsStrip />
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        <div className="rounded-[16px] bg-[#0F172A] dark:bg-[#0F172A] dark:border dark:border-[#1E293B] text-white px-4 py-3 flex items-center justify-between text-sm banner-hover">
          <span className="font-semibold">✨ {t.ctaProvider.desc} — <span className="text-[#FFB84D]">Essai Business 7 jours</span></span>
          <a href="/provider/dashboard" className="hidden lg:inline-flex px-4 py-1.5 rounded-full bg-white text-[#0F172A] font-bold text-xs icon-3d">Commencer</a>
        </div>
      </div>
      <Categories />
      <OffersPopular />
      <DestinationsTrendy />
      <SponsoredOffers />
      <ProvidersPopular />
      <Banner />
      <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
        <h2 className="h2 mb-4 dark:text-white">{t.recommended.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.slice(4,8).map(o=> <OfferCard key={o.id} offer={o} />)}
        </div>
      </section>
      <section className="mx-auto max-w-[1280px] px-4 lg:px-6 pb-10">
        <div className="rounded-[20px] bg-[#E6F4F1] dark:bg-[#0F172A] dark:border dark:border-[#1E293B] border border-[#CCEBE6] p-6 flex flex-col lg:flex-row items-center justify-between gap-4 banner-hover">
          <div>
            <h3 className="font-extrabold text-lg dark:text-white">{t.ctaProvider.title}</h3>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8]">{t.ctaProvider.desc}</p>
          </div>
          <a href="/provider/dashboard" className="px-6 py-3 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold hover:bg-[#0A5E51] icon-3d">{t.ctaProvider.cta}</a>
        </div>
      </section>
    </div>
  );
}
