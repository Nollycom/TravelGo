"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { offers } from "@/lib/data";
import OfferCard from "@/components/offer/OfferCard";
import { useI18n } from "@/lib/i18n/provider";

export default function Dashboard() {
  const { t } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const snap = await getDoc(doc(db, "users", fbUser.uid));
          if (snap.exists()) setUser({ uid: fbUser.uid, email: fbUser.email, ...snap.data() });
          else setUser({ uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName || fbUser.email?.split("@")[0] });
        } catch {
          setUser({ uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName });
        }
      } else {
        try {
          const raw = localStorage.getItem("travgo-user");
          if (raw) setUser(JSON.parse(raw));
          else setUser(null);
        } catch { setUser(null); }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="mx-auto max-w-[1280px] px-4 py-10 text-center text-sm text-[#64748B]">Chargement...</div>;
  if (!user) return (
    <div className="mx-auto max-w-[640px] px-4 py-16 text-center">
      <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-8">
        <h2 className="text-xl font-black dark:text-white">Non connecté</h2>
        <p className="text-sm text-[#64748B] mt-2">Connecte-toi pour voir ton tableau de bord.</p>
        <Link href="/login" className="inline-block mt-4 px-6 py-2 rounded-full bg-[#0E7C6B] text-white font-bold">Se connecter</Link>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-[240px] shrink-0">
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-4 sticky top-[76px]">
            <div className="flex items-center gap-3 mb-4">
              <img src={`https://i.pravatar.cc/100?u=${user.email || user.uid}`} alt="user" className="h-10 w-10 rounded-full" />
              <div className="flex-1 min-w-0"><div className="font-bold text-sm dark:text-white truncate">{user.name || user.email?.split("@")[0]}</div><div className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">{user.email}</div><div className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0F172A] text-white inline-block mt-1">{user.role || "USER"}</div></div>
            </div>
            <nav className="space-y-1 text-sm font-semibold">
              {[
                [t.dashboard.myRequests,"/dashboard",true],
                [t.dashboard.quotesReceived,"/dashboard",false],
                [t.dashboard.favs,"/favorites",false],
                ["Recherches","/dashboard",false],
                ["Reels","/reels",false],
                ["Notifications","/dashboard",false],
                ["Profil","/dashboard",false],
              ].map(([label, href, active])=>(
                <Link key={label as string} href={href as string} className={`block px-3 py-2 rounded-full ${active ? "bg-[#0F172A] dark:bg-white dark:text-black text-white" : "hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332] dark:text-[#94A3B8]"}`}>{label as string}</Link>
              ))}
            </nav>
            <button onClick={async () => { await signOut(auth); localStorage.removeItem("travgo-user"); localStorage.removeItem("travgo-role"); location.href="/login"; }} className="w-full mt-3 h-9 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white text-xs font-bold hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332]">Déconnexion</button>
          </div>
        </aside>
        <div className="flex-1 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-5"><div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{t.dashboard.activeDemands}</div><div className="text-2xl font-black dark:text-white">2</div><div className="text-xs text-[#0E7C6B] dark:text-[#14B8A6]">{t.dashboard.weekPlus}</div></div>
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-5"><div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{t.dashboard.quotesReceived}</div><div className="text-2xl font-black dark:text-white">5</div><div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{t.dashboard.toCompare}</div></div>
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-5"><div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{t.dashboard.favs}</div><div className="text-2xl font-black dark:text-white">8</div><div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{t.dashboard.favsDesc}</div></div>
          </div>
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold dark:text-white">{t.dashboard.myRequests}</h3>
              <Link href="/quote" className="px-4 py-2 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white text-sm font-bold">{t.dashboard.newRequest}</Link>
            </div>
            <div className="space-y-3">
              {[
                { dest:"AlUla 3j VIP", travelers:2, dates:"15-18 déc", budget:"3000-5500 SAR", status:"3 devis reçus", responses:3 },
                { dest:"Jeddah Mer Rouge 4j", travelers:4, dates:"20-24 nov", budget:"1800 SAR", status:"En attente", responses:1 },
              ].map(r=>(
                <div key={r.dest} className="rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] dark:bg-[#1A2332] p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 dark:text-white">
                    <div className="font-bold">{r.dest} • {r.travelers} {t.common.travelers}</div>
                    <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{r.dates} • {r.budget} • {r.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0E7C6B] dark:text-[#6EE7B7] text-xs font-bold">{r.responses} {t.dashboard.responses}</span>
                    <button className="px-4 py-1.5 rounded-full bg-[#0F172A] dark:bg-white dark:text-black text-white text-xs font-bold">{t.dashboard.compare}</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h4 className="font-bold mb-3 dark:text-white">{t.dashboard.compare} — AlUla 3j</h4>
              <div className="grid lg:grid-cols-3 gap-3">
                {[
                  { provider:"Rowad Al Siyaha", price:"2 990 SAR", includes:"Vol RUH→ULH + Hôtel 5★ + Guide Hegra", ver:true },
                  { provider:"AlUla Dreams", price:"3 400 SAR", includes:"Villa + Spa + Maraya", ver:true },
                  { provider:"NEOM Elite", price:"2 750 SAR", includes:"Hôtel 4★ + Transfert", ver:false },
                ].map(q=>(
                  <div key={q.provider} className="rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] p-4 bg-[#F8FAFB] dark:bg-[#1A2332]">
                    <div className="flex items-center gap-2 font-bold text-sm dark:text-white">{q.provider} {q.ver && <span className="bg-[#0E7C6B] text-white text-[10px] px-1.5 py-0.5 rounded-full">{t.common.verifiedMOT}</span>}</div>
                    <div className="text-lg font-black mt-1 dark:text-white">{q.price}</div>
                    <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{q.includes}</div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 h-9 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white text-xs font-bold">{t.dashboard.choose}</button>
                      <button className="flex-1 h-9 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] dark:text-white text-xs font-bold">{t.dashboard.contact}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-3 dark:text-white">{t.dashboard.recommended}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.slice(0,3).map(o=> <OfferCard key={o.id} offer={o} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
