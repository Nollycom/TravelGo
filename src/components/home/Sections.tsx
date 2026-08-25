"use client";
import Link from "next/link";
import { destinations, offers, providers } from "@/lib/data";
import OfferCard from "@/components/offer/OfferCard";
import { useI18n } from "@/lib/i18n/provider";

export function OffersPopular() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="h2">{t.offers.popular}</h2>
          <p className="text-sm text-[#64748B]">{t.offers.sub}</p>
        </div>
        <Link href="/offers" className="hidden lg:inline-flex px-4 py-2 rounded-full border border-[#E2E8F0] bg-white text-sm font-bold">{t.offers.seeAll}</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {offers.slice(0,4).map(o=> <OfferCard key={o.id} offer={o} />)}
      </div>
    </section>
  );
}

export function DestinationsTrendy() {
  const { t, lang } = useI18n();
  return (
    <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <h2 className="h2 mb-4 dark:text-white">{t.destinations.trendy}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {(destinations as any[]).slice(0,8).map(d=>{
          const name = lang==="ar" ? d.nameAr : lang==="en" ? d.nameEn : d.name;
          const countryMap:any = { France:"فرنسا", Turquie:"تركيا", "Émirats arabes unis":"الإمارات", Maldives:"المالديف", Indonésie:"إندونيسيا", "Royaume-Uni":"المملكة المتحدة", Japon:"اليابان", Égypte:"مصر", Espagne:"إسبانيا", Italie:"إيطاليا", "États-Unis":"الولايات المتحدة", Thaïlande:"تايلاند" };
          const countryEnMap:any = { "Arabie Saoudite":"Saudi Arabia", "Émirats arabes unis":"UAE" };
          const country = lang==="ar" ? (countryMap[d.country] || d.country) : lang==="en" ? (countryEnMap[d.country] || d.country) : d.country;
          const offersLabel = lang==="ar" ? "عرض" : lang==="en" ? "offers" : "offres";
          return (
          <Link key={d.id} href="/offers" className="group relative h-[180px] rounded-[20px] overflow-hidden card-hover">
            <img src={d.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[#0F172A] text-xs font-bold px-2.5 py-1 rounded-full shadow">{d.offers} {offersLabel}</div>
            {d.sponsored && <div className="absolute top-3 right-3 bg-[#FF7A45] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">{t.offers.sponsored}</div>}
            <div className="absolute bottom-3 left-3">
              <div className="text-white font-extrabold text-lg leading-none">{name}</div>
              <div className="text-white/80 text-xs">{country}</div>
            </div>
          </Link>
        )})}
      </div>
    </section>
  );
}

export function SponsoredOffers() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-2">
      <div className="rounded-[20px] bg-gradient-to-r from-[#0E7C6B] to-[#14A085] dark:from-[#0F172A] dark:to-[#1A2332] dark:border dark:border-[#1E293B] p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-white overflow-hidden relative banner-hover">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div>
          <div className="inline-flex bg-white/15 border border-white/20 rounded-full px-3 py-1 text-xs font-bold">{t.offers.sponsored}</div>
          <h3 className="text-xl lg:text-2xl font-extrabold mt-2">{t.sponsors.title}</h3>
          <p className="text-white/85 text-sm mt-1 max-w-xl">{t.sponsors.desc}</p>
        </div>
        <Link href="/advertise" className="shrink-0 px-6 py-3 rounded-full bg-white text-[#0E7C6B] font-bold hover:bg-[#F8FAFB] transition">{t.sponsors.cta}</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {offers.slice(8,12).map(o=> <OfferCard key={o.id} offer={o} />)}
      </div>
    </section>
  );
}

export function ProvidersPopular() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="h2">{t.providers.popular}</h2>
        <Link href="/providers" className="text-sm font-bold text-[#0E7C6B]">{t.offers.seeAll} →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.slice(0,6).map(p=>(
          <Link key={p.id} href={`/providers/${p.slug}`} className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-4 flex gap-4 card-hover">
            <img src={p.logo} alt={p.name} className="h-14 w-14 rounded-2xl object-cover border border-[#E2E8F0]" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold truncate">{p.name}</span>
                {p.verified && <span className="h-4 w-4 rounded-full bg-[#0E7C6B] text-white flex items-center justify-center text-[9px]">✓</span>}
              </div>
              <div className="text-xs text-[#64748B]">{p.city} • {p.specialties.slice(0,2).join(" • ")}</div>
              <div className="text-xs text-[#0E7C6B] font-semibold mt-1">{p.offersCount} {t.providers.offers} • ★ {p.rating}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Banner() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-2">
      <div className="rounded-[20px] overflow-hidden border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] grid lg:grid-cols-2 banner-hover">
        <img src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=500&fit=crop" alt="banner" className="h-[240px] lg:h-auto w-full object-cover" />
        <div className="p-6 lg:p-8 flex flex-col justify-center">
          <div className="text-xs font-bold tracking-widest text-[#0E7C6B]">{t.banner.season}</div>
          <h3 className="text-2xl font-extrabold mt-2">{t.banner.title}</h3>
          <p className="text-sm text-[#64748B] mt-2">{t.banner.desc}</p>
          <div className="flex gap-3 mt-4">
            <Link href="/offers" className="px-6 py-3 rounded-full bg-[#0F172A] text-white font-bold text-sm">{t.banner.explore}</Link>
            <Link href="/quote" className="px-6 py-3 rounded-full border border-[#E2E8F0] bg-white font-bold text-sm">{t.banner.quote}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
