"use client";
import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export default function QuotePage() {
  const { t } = useI18n();
  const steps = (t as any).quote.steps as string[];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ destination:"AlUla", travelers:2, dates:"15 déc 2026", duration:"3 jours", cityFrom:"Riyad", budget:"2000-4000 SAR", services:["Vol","Hôtel"], prefs:""});
  return (
    <div className="mx-auto max-w-[900px] px-4 lg:px-6 py-6">
      <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
        <div className="flex items-center justify-between">
          <h1 className="h2 dark:text-white">{(t as any).quote.title}</h1>
          <span className="text-sm font-bold text-[#0E7C6B] dark:text-[#14B8A6]">{(t as any).quote.steps[step]} {step+1} / {steps.length}</span>
        </div>
        <div className="flex gap-1.5 mt-4">
          {steps.map((_,i)=> <div key={i} className={`h-1.5 flex-1 rounded-full ${i<=step ? "bg-[#0E7C6B] dark:bg-[#14B8A6]" : "bg-[#E2E8F0] dark:bg-[#1E293B]"}`} />)}
        </div>
        <div className="mt-6 min-h-[280px]">
          {step===0 && (
            <div>
              <div className="font-bold mb-2 dark:text-white">{(t as any).quote.where}</div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {["AlUla","Jeddah","Riyad","NEOM","Abha","Taïf","Dammam","Al Khobar"].map(d=>(
                  <button key={d} onClick={()=>setForm({...form, destination:d})} className={`h-12 rounded-full border font-bold ${form.destination===d ? "bg-[#0E7C6B] dark:bg-[#14B8A6] text-white border-[#0E7C6B]" : "bg-white dark:bg-[#1A2332] dark:text-white dark:border-[#1E293B] border-[#E2E8F0]"}`}>{d}</button>
                ))}
              </div>
              <input value={form.destination} onChange={e=>setForm({...form, destination:e.target.value})} placeholder={(t as any).quote.otherDest} className="mt-4 w-full h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" />
            </div>
          )}
          {step===1 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.travelers}</div><div className="flex gap-3">{[1,2,3,4,5,6].map(n=> <button key={n} onClick={()=>setForm({...form, travelers:n})} className={`h-12 w-12 rounded-full font-bold border ${form.travelers===n ? "bg-[#0F172A] dark:bg-white dark:text-black text-white" : "bg-white dark:bg-[#1A2332] dark:text-white border-[#E2E8F0] dark:border-[#1E293B]"}`}>{n}</button>)}</div></div>}
          {step===2 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.dates}</div><input type="date" className="w-full h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" /></div>}
          {step===3 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.duration}</div><div className="flex flex-wrap gap-2">{["2 jours","3 jours","5 jours","7 jours","10 jours"].map(d=> <button key={d} onClick={()=>setForm({...form, duration:d})} className={`px-4 py-2 rounded-full font-bold border ${form.duration===d ? "bg-[#0E7C6B] dark:bg-[#14B8A6] text-white" : "bg-white dark:bg-[#1A2332] dark:text-white dark:border-[#1E293B]"}`}>{d}</button>)}</div></div>}
          {step===4 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.departure}</div><select value={form.cityFrom} onChange={e=>setForm({...form,cityFrom:e.target.value})} className="w-full h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white"><option>Riyad</option><option>Jeddah</option><option>Dammam</option><option>Médine</option><option>Tabuk</option><option>Abha</option></select></div>}
          {step===5 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.budget}</div><select value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} className="w-full h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white"><option>0 - 1000 SAR</option><option>1000 - 3000 SAR</option><option>2000-4000 SAR</option><option>4000+ SAR</option></select></div>}
          {step===6 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.services}</div><div className="flex flex-wrap gap-2">{["Vol","Hôtel","Transport","Activités","Excursions","Assurance"].map(s=> <button key={s} onClick={()=>setForm({...form, services: form.services.includes(s) ? form.services.filter(x=>x!==s) : [...form.services,s]})} className={`px-4 py-2 rounded-full font-bold border ${form.services.includes(s) ? "bg-[#0E7C6B] dark:bg-[#14B8A6] text-white border-[#0E7C6B]" : "bg-white dark:bg-[#1A2332] dark:text-white dark:border-[#1E293B]"}`}>{s}</button>)}</div></div>}
          {step===7 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.prefs}</div><textarea value={form.prefs} onChange={e=>setForm({...form,prefs:e.target.value})} placeholder="..." className="w-full h-28 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" /></div>}
          {step===8 && (
            <div className="rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border border-[#E2E8F0] dark:border-[#1E293B] p-5">
              <div className="font-bold mb-3 dark:text-white">{(t as any).quote.summary}</div>
              <div className="space-y-2 text-sm dark:text-white">
                <div className="flex justify-between"><span className="text-[#64748B] dark:text-[#94A3B8]">{(t as any).quote.steps[0]}</span><b>{form.destination} — Arabie Saoudite</b></div>
                <div className="flex justify-between"><span className="text-[#64748B] dark:text-[#94A3B8]">{(t as any).quote.steps[1]}</span><b>{form.travelers}</b></div>
                <div className="flex justify-between"><span className="text-[#64748B] dark:text-[#94A3B8]">{(t as any).quote.steps[3]}</span><b>{form.duration}</b></div>
                <div className="flex justify-between"><span className="text-[#64748B] dark:text-[#94A3B8]">{(t as any).quote.steps[4]}</span><b>{form.cityFrom}</b></div>
                <div className="flex justify-between"><span className="text-[#64748B] dark:text-[#94A3B8]">{(t as any).quote.steps[5]}</span><b>{form.budget}</b></div>
                <div className="flex justify-between"><span className="text-[#64748B] dark:text-[#94A3B8]">{(t as any).quote.steps[6]}</span><b>{form.services.join(", ")}</b></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-6">
          <button disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))} className="px-6 py-3 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white font-bold disabled:opacity-40">{(t as any).quote.back}</button>
          {step < steps.length-1 ? <button onClick={()=>setStep(s=>s+1)} className="px-8 py-3 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold">{(t as any).quote.continue}</button> : <Link href="/dashboard?tab=quotes" className="px-8 py-3 rounded-full bg-[#0F172A] dark:bg-white dark:text-black text-white font-bold">{(t as any).quote.send}</Link>}
        </div>
        <p className="text-xs text-[#94A3B8] mt-4 text-center">{(t as any).quote.sentTo}</p>
      </div>
    </div>
  );
}
