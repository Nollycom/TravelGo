"use client";
import OfferCard from "@/components/offer/OfferCard";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export default function ProviderDetailClient({ provider, provOffers, offers }: { provider:any; provOffers:any[]; offers:any[] }){
  const { t } = useI18n();
  const od = (t as any).offerDetail;
  return (
    <div>
      <div className="h-[220px] lg:h-[300px] relative">
        <img src={provider.cover} alt={provider.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6 -mt-12 relative flex flex-col lg:flex-row gap-6">
          <img src={provider.logo} alt={provider.name} className="h-20 w-20 rounded-2xl object-cover border border-[#E2E8F0] dark:border-[#1E293B] -mt-2" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black dark:text-white">{provider.name}</h1>
              {provider.verified && <span className="bg-[#0E7C6B] dark:bg-[#14B8A6] text-white text-xs font-bold px-2.5 py-1 rounded-full">✓ {od.verified}</span>}
              <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">★ {provider.rating} • {provider.reviews} avis</span>
            </div>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-2 max-w-2xl">{provider.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {provider.specialties.map((s:string)=> <span key={s} className="px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white text-xs font-bold">{s}</span>)}
            </div>
          </div>
          <div className="lg:w-[320px] grid gap-2">
            <a href={`https://wa.me/${provider.whatsapp.replace(/\D/g,'')}`} target="_blank" className="h-11 rounded-full bg-[#25D366] text-white font-bold flex items-center justify-center">{od.whatsapp}</a>
            <a href={`tel:${provider.phone}`} className="h-11 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold flex items-center justify-center">{od.call} {provider.phone}</a>
            <div className="grid grid-cols-2 gap-2">
              <a href="#" className="h-10 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white flex items-center justify-center text-sm font-semibold">{od.website}</a>
              <Link href="/quote" className="h-10 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white flex items-center justify-center text-sm font-semibold">{od.quote}</Link>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-6">
          <div>
            <h2 className="font-extrabold text-lg mb-3 dark:text-white">{(t as any).offersPage.allOffers} ({provOffers.length || 3})</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {(provOffers.length? provOffers : offers.slice(0,2)).map((o:any)=> <OfferCard key={o.id} offer={o} />)}
            </div>
            <h3 className="font-bold mt-6 mb-2 dark:text-white">Galerie</h3>
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map(i=> <img key={i} src={`https://picsum.photos/seed/${provider.id}${i}/400/300`} alt="" className="h-24 lg:h-32 w-full object-cover rounded-2xl" />)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-5">
              <div className="font-bold mb-3 dark:text-white">Informations</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#64748B] dark:text-[#94A3B8]">Ville</span><span className="font-semibold dark:text-white">{provider.city}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B] dark:text-[#94A3B8]">Licence</span><span className="font-semibold dark:text-white">AV-2024-{provider.id.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B] dark:text-[#94A3B8]">Membre depuis</span><span className="font-semibold dark:text-white">2021</span></div>
                <div className="flex justify-between"><span className="text-[#64748B] dark:text-[#94A3B8]">Taux réponse</span><span className="font-semibold text-[#0E7C6B] dark:text-[#14B8A6]">98%</span></div>
              </div>
            </div>
            <div className="bg-[#0F172A] text-white rounded-[20px] p-5">
              <div className="font-bold">Statistiques publiques</div>
              <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                <div><div className="text-xl font-black">{provider.offersCount}</div><div className="text-xs opacity-70">{(t as any).offersPage.offersCount}</div></div>
                <div><div className="text-xl font-black">1.2k</div><div className="text-xs opacity-70">Favoris</div></div>
                <div><div className="text-xl font-black">4.8</div><div className="text-xs opacity-70">Note</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
