"use client";
import Link from "next/link";
import { reels } from "@/lib/data";
import { useI18n } from "@/lib/i18n/provider";

export default function ReelsStrip() {
  const { t, lang } = useI18n();
  const title = lang==="ar" ? "ريلز TravGo" : lang==="en" ? "TravGo Reels" : "TravGo Reels";
  const seeAll = lang==="ar" ? "عرض الكل →" : lang==="en" ? "See all →" : "Voir tout →";
  return (
    <section className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="h2 dark:text-white">{title}</h2>
        <Link href="/reels" className="text-sm font-bold text-[#0E7C6B] dark:text-[#14B8A6] hover:underline">{seeAll}</Link>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {(reels as any[]).map(r=>{
          const name = lang==="ar" ? r.titleAr : lang==="en" ? r.titleEn : r.title;
          const viewsLabel = lang==="ar" ? "مشاهدة" : lang==="en" ? "views" : "vues";
          return (
          <Link key={r.id} href="/reels" className="shrink-0 w-[148px] group">
            <div className="relative h-[220px] rounded-[20px] overflow-hidden border border-[#E2E8F0] dark:border-[#1E293B] card-hover">
              <img src={r.cover} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white text-[11px] font-bold px-2 py-1 rounded-full">{r.views} {viewsLabel}</div>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center gap-1.5">
                  <img src={r.provider.logo} alt={r.provider.name} className="h-6 w-6 rounded-full border-2 border-white object-cover" />
                  <span className="text-white text-xs font-bold truncate">{r.provider.name}</span>
                  {r.verified && <span className="h-3 w-3 rounded-full bg-[#0E7C6B] flex items-center justify-center text-[8px] text-white">✓</span>}
                </div>
                <div className="text-white text-xs font-semibold leading-tight mt-1 line-clamp-2">{name}</div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center icon-3d">▶</div>
              </div>
            </div>
          </Link>
        )})}
        <Link href="/reels" className="shrink-0 w-[148px] h-[220px] rounded-[20px] border-2 border-dashed border-[#CBD5E1] dark:border-[#1E293B] flex flex-col items-center justify-center gap-2 bg-[#F8FAFB] dark:bg-[#0F172A] hover:bg-white dark:hover:bg-[#1A2332] transition card-hover">
          <span className="h-10 w-10 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white flex items-center justify-center text-xl icon-3d">+</span>
          <span className="text-sm font-bold text-[#334155] dark:text-white">{lang==="ar"?"استكشاف": lang==="en"?"Explore":"Explorer"}</span>
        </Link>
      </div>
    </section>
  );
}
