"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export default function ConfidentialitePage() {
  const { t } = useI18n();
  const p = (t as any).privacy;

  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-[#080C14]">
      <div className="bg-gradient-to-br from-[#0E7C6B] via-[#0A5E51] to-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.14),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1280px] px-4 lg:px-6 py-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs font-bold">🔒 {p.badge}</div>
          <h1 className="text-3xl lg:text-4xl font-black mt-4">{p.title}</h1>
          <p className="text-white/70 mt-2 max-w-2xl text-sm">{p.subtitle}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] bg-white dark:bg-[#0F172A] rounded-[20px] border p-4">
            <div className="text-xs font-black tracking-widest text-[#64748B] mb-3">11 SECTIONS</div>
            <nav className="space-y-1 text-sm">
              {["1","2","3","4","5","6","7","8","9","10","11"].map(n => (
                <a key={n} href={`#s${n}`} className="block px-3 py-2 rounded-full text-[#334155] dark:text-[#94A3B8] hover:bg-[#F1F5F9]">{n}. {(p as any)[`sec${n}Title`] || n}</a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6 text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">{p.intro}</div>

          <section id="s1" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="text-lg font-black dark:text-white flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-[#E6F4F1] flex items-center justify-center text-sm">1</span> {p.sec1Title}</h2>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#F8FAFB] border p-4"><div className="font-bold text-sm">{p.sec1AccTitle}</div><ul className="mt-2 space-y-1 text-xs list-disc list-inside">{p.sec1AccItems.map((x:string)=><li key={x}>{x}</li>)}</ul></div>
              <div className="rounded-2xl bg-[#F8FAFB] border p-4"><div className="font-bold text-sm">{p.sec1VoyTitle}</div><ul className="mt-2 space-y-1 text-xs list-disc list-inside">{p.sec1VoyItems.map((x:string)=><li key={x}>{x}</li>)}</ul></div>
              <div className="rounded-2xl bg-[#F8FAFB] border p-4"><div className="font-bold text-sm">{p.sec1TechTitle}</div><ul className="mt-2 space-y-1 text-xs list-disc list-inside">{p.sec1TechItems.map((x:string)=><li key={x}>{x}</li>)}</ul></div>
            </div>
          </section>

          <section id="s2" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">2. {p.sec2Title}</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {p.sec2Items.map((x:string)=><div key={x} className="flex gap-2 text-sm p-2 rounded-xl bg-[#F8FAFB] border"><span className="text-[#0E7C6B]">•</span>{x}</div>)}
            </div>
          </section>

          <section id="s3" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">3. {p.sec3Title}</h2>
            <div className="mt-3 p-4 rounded-2xl bg-[#ECFDF5] border text-sm">{p.sec3Desc}</div>
          </section>

          <section id="s4" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">4. {p.sec4Title}</h2>
            <p className="text-sm text-[#475569] mt-2">{p.sec4Desc}</p>
          </section>

          <section id="s5" className="bg-[#0F172A] text-white rounded-[20px] p-6">
            <h2 className="font-black">5. {p.sec5Title}</h2>
            <p className="text-sm text-white/70 mt-2">{p.sec5Desc}</p>
          </section>

          <section id="s6" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">6. {p.sec6Title}</h2>
            <p className="text-sm text-[#475569] mt-2">{p.sec6Desc}</p>
          </section>

          <section id="s7" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">7. {p.sec7Title}</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {p.sec7Items.map((x:string)=><div key={x} className="p-3 rounded-2xl bg-[#F8FAFB] border text-sm">• {x}</div>)}
            </div>
          </section>

          <section id="s8" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">8. {p.sec8Title}</h2>
            <p className="text-sm text-[#475569] mt-2">{p.sec8Desc}</p>
          </section>

          <section id="s9" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">9. {p.sec9Title}</h2>
            <p className="text-sm text-[#475569] mt-2">{p.sec9Desc}</p>
          </section>

          <section id="s10" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">10. {p.sec10Title}</h2>
            <p className="text-sm text-[#475569] mt-2">{p.sec10Desc}</p>
          </section>

          <section id="s11" className="bg-gradient-to-br from-[#0E7C6B] to-[#0A5E51] rounded-[20px] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div><div className="font-black">11. {p.sec11Title}</div><div className="text-sm text-white/80">{p.sec11Desc} <a href="tel:+966598009209" className="underline font-black">+966 598 009 209</a></div></div>
            <Link href="/help" className="px-5 py-2.5 rounded-full bg-white text-[#0E7C6B] font-black text-sm">Centre d'aide</Link>
          </section>
        </div>
      </div>
    </div>
  );
}
