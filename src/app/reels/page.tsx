"use client";
import { reels } from "@/lib/data";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

export default function ReelsPage() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <h1 className="h2 dark:text-white">{(t as any).reelsPage.title}</h1>
      <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">{(t as any).reelsPage.sub}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(reels as any[]).map((r, idx)=>{
          const title = lang==="ar" ? r.titleAr : lang==="en" ? r.titleEn : r.title;
          return (
          <button key={r.id} onClick={()=>setActive(idx)} className="text-left group relative h-[380px] rounded-[20px] overflow-hidden border border-[#E2E8F0] dark:border-[#1E293B] card-hover">
            <img src={r.cover} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center text-lg icon-3d">▶</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-1.5">
                <img src={r.provider.logo} alt="" className="h-6 w-6 rounded-full border-2 border-white" />
                <span className="text-white text-xs font-bold truncate">{r.provider.name}</span>
              </div>
              <div className="text-white text-sm font-bold leading-tight mt-1">{title}</div>
              <div className="text-white/80 text-xs">{r.views} {(t as any).reelsPage.views}</div>
            </div>
          </button>
        )})}
      </div>
      {active!==null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={()=>setActive(null)}>
          <div className="relative w-full max-w-[360px] h-[640px] bg-black rounded-[20px] overflow-hidden" onClick={e=>e.stopPropagation()}>
            <img src={(reels as any[])[active].cover} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button onClick={()=>setActive(null)} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center">✕</button>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="text-white font-bold">{lang==="ar" ? (reels as any[])[active].titleAr : lang==="en" ? (reels as any[])[active].titleEn : (reels as any[])[active].title}</div>
              <div className="text-white/80 text-sm">{(reels as any[])[active].provider.name} • {(t as any).reelsPage.verified}</div>
              <div className="flex gap-2 mt-3">
                <Link href={`/offers/${(reels as any[])[active].offerId || 'riyad-paris-7j'}`} className="flex-1 h-11 rounded-full bg-white text-[#0F172A] font-bold flex items-center justify-center">{lang==="ar" ? "عرض العرض" : lang==="en" ? "View offer" : "Voir l'offre"}</Link>
                <a href="#" className="flex-1 h-11 rounded-full bg-[#0E7C6B] text-white font-bold flex items-center justify-center">{lang==="ar" ? "تواصل" : lang==="en" ? "Contact" : "Contacter"}</a>
              </div>
              <div className="flex justify-between mt-3">
                <button onClick={()=>setActive(v=> Math.max(0, (v??0)-1))} className="text-white/80 text-sm">↑ Précédent</button>
                <button onClick={()=>setActive(v=> Math.min(reels.length-1, (v??0)+1))} className="text-white/80 text-sm">Suivant ↓</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
