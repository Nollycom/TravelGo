"use client";
import { useState, useMemo } from "react";
import OfferCard from "@/components/offer/OfferCard";
import { offers as allOffers } from "@/lib/data";
import { useI18n } from "@/lib/i18n/provider";

export default function OffersPage() {
  const { t } = useI18n();
  const [selectedDest, setSelectedDest] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [duration, setDuration] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [sort, setSort] = useState("relevance");

  const toggleDest = (d:string)=> setSelectedDest(s=> s.includes(d) ? s.filter(x=>x!==d) : [...s,d]);
  const toggleService = (s:string)=> setServices(v=> v.includes(s) ? v.filter(x=>x!==s) : [...v,s]);

  const filtered = useMemo(()=>{
    let list = [...allOffers] as any[];
    if(selectedDest.length) list = list.filter(o=> selectedDest.includes(o.destination));
    if(priceMin) list = list.filter(o=> o.price >= parseInt(priceMin));
    if(priceMax) list = list.filter(o=> o.price <= parseInt(priceMax));
    if(duration){
      const map:any = {"Week-end":2,"3j":3,"5j":5,"7j":7,"10j+":10};
      const d = map[duration] || 0;
      if(d) list = list.filter(o=> duration==="Week-end" ? o.durationDays<=2 : duration==="10j+" ? o.durationDays>=10 : o.durationDays===d);
    }
    if(services.length){
      list = list.filter(o=> services.every(s=> o.includes.some((inc:string)=> inc.toLowerCase().includes(s.toLowerCase()))));
    }
    if(sort==="priceAsc") list.sort((a,b)=>a.price-b.price);
    else if(sort==="priceDesc") list.sort((a,b)=>b.price-a.price);
    else if(sort==="popular") list.sort((a,b)=>b.views-a.views);
    else if(sort==="recent") list.sort((a,b)=>b.saves-a.saves);
    return list;
  }, [selectedDest, priceMin, priceMax, duration, services, sort]);

  const reset = ()=>{ setSelectedDest([]); setPriceMin(""); setPriceMax(""); setDuration(""); setServices([]); setSort("relevance"); };

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-[280px] shrink-0">
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-5 sticky top-[76px]">
            <h3 className="font-extrabold mb-4 dark:text-white">{(t as any).offersPage.filters}</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-bold mb-2 dark:text-white">{(t as any).offersPage.destination}</div>
                <div className="space-y-1 text-[#475569] dark:text-[#94A3B8]">
                  {["Paris","Istanbul","Dubai","Maldives","Bali","London"].map(d=>(
                    <label key={d} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={selectedDest.includes(d)} onChange={()=>toggleDest(d)} /> {d}</label>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#F1F5F9] dark:border-[#1E293B] pt-4">
                <div className="font-bold mb-2 dark:text-white">{(t as any).offersPage.price}</div>
                <div className="flex gap-2">
                  <input value={priceMin} onChange={e=>setPriceMin(e.target.value)} placeholder={(t as any).offersPage.min} type="number" className="w-full h-10 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-3 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" />
                  <input value={priceMax} onChange={e=>setPriceMax(e.target.value)} placeholder={(t as any).offersPage.max} type="number" className="w-full h-10 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-3 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" />
                </div>
              </div>
              <div className="border-t border-[#F1F5F9] dark:border-[#1E293B] pt-4">
                <div className="font-bold mb-2 dark:text-white">{(t as any).offersPage.duration}</div>
                <div className="flex flex-wrap gap-2">
                  {["Week-end","3j","5j","7j","10j+"].map(d=> <button key={d} onClick={()=>setDuration(duration===d?"":d)} className={`px-3 py-1.5 rounded-full font-semibold ${duration===d?"bg-[#0E7C6B] dark:bg-[#14B8A6] text-white":"bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white"}`}>{d}</button>)}
                </div>
              </div>
              <div className="border-t border-[#F1F5F9] dark:border-[#1E293B] pt-4">
                <div className="font-bold mb-2 dark:text-white">{(t as any).offersPage.services}</div>
                <div className="space-y-1 text-[#475569] dark:text-[#94A3B8]">
                  {["Vol","Hôtel","Transfert"].map(s=>(
                    <label key={s} className="flex gap-2 cursor-pointer"><input type="checkbox" checked={services.includes(s)} onChange={()=>toggleService(s)}/> {s}</label>
                  ))}
                </div>
              </div>
              <button onClick={reset} className="w-full h-11 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white font-bold">{(t as any).offersPage.reset}</button>
              <div className="text-xs text-[#94A3B8] text-center">{filtered.length} {(t as any).offersPage.offersCount} • {(t as any).offersPage.sortBy}</div>
            </div>
          </div>
        </aside>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="h2 dark:text-white">{(t as any).offersPage.allOffers}</h1>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{filtered.length} {(t as any).offersPage.offersCount} • {(t as any).offersPage.sortBy}</p>
            </div>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="h-10 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] dark:text-white px-4 text-sm font-semibold">
              <option value="relevance">{(t as any).offersPage.sortRelevance}</option><option value="priceAsc">{(t as any).offersPage.sortPriceAsc}</option><option value="priceDesc">{(t as any).offersPage.sortPriceDesc}</option><option value="popular">{(t as any).offersPage.popular}</option><option value="recent">Plus récent</option>
            </select>
          </div>
          {filtered.length===0 ? (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-10 text-center">
              <div className="text-3xl">🔍</div><div className="font-bold dark:text-white mt-2">Aucun résultat</div><p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Ajuste les filtres ou réinitialise.</p><button onClick={reset} className="mt-3 px-4 py-2 rounded-full bg-[#0E7C6B] text-white text-sm">Réinitialiser</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((o:any)=> <OfferCard key={o.id} offer={o} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
