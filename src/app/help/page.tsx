"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export default function HelpPage() {
  const { t } = useI18n();
  const h = (t as any).help;
  const sections = [
    { id: "bienvenue", icon: "👋", title: h.goalTitle, desc: h.subtitle },
    { id: "fonctionne", icon: "🔎", title: h.howTitle, desc: "8 services" },
    { id: "rechercher", icon: "✈️", title: h.searchTitle, desc: "" },
    { id: "devis", icon: "💬", title: h.quoteTitle, desc: "" },
    { id: "verifies", icon: "🏢", title: h.verifiedTitle, desc: "" },
    { id: "paiement", icon: "💳", title: h.paymentTitle, desc: "" },
    { id: "compte", icon: "📱", title: h.accountTitle, desc: "" },
    { id: "langues", icon: "🌍", title: h.langTitle, desc: "" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-[#080C14]">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0E7C6B] via-[#0A5E51] to-[#083E36] dark:from-[#0F172A] dark:via-[#0B1F1C] dark:to-[#061412]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/bg-login.png')", backgroundSize: "cover" }} />
        <div className="relative mx-auto max-w-[1280px] px-4 lg:px-6 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs font-bold text-white">📚 {h.badge}</div>
              <h1 className="text-3xl lg:text-4xl font-black text-white mt-4 tracking-tight">{h.title}</h1>
              <p className="text-white/80 mt-2 max-w-2xl">{h.subtitle}</p>
              <div className="flex gap-2 mt-4 text-xs">
                <span className="px-3 py-1.5 rounded-full bg-white text-[#0E7C6B] font-black">SAR</span>
                <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white font-bold">1 240 offres vérifiées</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-xl w-[280px]">
                <div className="text-xs font-bold text-[#0E7C6B]">{h.needHelp}</div>
                <div className="text-sm font-black text-[#0F172A] mt-1">Contact • +966 598 009 209</div>
                <Link href="tel:+966598009209" className="mt-3 flex w-full h-10 rounded-full bg-[#0E7C6B] text-white font-bold items-center justify-center">Appeler</Link>
                <Link href="/quote" className="mt-2 flex w-full h-10 rounded-full border font-bold items-center justify-center">{h.quoteTitle}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] bg-white dark:bg-[#0F172A] rounded-[20px] border p-4">
            <div className="text-xs font-black tracking-widest text-[#64748B] mb-3">{h.toc}</div>
            <nav className="space-y-1">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-[#334155] dark:text-[#94A3B8] hover:bg-[#F1F5F9]">{s.icon} {s.title}</a>
              ))}
            </nav>
            <div className="mt-4 p-3 rounded-2xl bg-[#E6F4F1] border">
              <div className="text-xs font-bold text-[#0E7C6B]">Contact</div>
              <div className="text-sm font-black">+966 598 009 209</div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <section id="bienvenue" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="text-xl font-black dark:text-white flex items-center gap-2">👋 {h.title}</h2>
            <p className="text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8] mt-3">{h.subtitle}</p>
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#0E7C6B]/10 to-transparent border">
              <div className="text-sm font-bold text-[#0E7C6B]">{h.goalTitle}</div>
              <p className="text-sm text-[#334155] mt-1">{h.goalDesc}</p>
            </div>
          </section>

          <section id="fonctionne" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="text-xl font-black dark:text-white flex items-center gap-2">🔎 {h.howTitle}</h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              {h.howItems.map((t: string, i: number) => (
                <div key={i} className="flex gap-3 p-3 rounded-2xl bg-[#F8FAFB] border">
                  <span className="h-7 w-7 rounded-full bg-[#0E7C6B] text-white flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
                  <span className="text-sm font-medium">{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 inline-flex px-3 py-1.5 rounded-full bg-[#0E7C6B]/10 text-[#0E7C6B] text-xs font-bold">{h.sarNote}</div>
          </section>

          <section id="rechercher" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="text-xl font-black dark:text-white flex items-center gap-2">✈️ {h.searchTitle}</h2>
            <p className="text-sm text-[#475569] mt-2">{h.searchDesc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {h.categories.map((c: string) => (
                <span key={c} className="px-3 py-1.5 rounded-full bg-[#F1F5F9] border text-xs font-bold">{c}</span>
              ))}
            </div>
          </section>

          <section id="devis" className="bg-gradient-to-br from-[#0E7C6B] to-[#0A5E51] rounded-[20px] p-6 text-white">
            <h2 className="text-xl font-black flex items-center gap-2">💬 {h.quoteTitle}</h2>
            <p className="text-sm text-white/80 mt-2">{h.quoteDesc}</p>
            <Link href="/quote" className="mt-4 inline-flex px-5 py-2.5 rounded-full bg-white text-[#0E7C6B] font-black text-sm">Demander un devis gratuit</Link>
          </section>

          <section id="verifies" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="text-xl font-black dark:text-white flex items-center gap-2">🏢 {h.verifiedTitle}</h2>
            <p className="text-sm text-[#475569] mt-2">{h.verifiedDesc}</p>
            <div className="mt-3 p-3 rounded-2xl bg-[#FFFBEB] border text-xs text-[#92400E]">{h.verifiedWarning}</div>
          </section>

          <section id="paiement" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="text-xl font-black dark:text-white flex items-center gap-2">💳 {h.paymentTitle}</h2>
            <p className="text-sm text-[#475569] mt-2">{h.paymentDesc}</p>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {h.paymentItems.map((x: string) => (
                <div key={x} className="flex items-center gap-2 text-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#0E7C6B]" />{x}</div>
              ))}
            </div>
          </section>

          <section id="compte" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="text-xl font-black dark:text-white flex items-center gap-2">📱 {h.accountTitle}</h2>
            <p className="text-sm text-[#475569] mt-2">{h.accountDesc}</p>
          </section>

          <section id="langues" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="text-xl font-black dark:text-white flex items-center gap-2">🌍 {h.langTitle}</h2>
            <p className="text-sm text-[#475569] mt-1">{h.langDesc}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1.5 rounded-full bg-[#0F172A] text-white font-bold">العربية — Arabe</span>
              <span className="px-3 py-1.5 rounded-full bg-white border font-bold">English — Anglais</span>
              <span className="px-3 py-1.5 rounded-full bg-white border font-bold">Français — Français</span>
              <span className="px-3 py-1.5 rounded-full bg-[#0E7C6B] text-white font-bold">SAR — Riyal saoudien</span>
            </div>
          </section>

          <div className="bg-[#0F172A] text-white rounded-[20px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div><div className="font-black">🛡️ {h.needHelp}</div><div className="text-sm text-white/70">{h.needHelpDesc}</div></div>
            <Link href="tel:+966598009209" className="px-6 py-2.5 rounded-full bg-[#14B8A6] text-white font-black">Appeler</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
