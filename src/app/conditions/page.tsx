"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export default function ConditionsPage() {
  const { t } = useI18n();
  const c = (t as any).conditions;
  const articles = [
    { n: "1", title: c.art1Title, icon: "🏝️" },
    { n: "2", title: c.art2Title, icon: "⚖️" },
    { n: "3", title: c.art3Title, icon: "🏷️" },
    { n: "4", title: c.art4Title, icon: "🤝" },
    { n: "5", title: c.art5Title, icon: "📨" },
    { n: "6", title: c.art6Title, icon: "💳" },
    { n: "7", title: c.art7Title, icon: "📝" },
    { n: "8", title: c.art8Title, icon: "©️" },
    { n: "9", title: c.art9Title, icon: "🔧" },
    { n: "10", title: c.art10Title, icon: "🛡️" },
    { n: "11", title: c.art11Title, icon: "🔄" },
    { n: "12", title: c.art12Title, icon: "📞" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-[#080C14]">
      <div className="bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E7C6B]/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-4 lg:px-6 py-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full px-3 py-1 text-xs font-bold">📄 {c.badge}</div>
          <h1 className="text-3xl lg:text-4xl font-black mt-4">{c.title}</h1>
          <p className="text-white/70 mt-2 max-w-2xl text-sm">{c.subtitle}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] bg-white dark:bg-[#0F172A] rounded-[20px] border p-4">
            <div className="text-xs font-black tracking-widest text-[#64748B] mb-3">12 ARTICLES</div>
            <nav className="space-y-1">
              {articles.map(a => (
                <a key={a.n} href={`#art${a.n}`} className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-[#334155] dark:text-[#94A3B8] hover:bg-[#F1F5F9]"><span>{a.icon}</span> {a.n}. {a.title}</a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <p className="text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">{c.intro}</p>
          </div>

          <section id="art1" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="text-lg font-black dark:text-white flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center text-sm">1</span> {c.art1Title}</h2>
            <p className="text-sm mt-3 text-[#475569]">{c.art1Desc}</p>
          </section>

          <section id="art2" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="text-lg font-black dark:text-white flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center">2</span> {c.art2Title}</h2>
            <ul className="mt-3 space-y-2">
              {c.art2Items.map((x: string) => (
                <li key={x} className="flex gap-2 text-sm text-[#475569]"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#EF4444] shrink-0" />{x}</li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded-2xl bg-[#FEF2F2] border text-xs text-[#991B1B]">{c.art2Warning}</div>
          </section>

          {[3,4,5,6,7,8,9,10,11].map(n => (
            <section key={n} id={`art${n}`} className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h2 className="text-lg font-black dark:text-white flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center text-sm">{n}</span> {(c as any)[`art${n}Title`]}</h2>
              <p className="text-sm mt-3 text-[#475569]">{(c as any)[`art${n}Desc`]}</p>
            </section>
          ))}

          <section id="art12" className="bg-[#0F172A] text-white rounded-[20px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div><div className="font-black">12. {c.art12Title}</div><div className="text-sm text-white/70">{c.art12Desc} <a href="tel:+966598009209" className="underline font-black">+966 598 009 209</a></div></div>
            <Link href="/help" className="px-5 py-2.5 rounded-full bg-white text-[#0F172A] font-black text-sm">Centre d'aide</Link>
          </section>
        </div>
      </div>
    </div>
  );
}
