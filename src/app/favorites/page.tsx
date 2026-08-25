"use client";
import { offers } from "@/lib/data";
import OfferCard from "@/components/offer/OfferCard";
import { useI18n } from "@/lib/i18n/provider";

export default function FavoritesPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <h1 className="h2 dark:text-white">{(t as any).favorites.title}</h1>
      <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{(t as any).favorites.sub}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {offers.slice(0,4).map(o=> <OfferCard key={o.id} offer={o} />)}
      </div>
      <div className="mt-6 bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-8 text-center">
        <div className="text-4xl">♡</div>
        <div className="font-bold mt-2 dark:text-white">{(t as any).favorites.emptyTitle}</div>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{(t as any).favorites.emptyDesc}</p>
      </div>
    </div>
  );
}
