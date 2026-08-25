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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try { const snap = await getDoc(doc(db, "users", fbUser.uid)); setUser(snap.exists() ? { uid: fbUser.uid, email: fbUser.email, ...snap.data() } : { uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName }); } catch { setUser({ uid: fbUser.uid, email: fbUser.email }); }
      } else { try { const raw = localStorage.getItem("travgo-user"); setUser(raw ? JSON.parse(raw) : null); } catch { setUser(null); } }
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
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "py-1" : "py-0"}`}
      style={{ perspective: "1200px" }}
    >
      {/* Glass background 3D */}
      <div className={`absolute inset-0 transition-all duration-500 border-b ${scrolled ? "bg-white/75 dark:bg-[#080C14]/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.6)_inset] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.06)_inset] border-white/40 dark:border-white/[0.06]" : "bg-white/55 dark:bg-[#0F172A]/40 backdrop-blur-xl border-white/20 dark:border-white/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)]"}`} />

      <div className="relative mx-auto max-w-[1280px] px-4 lg:px-6 h-[60px] flex items-center justify-between gap-3">
        {/* Logo 3D */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group" style={{ transformStyle: "preserve-3d" }}>
            <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-white dark:bg-[#0F172A] border border-[#E2E8F0]/60 dark:border-white/10 shadow-[0_4px_12px_rgba(14,124,107,0.18),0_1px_0_rgba(255,255,255,0.8)_inset] dark:shadow-[0_6px_16px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.06)_inset] group-hover:shadow-[0_6px_16px_rgba(14,124,107,0.28)] transition-all">
              <img src="/logo-travgo.jpg" alt="TravGo" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-60" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-[20px] text-[#0F172A] dark:text-white">TravGo</span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-black tracking-widest bg-gradient-to-br from-[#0E7C6B] to-[#0A5E51] dark:from-[#14B8A6] dark:to-[#0E7C6B] text-white px-2 py-0.5 rounded-full shadow-[0_2px_8px_rgba(14,124,107,0.3)] border border-white/20">KSA</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-1">
            {nav.map((i) => (
              <Link
                key={i.label}
                href={i.href}
                className="relative px-3 py-1.5 rounded-full text-[13px] font-semibold tracking-[-0.01em] text-[#334155] dark:text-[#CBD5E1] hover:text-[#0F172A] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/[0.06] hover:backdrop-blur-md border border-transparent hover:border-white/50 transition-all"
              >
                {i.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions Desktop */}
        <div className="hidden lg:flex items-center gap-1.5">
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/70 dark:bg-white/[0.06] backdrop-blur-md border border-white/50 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              className="h-7 bg-transparent pl-2 pr-6 text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="fr" className="text-black">FR</option>
              <option value="ar" className="text-black">العربية</option>
              <option value="en" className="text-black">EN</option>
            </select>
            <div className="w-px h-5 bg-[#E2E8F0] dark:bg-white/10" />
            <button
              onClick={toggle}
              aria-label="toggle dark"
              className="h-7 w-7 rounded-full bg-white dark:bg-[#0F172A] border border-[#E2E8F0]/50 dark:border-white/10 flex items-center justify-center text-[13px] hover:scale-105 transition-transform"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-1.5 ml-1">
              <Link
                href={user.role === "ADMIN" ? "/admin" : user.role === "PROVIDER" || user.role === "PROVIDER_PENDING" ? "/provider/dashboard" : "/dashboard"}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all"
              >
                <img src={user.photoURL || user.avatar || `https://i.pravatar.cc/100?u=${user.email}`} alt={user.name} className="h-7 w-7 rounded-full object-cover border border-white dark:border-[#1E293B]" />
                <span className="text-[13px] font-bold text-[#0F172A] dark:text-white max-w-[120px] truncate">{user.name && user.name !== "user" ? user.name : (user.email?.split("@")[0] || "Utilisateur")}</span>
                <span className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-full bg-[#0E7C6B] text-white">{user.role || "USER"}</span>
              </Link>
              <button
                onClick={async () => { await signOut(auth); localStorage.removeItem("travgo-user"); localStorage.removeItem("travgo-role"); location.href = "/"; }}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link href="/login" className="px-3 py-1.5 rounded-full text-xs font-bold text-[#0F172A] dark:text-white hover:bg-white/60 border border-transparent hover:border-white/40 transition-all">
                {t.nav.login}
              </Link>
              <Link href="/register" className="px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-white text-[#0F172A] border border-[#E2E8F0]/50 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all">
                {t.nav.register}
              </Link>
            </div>
          )}

          <Link
            href="/quote"
            className="ml-1 px-4 py-2 rounded-full bg-gradient-to-br from-[#0E7C6B] to-[#0A5E51] dark:from-[#14B8A6] dark:to-[#0E7C6B] text-white font-bold text-xs shadow-[0_4px_12px_rgba(14,124,107,0.3)] hover:shadow-[0_6px_16px_rgba(14,124,107,0.4)] hover:-translate-y-[1px] transition-all border border-white/15"
          >
            {t.nav.quote}
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center gap-2">
          <button onClick={toggle} className="h-10 w-10 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex items-center justify-center text-[16px] active:scale-95 transition-transform">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className={`h-10 w-10 rounded-full border backdrop-blur-md flex items-center justify-center transition-all ${open ? "bg-[#0F172A] dark:bg-white text-white dark:text-black border-[#0F172A] dark:border-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]" : "bg-white/70 dark:bg-white/10 border-white/50 dark:border-white/10 text-[#0F172A] dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden absolute top-[60px] inset-x-0 px-4 pb-4">
          <div className="rounded-[24px] bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.6)_inset] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.06)_inset] overflow-hidden">
            <div className="p-3 grid grid-cols-2 gap-2">
              {nav.map((i) => (
                <Link key={i.label} href={i.href} onClick={() => setOpen(false)} className="px-4 py-3.5 rounded-2xl bg-[#F8FAFB]/80 dark:bg-white/[0.06] hover:bg-white dark:hover:bg-white/10 border border-[#E2E8F0]/50 dark:border-white/5 text-[#0F172A] dark:text-white font-bold text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:shadow-none text-center">
                  {i.label}
                </Link>
              ))}
            </div>
            <div className="px-3 pb-3 flex gap-2">
              {user ? (
                <>
                  <Link href={user.role === "ADMIN" ? "/admin" : user.role === "PROVIDER" || user.role === "PROVIDER_PENDING" ? "/provider/dashboard" : "/dashboard"} onClick={() => setOpen(false)} className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-full bg-[#0F172A] dark:bg-white text-white dark:text-black font-bold text-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                    <img src={user.photoURL || user.avatar || `https://i.pravatar.cc/100?u=${user.email}`} alt="" className="h-7 w-7 rounded-full border-2 border-white/20 object-cover" />
                    <div className="flex-1 text-left min-w-0 leading-tight">
                      <div className="text-[13px] font-bold truncate">{user.name && user.name !== "user" ? user.name : (user.email?.split("@")[0] || "Utilisateur")}</div>
                      <div className="text-[10px] opacity-70 truncate">{user.email}</div>
                    </div>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-white/15 border border-white/20">{user.role || "USER"}</span>
                  </Link>
                  <button onClick={async () => { await signOut(auth); localStorage.removeItem("travgo-user"); localStorage.removeItem("travgo-role"); setUser(null); setOpen(false); location.href = "/"; }} className="px-4 py-3 rounded-full border border-[#E2E8F0] dark:border-white/10 dark:text-white font-bold text-sm bg-white/50 dark:bg-white/5">Déconnexion</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-3 rounded-full bg-[#F1F5F9] dark:bg-white/10 dark:text-white font-black text-sm border border-[#E2E8F0]/50 dark:border-white/10">{t.nav.login}</Link>
                  <Link href="/quote" onClick={() => setOpen(false)} className="flex-1 text-center px-4 py-3 rounded-full bg-gradient-to-br from-[#0E7C6B] to-[#0A5E51] text-white font-black text-sm shadow-[0_4px_12px_rgba(14,124,107,0.3)]">{t.nav.quote}</Link>
                </>
              )}
            </div>
            <div className="px-3 pb-3 flex items-center justify-between gap-2">
              <div className="flex gap-1.5">
                <button onClick={() => setLang("fr")} className={`px-3 py-1.5 rounded-full text-xs font-black ${lang === "fr" ? "bg-[#0F172A] dark:bg-white text-white dark:text-black shadow-md" : "bg-[#F1F5F9] dark:bg-white/10 dark:text-white"}`}>FR</button>
                <button onClick={() => setLang("ar")} className={`px-3 py-1.5 rounded-full text-xs font-black ${lang === "ar" ? "bg-[#0F172A] dark:bg-white text-white dark:text-black shadow-md" : "bg-[#F1F5F9] dark:bg-white/10 dark:text-white"}`}>العربية</button>
                <button onClick={() => setLang("en")} className={`px-3 py-1.5 rounded-full text-xs font-black ${lang === "en" ? "bg-[#0F172A] dark:bg-white text-white dark:text-black shadow-md" : "bg-[#F1F5F9] dark:bg-white/10 dark:text-white"}`}>EN</button>
              </div>
              {user && <span className="text-xs font-bold text-[#0E7C6B] dark:text-[#14B8A6] bg-[#E6F4F1] dark:bg-[#134E4A] px-2.5 py-1 rounded-full border border-[#A7F3D0] dark:border-[#134E4A]">{user.role}</span>}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
