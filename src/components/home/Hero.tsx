"use client";
import SmartSearch from "./SmartSearch";
import { useI18n } from "@/lib/i18n/provider";

export default function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1600&h=900&fit=crop" alt="hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E7C6B]/20 to-transparent" />
      </div>
      <div className="relative mx-auto max-w-[1280px] px-4 lg:px-6 py-10 lg:py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 text-white rounded-full px-3 py-1.5 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-[#FF7A45] animate-pulse" /> {t.hero.badge}
          </div>
          <h1 className="display text-white mt-4">
            {t.hero.title1}<br />
            <span className="text-[#FFD8B5]">{t.hero.title2}</span> {t.hero.title3}
          </h1>
          <p className="text-white/90 mt-4 text-[17px] lg:text-[19px] leading-relaxed max-w-xl">
            {t.hero.sub}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Paris 🇫🇷","Istanbul 🇹🇷","Dubai 🇦🇪","Maldives 🇲🇻","Bali 🇮🇩","London 🇬🇧","Tokyo 🇯🇵","Cairo 🇪🇬"].map(t2=>(
              <span key={t2} className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white text-sm font-semibold">{t2}</span>
            ))}
          </div>
        </div>
        <div className="mt-8 lg:mt-10">
          <SmartSearch />
        </div>
        <div className="hidden lg:flex gap-4 mt-6 text-white/80 text-sm">
          <span className="flex items-center gap-2"><span className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center">✓</span> {t.hero.verified}</span>
          <span className="flex items-center gap-2"><span className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center">◈</span> {t.hero.freeQuote}</span>
          <span className="flex items-center gap-2"><span className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center">♡</span> {t.hero.secure}</span>
        </div>
      </div>
    </section>
  );
}
