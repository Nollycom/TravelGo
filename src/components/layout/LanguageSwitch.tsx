"use client";
import { useEffect, useState } from "react";

const dict: Record<string, any> = {
  fr: { dir:"ltr", label:"FR", hero:"Votre prochaine aventure commence ici.", sub:"Découvrez des offres KSA vérifiées." },
  ar: { dir:"rtl", label:"العربية", hero:"مغامرتك القادمة تبدأ هنا.", sub:"اكتشف عروض السعودية المختارة من محترفين مرخصين." },
  en: { dir:"ltr", label:"EN", hero:"Your next adventure starts here.", sub:"Discover verified KSA offers." },
};

export default function LanguageSwitch() {
  const [lang, setLang] = useState("fr");
  useEffect(()=>{
    const saved = localStorage.getItem("travgo-lang") || "fr";
    setLang(saved);
    document.documentElement.lang = saved;
    document.documentElement.dir = dict[saved]?.dir || "ltr";
  },[]);
  const change = (v:string)=>{
    setLang(v); localStorage.setItem("travgo-lang",v);
    document.documentElement.lang=v; document.documentElement.dir=dict[v].dir;
    location.reload();
  };
  return (
    <select value={lang} onChange={e=>change(e.target.value)} className="bg-white border border-[#E2E8F0] rounded-full px-3 py-2 text-sm font-bold">
      <option value="fr">FR</option><option value="ar">العربية</option><option value="en">EN</option>
    </select>
  );
}
