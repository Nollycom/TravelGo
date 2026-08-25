"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-[#0F172A] text-white mt-10">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo-travgo.jpg" alt="TravGo" className="h-9 w-9 rounded-xl object-cover border border-white/15 shadow-sm bg-white" />
              <span className="font-black text-xl">TravGo</span>
              <span className="text-[10px] bg-white/10 border border-white/15 px-2 py-1 rounded-full">KSA • SAR</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">{t.footer.tagline}</p>
          </div>
          <div>
            <div className="font-bold mb-3">{t.footer.explore}</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/offers" className="hover:text-white">{t.footer.offers}</Link></li>
              <li><Link href="/providers" className="hover:text-white">{t.footer.providers}</Link></li>
              <li><Link href="/reels" className="hover:text-white">{t.footer.reels}</Link></li>
              <li><Link href="/quote" className="hover:text-white">{t.footer.quote}</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-3">{t.footer.companies}</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/provider/dashboard" className="hover:text-white">{t.footer.providerSpace}</Link></li>
              <li><Link href="/advertise" className="hover:text-white">{t.footer.ads}</Link></li>
              <li>{t.footer.subs}</li>
              <li>{t.footer.verif}</li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-3">{t.footer.help}</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/help" className="hover:text-white">Centre d&apos;aide</Link></li>
              <li><Link href="/conditions" className="hover:text-white">Conditions</Link></li>
              <li><Link href="/confidentialite" className="hover:text-white">Confidentialité</Link></li>
              <li><a href="tel:+966598009209" className="hover:text-white">Contact • +966 598 009 209</a></li>
            </ul>
          </div>
        </div>
        <div className="relative flex flex-col lg:flex-row justify-between gap-4 mt-8 pt-6 border-t border-white/10 text-sm text-white/60">
          <div className="absolute -top-[7px] left-0 right-0 h-[14px] overflow-hidden pointer-events-none">
            <span className="plane-fly absolute left-0 text-[16px] leading-none">✈️</span>
          </div>
          <span>{t.footer.copy}</span>
          <span className="flex gap-3"><span>FR</span><span>العربية</span><span>EN</span><span>• SAR</span><span>• Asia/Riyadh</span></span>
        </div>
      </div>
    </footer>
  );
}
