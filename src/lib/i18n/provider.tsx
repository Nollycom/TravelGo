"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { translations, Lang } from "./translations";

type Ctx = { lang: Lang; t: (typeof translations)[Lang]; setLang:(l:Lang)=>void };
const I18nContext = createContext<Ctx>({ lang:"fr", t:translations.fr, setLang:()=>{} });

export function I18nProvider({ children }: { children: React.ReactNode }){
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(()=>{
    const saved = (localStorage.getItem("travgo-lang") as Lang) || "fr";
    if(["fr","ar","en"].includes(saved)) setLangState(saved);
  },[]);
  useEffect(()=>{
    document.documentElement.lang = lang;
    document.documentElement.dir = lang==="ar" ? "rtl" : "ltr";
    localStorage.setItem("travgo-lang", lang);
  },[lang]);
  const setLang = (l:Lang)=> setLangState(l);
  const t = translations[lang] || translations.fr;
  return <I18nContext.Provider value={{ lang, t, setLang }}>{children}</I18nContext.Provider>;
}
export const useI18n = ()=> useContext(I18nContext);
