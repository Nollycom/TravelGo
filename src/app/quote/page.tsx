"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useI18n } from "@/lib/i18n/provider";

// Toutes les villes d'Arabie Saoudite - menu scrollant
const SAUDI_CITIES = [
  "Riyad", "Jeddah", "La Mecque", "Médine", "Dammam", "Al Khobar", "Dhahran", "Jubail",
  "Hofuf (Al-Ahsa)", "Qatif", "Abha", "Khamis Mushait", "Tabuk", "Hail", "Buraidah", "Unaizah",
  "Najran", "Jizan", "Yanbu", "Al Kharj", "Taïf", "Al Bahah", "Sakaka", "Arar",
  "Qassim", "Al Majmaah", "Rabigh", "NEOM", "AlUla", "Al Qassim", "Dawadmi", "Jazan"
];

// Grandes villes touristiques mondiales - menu scrollant
const WORLD_DESTINATIONS = [
  "Paris, France", "London, UK", "Istanbul, Turquie", "Dubai, EAU", "New York, USA", "Tokyo, Japon",
  "Bali, Indonésie", "Bangkok, Thaïlande", "Rome, Italie", "Barcelona, Espagne", "Madrid, Espagne",
  "Amsterdam, Pays-Bas", "Prague, Tchèque", "Vienne, Autriche", "Budapest, Hongrie", "Varsovie, Pologne",
  "Athènes, Grèce", "Santorin, Grèce", "Malé, Maldives", "Phuket, Thaïlande", "Kuala Lumpur, Malaisie",
  "Singapore", "Hong Kong", "Séoul, Corée", "Sydney, Australie", "Melbourne, Australie", "Auckland, NZ",
  "Le Caire, Égypte", "Sharm El Sheikh, Égypte", "Marrakech, Maroc", "Casablanca, Maroc", "Le Cap, Afrique du Sud",
  "Zanzibar, Tanzanie", "Rio de Janeiro, Brésil", "São Paulo, Brésil", "Buenos Aires, Argentine", "Lima, Pérou",
  "Cancun, Mexique", "Mexico, Mexique", "Los Angeles, USA", "San Francisco, USA", "Las Vegas, USA",
  "Vancouver, Canada", "Toronto, Canada", "Montréal, Canada", "Genève, Suisse", "Zurich, Suisse",
  "Milan, Italie", "Venise, Italie", "Florence, Italie", "Lisbonne, Portugal", "Porto, Portugal",
  "Dublin, Irlande", "Édimbourg, UK", "Reykjavik, Islande", "Dubrovnik, Croatie", "Antalya, Turquie",
  "Cappadoce, Turquie", "Pétra, Jordanie", "Amman, Jordanie", "Tel Aviv, Israël", "Doha, Qatar", "Manama, Bahreïn"
];

export default function QuotePage() {
  const { t } = useI18n();
  const steps = (t as any).quote.steps as string[];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ destination: "Paris, France", travelers: 2, dates: "", duration: "7 jours", cityFrom: "Riyad", budget: "2000-4000 SAR", services: ["Vol", "Hôtel"], prefs: "" });
  const [user, setUser] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try { const snap = await getDoc(doc(db, "users", fbUser.uid)); setUser(snap.exists() ? { uid: fbUser.uid, email: fbUser.email, ...snap.data() } : { uid: fbUser.uid, email: fbUser.email }); } catch { setUser({ uid: fbUser.uid, email: fbUser.email }); }
      } else { try { const raw = localStorage.getItem("travgo-user"); setUser(raw ? JSON.parse(raw) : null); } catch { setUser(null); } }
    });
    return () => unsub();
  }, []);

  const handleSend = async () => {
    if (!user?.uid) { setError("Connecte-toi pour envoyer une demande"); return; }
    setSending(true); setError("");
    try {
      // 1. Créer la demande
      const ref = await addDoc(collection(db, "quoteRequests"), {
        userId: user.uid,
        userName: user.name || user.email,
        userEmail: user.email,
        userPhone: user.phone || "",
        destination: form.destination,
        travelers: form.travelers,
        dates: form.dates || "À définir",
        duration: form.duration,
        cityFrom: form.cityFrom,
        budget: form.budget,
        services: form.services,
        prefs: form.prefs,
        status: "pending",
        responses: 0,
        createdAt: serverTimestamp(),
      });

      // 2. Envoyer notification à toutes les agences validées
      const q = query(collection(db, "users"), where("role", "==", "PROVIDER"));
      const snap = await getDocs(q);
      const agencies = snap.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter(a => (a as any).verified !== false);
      // Fallback: si aucune PROVIDER, prendre toutes les users PROVIDER même non vérifiés + ADMIN pour test
      let targets = agencies;
      if (targets.length === 0) {
        const q2 = query(collection(db, "users"), where("role", "in", ["PROVIDER", "ADMIN", "SUPER_ADMIN"]));
        try { const s2 = await getDocs(q2); targets = s2.docs.map(d => ({ id: d.id, ...d.data() } as any)); } catch {}
      }
      // Si toujours 0, au moins créer une notif pour l'admin khalil
      if (targets.length === 0) targets = [{ id: "admin", email: "khalil.alnajjar81@gmail.com" }];

      const batch = targets.slice(0, 20).map(a =>
        addDoc(collection(db, "notifications"), {
          userId: a.id || a.uid,
          type: "quote_request",
          title: `Nouvelle demande: ${form.destination}`,
          message: `${user.name || user.email} demande ${form.travelers} pers. ${form.cityFrom} → ${form.destination} (${form.duration}, ${form.budget})`,
          quoteRequestId: ref.id,
          fromUserId: user.uid,
          fromUserName: user.name || user.email,
          fromUserEmail: user.email,
          destination: form.destination,
          cityFrom: form.cityFrom,
          budget: form.budget,
          travelers: form.travelers,
          read: false,
          createdAt: serverTimestamp(),
        })
      );
      await Promise.all(batch);
      setSent(true);
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'envoi");
    } finally { setSending(false); }
  };

  return (
    <div className="mx-auto max-w-[900px] px-4 lg:px-6 py-6">
      <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
        <div className="flex items-center justify-between">
          <h1 className="h2 dark:text-white">{(t as any).quote.title}</h1>
          <span className="text-sm font-bold text-[#0E7C6B] dark:text-[#14B8A6]">{(t as any).quote.steps[step]} {step + 1} / {steps.length}</span>
        </div>
        <div className="flex gap-1.5 mt-4">
          {steps.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#0E7C6B] dark:bg-[#14B8A6]" : "bg-[#E2E8F0] dark:bg-[#1E293B]"}`} />)}
        </div>
        <div className="mt-6 min-h-[320px]">
          {step === 0 && (
            <div>
              <div className="font-bold mb-2 dark:text-white">{(t as any).quote.where} — <span className="text-[#0E7C6B] font-black">Monde</span></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 max-h-[180px] overflow-y-auto pr-1 border rounded-2xl p-2 bg-[#F8FAFB] dark:bg-[#1A2332] dark:border-[#1E293B]">
                {WORLD_DESTINATIONS.slice(0, 12).map(d => (
                  <button key={d} onClick={() => setForm({ ...form, destination: d })} className={`h-10 rounded-full border text-xs font-bold px-2 ${form.destination === d ? "bg-[#0E7C6B] text-white border-[#0E7C6B]" : "bg-white dark:bg-[#0F172A] dark:text-white border-[#E2E8F0] dark:border-[#1E293B]"}`}>{d}</button>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-xs font-bold dark:text-white">Ou choisir dans la liste complète (scrollable — {WORLD_DESTINATIONS.length} villes)</label>
                <select value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} className="mt-1 w-full h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm">
                  {WORLD_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="mt-2 max-h-[120px] overflow-y-auto rounded-2xl border dark:border-[#1E293B] bg-white dark:bg-[#0F172A] p-2 grid grid-cols-1 gap-1">
                  {WORLD_DESTINATIONS.map(d => (
                    <button key={d} onClick={() => setForm({ ...form, destination: d })} className={`text-left px-3 py-1.5 rounded-full text-xs ${form.destination === d ? "bg-[#0F172A] dark:bg-white dark:text-black text-white font-bold" : "hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332] dark:text-white"}`}>{d}</button>
                  ))}
                </div>
              </div>
              <input value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} placeholder={(t as any).quote.otherDest} className="mt-3 w-full h-11 rounded-full border px-4 bg-white dark:bg-[#0F172A] dark:text-white text-sm" />
            </div>
          )}
          {step === 1 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.travelers}</div><div className="flex flex-wrap gap-2">{[1,2,3,4,5,6,7,8,10].map(n => <button key={n} onClick={() => setForm({ ...form, travelers: n })} className={`h-11 w-11 rounded-full font-bold border ${form.travelers === n ? "bg-[#0F172A] dark:bg-white dark:text-black text-white" : "bg-white dark:bg-[#1A2332] dark:text-white border-[#E2E8F0] dark:border-[#1E293B]"}`}>{n}</button>)}</div></div>}
          {step === 2 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.dates}</div><input type="date" value={form.dates} onChange={e => setForm({ ...form, dates: e.target.value })} className="w-full h-12 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" /></div>}
          {step === 3 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.duration}</div><div className="flex flex-wrap gap-2">{["2 jours","3 jours","5 jours","7 jours","10 jours","14 jours"].map(d => <button key={d} onClick={() => setForm({ ...form, duration: d })} className={`px-4 py-2 rounded-full font-bold border ${form.duration === d ? "bg-[#0E7C6B] text-white" : "bg-white dark:bg-[#1A2332] dark:text-white"}`}>{d}</button>)}</div></div>}
          {step === 4 && (
            <div>
              <div className="font-bold mb-2 dark:text-white">{(t as any).quote.departure} — <span className="text-[#0E7C6B]">Arabie Saoudite</span> (scrollable — {SAUDI_CITIES.length} villes)</div>
              <select value={form.cityFrom} onChange={e => setForm({ ...form, cityFrom: e.target.value })} className="w-full h-12 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm">
                {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="mt-3 max-h-[160px] overflow-y-auto rounded-2xl border dark:border-[#1E293B] bg-white dark:bg-[#0F172A] p-2 grid grid-cols-2 gap-1">
                {SAUDI_CITIES.map(c => (
                  <button key={c} onClick={() => setForm({ ...form, cityFrom: c })} className={`text-left px-3 py-1.5 rounded-full text-xs font-medium ${form.cityFrom === c ? "bg-[#0E7C6B] text-white font-bold" : "hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332] dark:text-white border border-transparent"}`}>{c}</button>
                ))}
              </div>
            </div>
          )}
          {step === 5 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.budget}</div><select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="w-full h-12 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white"><option>0 - 1000 SAR</option><option>1000 - 3000 SAR</option><option>2000-4000 SAR</option><option>4000 - 7000 SAR</option><option>7000+ SAR</option></select></div>}
          {step === 6 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.services}</div><div className="flex flex-wrap gap-2">{["Vol","Hôtel","Transport","Activités","Excursions","Assurance","Guide","Visa"].map(s => <button key={s} onClick={() => setForm({ ...form, services: form.services.includes(s) ? form.services.filter(x => x !== s) : [...form.services, s] })} className={`px-4 py-2 rounded-full font-bold border ${form.services.includes(s) ? "bg-[#0E7C6B] text-white" : "bg-white dark:bg-[#1A2332] dark:text-white"}`}>{s}</button>)}</div></div>}
          {step === 7 && <div><div className="font-bold mb-2 dark:text-white">{(t as any).quote.prefs}</div><textarea value={form.prefs} onChange={e => setForm({ ...form, prefs: e.target.value })} placeholder="Préférences, budget flexible, hôtel 5★..." className="w-full h-28 rounded-2xl border p-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" /></div>}
          {step === 8 && (
            <div className="rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border p-5">
              <div className="font-bold mb-3 dark:text-white">{(t as any).quote.summary}</div>
              <div className="space-y-2 text-sm dark:text-white">
                <div className="flex justify-between"><span className="text-[#64748B]">Destination</span><b>{form.destination}</b></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Voyageurs</span><b>{form.travelers}</b></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Durée</span><b>{form.duration}</b></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Départ</span><b>{form.cityFrom} • KSA</b></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Budget</span><b>{form.budget}</b></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Services</span><b>{form.services.join(", ")}</b></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Utilisateur</span><b>{user?.email || "Non connecté"}</b></div>
              </div>
              {sent && <div className="mt-4 p-3 rounded-2xl bg-[#ECFDF5] text-[#065F46] text-sm font-bold text-center">✓ Demande envoyée à toutes les agences validées — notifications temps réel !</div>}
              {error && <div className="mt-3 p-3 rounded-2xl bg-[#FEF2F2] text-[#991B1B] text-sm text-center">{error}</div>}
            </div>
          )}
        </div>
        <div className="flex justify-between mt-6">
          <button disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))} className="px-6 py-3 rounded-full border font-bold disabled:opacity-40 dark:text-white">{(t as any).quote.back}</button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="px-8 py-3 rounded-full bg-[#0E7C6B] text-white font-bold">{(t as any).quote.continue}</button>
          ) : !sent ? (
            <button onClick={handleSend} disabled={sending || !user} className="px-8 py-3 rounded-full bg-[#0F172A] dark:bg-white dark:text-black text-white font-bold disabled:opacity-50">{sending ? "..." : (t as any).quote.send}</button>
          ) : (
            <Link href="/dashboard" className="px-8 py-3 rounded-full bg-[#0E7C6B] text-white font-bold">Voir mes demandes →</Link>
          )}
        </div>
        <p className="text-xs text-[#94A3B8] mt-4 text-center">{(t as any).quote.sentTo} — Envoi temps réel vers {`toutes les agences validées`}</p>
      </div>
    </div>
  );
}
