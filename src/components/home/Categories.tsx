"use client";
import Link from "next/link";
import { categories } from "@/lib/data";
import { useI18n } from "@/lib/i18n/provider";

export default function Categories() {
  const { t, lang } = useI18n();
  return (
    <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="h2 dark:text-white">{t.categories.title}</h2>
        <Link href="/offers" className="hidden lg:inline text-sm font-bold text-[#0E7C6B] dark:text-[#14B8A6]">{t.offers.seeAll}</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {(categories as any[]).slice(0,10).map(c=> {
          const name = lang==="ar" ? c.nameAr : lang==="en" ? c.nameEn : c.name;
          const countLabel = lang==="ar" ? "عرض" : lang==="en" ? "offers" : "offres";
          return (
          <Link key={c.id} href={`/offers?cat=${c.slug}`} className="group relative h-[150px] lg:h-[170px] rounded-[20px] overflow-hidden card-hover">
            <img src={c.image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="text-white font-bold leading-tight">{name}</div>
              <div className="text-white/80 text-xs">{c.count} {countLabel}</div>
            </div>
            <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/90 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition icon-3d">↗</div>
          </Link>
        )})}
      </div>
    </section>
  );
}
