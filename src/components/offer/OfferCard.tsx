"use client";
import Link from "next/link";
import { Offer } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/provider";
import { offerTranslations } from "@/lib/data";

export default function OfferCard({ offer }: { offer: Offer }) {
  const { lang, t } = useI18n();
  const tr = (offerTranslations as any)[offer.id];
  const title = lang==="ar" ? (tr?.ar || offer.title) : lang==="en" ? (tr?.en || offer.title) : offer.title;
  const duration = lang==="ar" ? (tr?.durationAr || offer.duration) : lang==="en" ? (tr?.durationEn || offer.duration) : offer.duration;
  const fromLabel = lang==="ar" ? "ابتداءً من" : lang==="en" ? "From" : "À partir de";
  const viewLabel = lang==="ar" ? "عرض العرض →" : lang==="en" ? "View offer →" : "Voir l'offre →";
  const sponsoredLabel = lang==="ar" ? "مُموّل" : lang==="en" ? "Sponsored" : "Sponsorisé";
  const popularLabel = lang==="ar" ? "شائع" : lang==="en" ? "Popular" : "Populaire";
  const destLabel = lang==="ar"
    ? ((offer.destination==="AlUla"?"العلا": offer.destination==="Jeddah"?"جدة": offer.destination==="NEOM"?"نيوم": offer.destination==="Abha"?"أبها": offer.destination==="Taïf"?"الطائف": offer.destination==="Riyad"?"الرياض": offer.destination==="Dammam"?"الدمام": offer.destination))
    : offer.destination;
  return (
    <Link href={`/offers/${offer.slug}`} className="group block">
      <div className="bg-white dark:bg-[#0F172A] rounded-[20px] overflow-hidden border border-[#E2E8F0] dark:border-[#1E293B] card-hover">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={offer.image} alt={title} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" loading="lazy" />
          <div className="absolute top-3 left-3 flex gap-2">
            {offer.sponsored && <Badge variant="sponsored">{sponsoredLabel}</Badge>}
            {offer.featured && !offer.sponsored && <Badge variant="warning">{popularLabel}</Badge>}
          </div>
          <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur flex items-center justify-center hover:bg-white transition icon-3d" onClick={(e)=>{e.preventDefault();}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <div className="absolute bottom-3 left-3 bg-[#0F172A]/85 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {duration}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
            <span className="font-semibold text-[#0E7C6B]">{destLabel} • {lang==="ar"?"السعودية":offer.country}</span>
            <span>•</span>
            <span>{offer.cityFrom} → {destLabel}</span>
          </div>
          <h3 className="font-bold leading-tight line-clamp-2 min-h-[44px] text-[16px] dark:text-white">{title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <img src={offer.provider.logo} alt={offer.provider.name} className="h-6 w-6 rounded-full object-cover border border-[#E2E8F0]" />
            <span className="text-sm text-[#475569] dark:text-[#94A3B8] truncate">{offer.provider.name}</span>
            {offer.verified && <VerificationBadge />}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F1F5F9] dark:border-[#1E293B]">
            <div>
              <div className="text-xs text-[#94A3B8]">{fromLabel}</div>
              <div className="text-[18px] font-extrabold text-[#0F172A] dark:text-white">{formatPrice(offer.price, offer.currency)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{offer.includes.slice(0,2).join(" • ")}</div>
              <div className="text-xs font-semibold text-[#0E7C6B] dark:text-[#14B8A6]">{viewLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
