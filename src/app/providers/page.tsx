"use client";
import Link from "next/link";
import { providers } from "@/lib/data";
import { useI18n } from "@/lib/i18n/provider";

export default function ProvidersPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="h2 dark:text-white">{(t as any).providersPage.title}</h1>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{(t as any).providersPage.subtitle}</p>
        </div>
        <select className="hidden lg:block h-10 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] dark:text-white px-4 text-sm font-semibold"><option>{(t as any).providersPage.sortRelevant}</option><option>{(t as any).providersPage.sortRated}</option></select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map(p=>(
          <Link key={p.id} href={`/providers/${p.slug}`} className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden hover:shadow-md transition card-hover">
            <div className="h-24 relative">
              <img src={p.cover} alt={p.name} className="w-full h-full object-cover" />
              <img src={p.logo} alt={p.name} className="absolute -bottom-6 left-4 h-12 w-12 rounded-xl object-cover border-2 border-white dark:border-[#0F172A] shadow" />
              {p.featured && <span className="absolute top-3 right-3 bg-[#FF7A45] text-white text-xs font-bold px-2.5 py-1 rounded-full">En avant</span>}
            </div>
            <div className="pt-8 p-4">
              <div className="flex items-center gap-1.5">
                <span className="font-bold dark:text-white">{p.name}</span>
                {p.verified && <span className="h-4 w-4 rounded-full bg-[#0E7C6B] text-white flex items-center justify-center text-[9px]">✓</span>}
              </div>
              <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{p.city}, {p.country} • ★ {p.rating} ({p.reviews})</div>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] line-clamp-2 mt-2">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {p.specialties.map(s=> <span key={s} className="px-2.5 py-1 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white text-xs font-semibold">{s}</span>)}
              </div>
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="font-bold text-[#0E7C6B] dark:text-[#14B8A6]">{p.offersCount} {(t as any).providersPage.offers}</span>
                <span className="font-semibold dark:text-white">{(t as any).providersPage.viewProfile}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
