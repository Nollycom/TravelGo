"use client";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { offerTranslations } from "@/lib/data";

export default function OfferDetailClient({ offer }: { offer:any }){
  const { t, lang } = useI18n();
  const tr = (offerTranslations as any)[offer.id];
  const title = lang==="ar" ? (tr?.ar || offer.title) : lang==="en" ? (tr?.en || offer.title) : offer.title;
  const duration = lang==="ar" ? (tr?.durationAr || offer.duration) : lang==="en" ? (tr?.durationEn || offer.duration) : offer.duration;
  const od = (t as any).offerDetail;
  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
        <div>
          <div className="relative rounded-[20px] overflow-hidden">
            <img src={offer.image} alt={title} className="w-full h-[380px] lg:h-[480px] object-cover" />
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur rounded-full px-3 py-1.5 text-xs font-bold dark:text-white">{offer.destination} • {offer.country}</div>
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto no-scrollbar">
              {offer.images.map((img:string,i:number)=>(<img key={i} src={img} alt="" className="h-16 w-24 rounded-xl object-cover border-2 border-white shrink-0" />))}
            </div>
          </div>
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
              <span className="font-bold text-[#0E7C6B] dark:text-[#14B8A6]">{offer.provider.name}</span>
              <span className="bg-[#0E7C6B] dark:bg-[#14B8A6] text-white text-xs font-bold px-2 py-0.5 rounded-full">{od.verified}</span>
              <span>• ★ {offer.rating}</span>
            </div>
            <h1 className="text-[26px] lg:text-[30px] font-extrabold leading-tight mt-2 dark:text-white">{title}</h1>
            <div className="flex flex-wrap gap-2 mt-3 text-sm">
              <span className="px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white font-semibold">{duration}</span>
              <span className="px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white font-semibold">{offer.cityFrom} → {offer.destination}</span>
              <span className="px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white font-semibold">{offer.dates}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border border-[#E2E8F0] dark:border-[#1E293B] p-4">
                <div className="font-bold mb-2 dark:text-white">{od.included}</div>
                <ul className="space-y-1 text-sm text-[#334155] dark:text-[#94A3B8]">{offer.includes.map((i:string)=> <li key={i} className="flex gap-2"><span className="text-[#10B981]">✓</span>{i}</li>)}</ul>
              </div>
              <div className="rounded-2xl bg-white dark:bg-[#1A2332] border border-[#E2E8F0] dark:border-[#1E293B] p-4">
                <div className="font-bold mb-2 dark:text-white">{od.programme}</div>
                <ol className="space-y-2 text-sm text-[#475569] dark:text-[#94A3B8]">
                  <li><b>{od.day1}</b></li>
                  <li><b>{od.day2}</b></li>
                  <li><b>{od.day7}</b></li>
                </ol>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="font-bold dark:text-white">{od.provider}</h3>
              <Link href={`/providers/${offer.provider.slug}`} className="mt-2 flex gap-3 p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] hover:bg-[#F8FAFB] dark:hover:bg-[#1A2332] transition">
                <img src={offer.provider.logo} alt={offer.provider.name} className="h-12 w-12 rounded-xl object-cover" />
                <div>
                  <div className="font-bold dark:text-white">{offer.provider.name}</div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{offer.provider.city} • {offer.provider.specialties.join(" • ")}</div>
                </div>
                <span className="ml-auto text-sm font-bold text-[#0E7C6B] dark:text-[#14B8A6]">{od.viewProfile}</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:sticky lg:top-[76px] h-fit space-y-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">{od.from}</div>
            <div className="text-3xl font-black dark:text-white">{formatPrice(offer.price, offer.currency)}</div>
            <div className="text-xs text-[#94A3B8]">{od.perPerson}</div>
            <div className="grid gap-2 mt-4">
              <a href={`https://wa.me/${offer.provider.whatsapp.replace(/\D/g,'')}`} target="_blank" className="h-12 rounded-full bg-[#25D366] text-white font-bold flex items-center justify-center gap-2">{od.whatsapp}</a>
              <a href={`tel:${offer.provider.phone}`} className="h-12 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold flex items-center justify-center">{od.call}</a>
              <Link href="/quote" className="h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white font-bold flex items-center justify-center">{od.quote}</Link>
              <div className="grid grid-cols-2 gap-2">
                <a href={offer.provider.website ? `https://${offer.provider.website}` : "#"} className="h-11 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white font-semibold flex items-center justify-center text-sm">{od.website}</a>
                <button className="h-11 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white font-semibold text-sm">{od.share}</button>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-[#64748B] dark:text-[#94A3B8] border-t border-[#F1F5F9] dark:border-[#1E293B] pt-4">
              <span>👁 {offer.views} {od.views}</span><span>♡ {offer.saves} {od.favs}</span><span>✓ {od.verified}</span>
            </div>
          </div>
          <div className="bg-[#FFF7ED] dark:bg-[#1A2332] border border-[#FFEDD5] dark:border-[#1E293B] rounded-[20px] p-4">
            <div className="font-bold text-sm dark:text-white">{od.needQuote}</div>
            <p className="text-sm text-[#7C2D12] dark:text-[#FDBA74] mt-1">{od.needQuoteDesc}</p>
            <Link href="/quote" className="mt-3 inline-flex px-4 py-2 rounded-full bg-[#0F172A] dark:bg-white dark:text-black text-white text-sm font-bold">{od.quote}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
