"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useI18n } from "@/lib/i18n/provider";
import { useTheme } from "@/lib/theme/provider";

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const snap = await getDoc(doc(db, "users", fbUser.uid));
          setUser(snap.exists() ? { uid: fbUser.uid, email: fbUser.email, ...snap.data() } : { uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName });
        } catch { setUser({ uid: fbUser.uid, email: fbUser.email }); }
      } else {
        try { const raw = localStorage.getItem("travgo-user"); setUser(raw ? JSON.parse(raw) : null); } catch { setUser(null); }
      }
    });
    return () => unsub();
  }, []);
  const nav = [
    { label: t.nav.discover, href: "/" },
    { label: t.nav.destinations, href: "/providers" },
    { label: t.nav.offers, href: "/offers" },
    { label: t.nav.reels, href: "/reels" },
    { label: t.nav.providers, href: "/providers" },
    { label: t.nav.advertise, href: "/advertise" },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(()=>{
    const onScroll = ()=> setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return ()=> window.removeEventListener("scroll", onScroll);
  },[]);
  return (
    <header className={`sticky top-0 z-40 transition-all ${scrolled ? "bg-white/95 dark:bg-[#080C14]/95 backdrop-blur border-b border-[#E2E8F0] dark:border-[#1E293B] shadow-sm" : "bg-white dark:bg-[#080C14] border-b border-transparent dark:border-[#0F172A]"}`}>
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6 h-[64px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-travgo.jpg" alt="TravGo" className="h-9 w-9 rounded-xl object-cover border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm bg-white" />
            <span className="font-black tracking-tight text-[22px] dark:text-white">TravGo</span>
            <span className="hidden sm:inline text-xs font-bold bg-[#0E7C6B]/10 dark:bg-[#14B8A6]/15 text-[#0E7C6B] dark:text-[#14B8A6] px-2 py-1 rounded-full">KSA</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map(i=>(
              <Link key={i.label} href={i.href} className="px-3 py-2 rounded-full text-[14px] font-semibold text-[#334155] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332] hover:text-[#0F172A] dark:hover:text-white transition">
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm">
            <select value={lang} onChange={e=>setLang(e.target.value as any)} className="bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] rounded-full px-3 py-2 text-sm font-bold dark:text-white">
              <option value="fr">FR</option><option value="ar">العربية</option><option value="en">EN</option>
            </select>
          </div>
          <button onClick={toggle} aria-label="toggle dark" className="h-11 w-11 rounded-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-center text-lg icon-3d">
            {theme==="dark" ? "☀️" : "🌙"}
          </button>
          {user ? (
            <>
              <Link href={user.role==="ADMIN" ? "/admin" : user.role==="PROVIDER" || user.role==="PROVIDER_PENDING" ? "/provider/dashboard" : "/dashboard"} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
                <img src={`https://i.pravatar.cc/100?u=${user.email}`} alt={user.name} className="h-7 w-7 rounded-full" />
                <span className="text-sm font-bold dark:text-white max-w-[120px] truncate">{user.name || user.email?.split("@")[0]}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0E7C6B] text-white">{user.role || "USER"}</span>
              </Link>
              <button onClick={async()=>{await signOut(auth); localStorage.removeItem("travgo-user"); localStorage.removeItem("travgo-role"); location.href="/"; }} className="px-4 py-2 rounded-full border text-sm font-bold dark:text-white">Déconnexion</button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 rounded-full font-bold text-sm hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332] dark:text-white">{t.nav.login}</Link>
              <Link href="/register" className="px-4 py-2 rounded-full font-bold text-sm border border-[#E2E8F0] dark:border-[#1E293B] hover:bg-[#F8FAFB] dark:bg-[#0F172A] dark:text-white">{t.nav.register}</Link>
            </>
          )}
          <Link href="/quote" className="px-5 py-2.5 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold text-sm hover:bg-[#0A5E51] shadow icon-3d">{t.nav.quote}</Link>
        </div>
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={toggle} className="h-10 w-10 rounded-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-center icon-3d">{theme==="dark"?"☀️":"🌙"}</button>
          <button onClick={()=>setOpen(!open)} className="h-10 w-10 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-center dark:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {nav.map(i=> <Link key={i.label} href={i.href} onClick={()=>setOpen(false)} className="px-3 py-3 rounded-xl bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white font-semibold text-sm">{i.label}</Link>)}
          </div>
          <div className="flex gap-2">
            {user ? (
              <>
                <Link href={user.role==="ADMIN" ? "/admin" : user.role==="PROVIDER" ? "/provider/dashboard" : "/dashboard"} onClick={()=>setOpen(false)} className="flex-1 text-center px-4 py-3 rounded-full bg-[#0F172A] dark:bg-white dark:text-black text-white font-bold text-sm truncate">{user.name || user.email}</Link>
                <button onClick={async()=>{await signOut(auth); localStorage.removeItem("travgo-user"); localStorage.removeItem("travgo-role"); setUser(null); setOpen(false); location.href="/";}} className="px-4 py-3 rounded-full border text-sm font-bold dark:text-white">Déconnexion</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={()=>setOpen(false)} className="flex-1 text-center px-4 py-3 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white font-bold">{t.nav.login}</Link>
                <Link href="/quote" onClick={()=>setOpen(false)} className="flex-1 text-center px-4 py-3 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold">{t.nav.quote}</Link>
              </>
            )}
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={()=>setLang("fr")} className={`px-3 py-1 rounded-full text-xs font-bold ${lang==="fr"?"bg-[#0F172A] dark:bg-white dark:text-black text-white":"bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white"}`}>FR</button>
            <button onClick={()=>setLang("ar")} className={`px-3 py-1 rounded-full text-xs font-bold ${lang==="ar"?"bg-[#0F172A] dark:bg-white dark:text-black text-white":"bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white"}`}>العربية</button>
            <button onClick={()=>setLang("en")} className={`px-3 py-1 rounded-full text-xs font-bold ${lang==="en"?"bg-[#0F172A] dark:bg-white dark:text-black text-white":"bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white"}`}>EN</button>
          </div>
        </div>
      )}
    </header>
  );
}
