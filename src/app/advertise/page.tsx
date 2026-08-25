"use client";
import { useI18n } from "@/lib/i18n/provider";

export default function AdvertisePage() {
  const { t } = useI18n();
  const ad = (t as any).advertisePage;
  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="rounded-[20px] bg-gradient-to-r from-[#0F172A] to-[#1E3A3A] dark:from-[#0F172A] dark:to-[#1A2332] text-white p-8 border dark:border-[#1E293B]">
        <h1 className="text-3xl font-black">{ad.title}</h1>
        <p className="text-white/80 mt-2 max-w-2xl">{ad.sub}</p>
        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          {[
            [ad.impressions,"2.4M"],
            [ad.ctr,"4.1%"],
            [ad.cpc,"2.3 SAR"],
            [ad.roas,"x6.2"],
          ].map(([k,v])=>(
            <div key={k as string} className="rounded-2xl bg-white/10 border border-white/15 p-4 text-center">
              <div className="text-xs opacity-70">{k as string}</div>
              <div className="text-xl font-black">{v as string}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        {[
          { name:"Homepage Hero Banner", price:"5 000 SAR / sem", place:"Top homepage"},
          { name:"Sponsored Offer", price:"1 200 SAR / sem", place:"Top recherche"},
          { name:"Featured Destination", price:"3 000 SAR / sem", place:"Bloc destinations"},
        ].map(c=>(
          <div key={c.name} className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
            <div className="font-bold dark:text-white">{c.name}</div>
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">{c.place}</div>
            <div className="font-black mt-2 dark:text-white">{c.price}</div>
            <button className="w-full mt-4 h-11 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold">{ad.cta}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
