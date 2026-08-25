"use client";
import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export default function SmartSearch() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"smart"|"filters">("smart");
  const chips = (t as any).search.chips as string[] || ["Vol + Hôtel","Chalets","Croisière","Lune de miel","Famille","Luxe"];
  return (
    <div className="bg-white dark:bg-[#0F172A] dark:border dark:border-[#1E293B] rounded-[24px] p-3 lg:p-4 shadow-xl shadow-black/10 max-w-5xl">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={()=>setMode("smart")} className={`px-4 py-2 rounded-full text-sm font-bold ${mode==="smart" ? "bg-[#0F172A] dark:bg-white dark:text-black text-white" : "bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-[#94A3B8] text-[#334155]"}`}>{t.search.smart}</button>
        <button onClick={()=>setMode("filters")} className={`px-4 py-2 rounded-full text-sm font-bold ${mode==="filters" ? "bg-[#0F172A] dark:bg-white dark:text-black text-white" : "bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-[#94A3B8] text-[#334155]"}`}>{t.search.filters}</button>
        <span className="ml-auto hidden lg:inline text-xs text-[#94A3B8] dark:text-[#64748B]">{t.search.try}</span>
      </div>
      {mode==="smart" ? (
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">⌕</span>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search.placeholder} className="w-full h-[56px] pl-11 pr-4 rounded-full bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white border border-[#E2E8F0] dark:border-[#1E293B] focus:bg-white dark:focus:bg-[#0F172A] focus:border-[#0E7C6B] outline-none text-[15px] dark:placeholder:text-[#64748B]" />
          </div>
          <Link href={`/offers?q=${encodeURIComponent(q)}`} className="hidden lg:inline-flex h-[56px] px-8 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold items-center hover:bg-[#0A5E51] transition icon-3d">{t.search.search}</Link>
          <Link href={`/offers?q=${encodeURIComponent(q)}`} className="lg:hidden h-[56px] w-[56px] rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white flex items-center justify-center icon-3d">⌕</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <select className="h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm font-semibold"><option>Destination</option><option>Paris</option><option>Istanbul</option><option>Dubai</option><option>Maldives</option></select>
          <input type="date" className="h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm" />
          <select className="h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm font-semibold"><option>2 voyageurs</option><option>1</option><option>3</option><option>4+</option></select>
          <select className="h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm font-semibold"><option>Budget</option><option>0-2000 SAR</option><option>2000-5000 SAR</option><option>5000+ SAR</option></select>
          <select className="h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm font-semibold"><option>Type</option><option>Lune de miel</option><option>Famille</option></select>
          <Link href="/offers" className="h-12 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold flex items-center justify-center">{t.search.search}</Link>
        </div>
      )}
      <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
        {chips.map(chip=>(
          <Link key={chip} href="/offers" className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] text-sm font-semibold text-[#334155] dark:text-[#94A3B8] hover:bg-[#0E7C6B] dark:hover:bg-[#14B8A6] hover:text-white dark:hover:text-white transition">{chip}</Link>
        ))}
      </div>
    </div>
  );
}
