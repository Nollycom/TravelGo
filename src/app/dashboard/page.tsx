"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot, deleteDoc, orderBy, serverTimestamp, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase/config";
import { offers as staticOffers } from "@/lib/data";
import OfferCard from "@/components/offer/OfferCard";
import { useI18n } from "@/lib/i18n/provider";

type Tab = "requests" | "quotes" | "favs" | "searches" | "reels" | "notifs" | "profile";

export default function Dashboard() {
  const { t, lang } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("requests");

  // Data temps réel
  const [requests, setRequests] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [favs, setFavs] = useState<any[]>([]);
  const [searches, setSearches] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);

  // Profile form
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editBio, setEditBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const snap = await getDoc(doc(db, "users", fbUser.uid));
          const data = snap.exists() ? { uid: fbUser.uid, email: fbUser.email, ...snap.data() } : { uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName };
          setUser(data);
          setEditName((data as any).name || "");
          setEditPhone((data as any).phone || "");
          setEditCity((data as any).city || "");
          setEditBio((data as any).bio || "");
        } catch { setUser({ uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName }); }
      } else {
        try { const raw = localStorage.getItem("travgo-user"); setUser(raw ? JSON.parse(raw) : null); } catch { setUser(null); }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Listeners temps réel par user
  useEffect(() => {
    if (!user?.uid) return;
    const q1 = query(collection(db, "quoteRequests"), where("userId", "==", user.uid));
    const un1 = onSnapshot(q1, (snap) => setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() }))), () => setRequests([]));
    const q2 = query(collection(db, "notifications"), where("userId", "==", user.uid));
    const un2 = onSnapshot(q2, (snap) => setNotifs(snap.docs.map(d => ({ id: d.id, ...d.data() }))), () => setNotifs([]));
    const q3 = query(collection(db, "favorites"), where("userId", "==", user.uid));
    const un3 = onSnapshot(q3, (snap) => setFavs(snap.docs.map(d => ({ id: d.id, ...d.data() }))), () => setFavs([]));
    const q4 = query(collection(db, "searches"), where("userId", "==", user.uid));
    const un4 = onSnapshot(q4, (snap) => setSearches(snap.docs.map(d => ({ id: d.id, ...d.data() }))), () => setSearches([]));
    // Reels sauvegardés (simulé via favorites reels)
    const q5 = query(collection(db, "users", user.uid, "favorites"));
    const un5 = onSnapshot(q5, (snap) => {
      const subFavs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // merge avec top-level favs si vide
      if (subFavs.length) setFavs(prev => prev.length ? prev : subFavs as any);
    }, () => {});
    return () => { un1(); un2(); un3(); un4(); un5(); };
  }, [user?.uid]);

  // Pour Devis reçus : on montre les mêmes requests avec status answered (simulé)
  useEffect(() => {
    setQuotes(requests.filter((r: any) => r.status === "answered" || r.responses > 0));
  }, [requests]);

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    setSaving(true); setMsg("");
    try {
      let photoURL = user.photoURL || user.avatar || null;
      if (photoFile) {
        const r = ref(storage, `avatars/${user.uid}/avatar.jpg`);
        await uploadBytes(r, photoFile);
        photoURL = await getDownloadURL(r);
      }
      await updateDoc(doc(db, "users", user.uid), {
        name: editName, phone: editPhone.replace(/\D/g, ""), city: editCity, bio: editBio, ...(photoURL ? { photoURL, avatar: photoURL } : {}),
        updatedAt: serverTimestamp(),
      });
      if (auth.currentUser && editName) await updateProfile(auth.currentUser, { displayName: editName, ...(photoURL ? { photoURL } : {}) });
      const updated = { ...user, name: editName, phone: editPhone, city: editCity, bio: editBio, photoURL, avatar: photoURL };
      setUser(updated);
      localStorage.setItem("travgo-user", JSON.stringify(updated));
      setMsg((t as any).dashboard.saveSuccess);
      setTimeout(() => setMsg(""), 2000);
    } catch (e: any) { setMsg("✗ " + (e.message || "Erreur")); }
    finally { setSaving(false); }
  };

  const delRequest = async (id: string) => { if (!confirm((t as any).dashboard.confirmDelete)) return; await deleteDoc(doc(db, "quoteRequests", id)); setMsg((t as any).dashboard.deleteSuccess); setTimeout(()=>setMsg(""),1500); };
  const delNotif = async (id: string) => { await deleteDoc(doc(db, "notifications", id)); };
  const delFav = async (id: string) => { try { await deleteDoc(doc(db, "favorites", id)); } catch { await deleteDoc(doc(db, "users", user.uid, "favorites", id)); } };
  const delSearch = async (id: string) => { try { await deleteDoc(doc(db, "searches", id)); } catch { await deleteDoc(doc(db, "users", user.uid, "searches", id)); } };

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

  const tabs: { id: Tab; label: string }[] = [
    { id: "requests", label: (t as any).dashboard.myRequests },
    { id: "quotes", label: (t as any).dashboard.quotesReceived },
    { id: "favs", label: (t as any).dashboard.favs },
    { id: "searches", label: (t as any).dashboard.searches },
    { id: "reels", label: (t as any).dashboard.reelsTab },
    { id: "notifs", label: (t as any).dashboard.notifications },
    { id: "profile", label: (t as any).dashboard.profile },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-[260px] shrink-0">
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-4 sticky top-[76px]">
            <div className="flex items-center gap-3 mb-4">
              <img src={user.photoURL || user.avatar || `https://i.pravatar.cc/100?u=${user.email}`} alt="user" className="h-11 w-11 rounded-full object-cover border" />
              <div className="flex-1 min-w-0"><div className="font-bold text-sm dark:text-white truncate">{user.name || user.email?.split("@")[0]}</div><div className="text-xs text-[#64748B] truncate">{user.email}</div><div className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0F172A] text-white inline-block mt-1">{user.role || "USER"}</div></div>
            </div>
            <nav className="space-y-1 text-sm font-semibold">
              {tabs.map(tb => (
                <button key={tb.id} onClick={() => setTab(tb.id)} className={`w-full text-left block px-3 py-2 rounded-full ${tab === tb.id ? "bg-[#0F172A] dark:bg-white dark:text-black text-white" : "hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332] dark:text-[#94A3B8]"}`}>
                  {tb.label}
                </button>
              ))}
            </nav>
            <button onClick={async () => { await signOut(auth); localStorage.removeItem("travgo-user"); localStorage.removeItem("travgo-role"); location.href="/login"; }} className="w-full mt-3 h-9 rounded-full border text-xs font-bold dark:text-white hover:bg-[#F1F5F9]">Déconnexion</button>
            {msg && <div className="mt-3 text-xs p-2 rounded-xl bg-[#ECFDF5] text-[#065F46] text-center">{msg}</div>}
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          {/* Stats temps réel */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5"><div className="text-xs text-[#64748B]">{t.dashboard.activeDemands}</div><div className="text-2xl font-black dark:text-white">{requests.length}</div><div className="text-xs text-[#0E7C6B]">{requests.length ? `${requests.length} active(s)` : (t as any).dashboard.noData}</div></div>
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5"><div className="text-xs text-[#64748B]">{t.dashboard.quotesReceived}</div><div className="text-2xl font-black dark:text-white">{quotes.length}</div><div className="text-xs text-[#64748B]">{quotes.length ? `${quotes.length} à comparer` : (t as any).dashboard.noData}</div></div>
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5"><div className="text-xs text-[#64748B]">{t.dashboard.favs}</div><div className="text-2xl font-black dark:text-white">{favs.length}</div><div className="text-xs text-[#64748B]">{favs.length ? `${favs.length} sauvegardé(s)` : (t as any).dashboard.noData}</div></div>
          </div>

          {tab === "requests" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5">
              <div className="flex items-center justify-between mb-3"><h3 className="font-bold dark:text-white">{t.dashboard.myRequests}</h3><Link href="/quote" className="px-4 py-2 rounded-full bg-[#0E7C6B] text-white text-sm font-bold">{t.dashboard.newRequest}</Link></div>
              {requests.length === 0 ? <div className="text-sm text-[#64748B] py-8 text-center">{(t as any).dashboard.noData} — <Link href="/quote" className="text-[#0E7C6B] underline">Créer une demande</Link></div> : (
                <div className="space-y-3">
                  {requests.map((r: any) => (
                    <div key={r.id} className="rounded-2xl border p-4 flex flex-col lg:flex-row lg:items-center gap-4 dark:border-[#1E293B]">
                      <div className="flex-1 dark:text-white">
                        <div className="font-bold">{r.destination || r.dest || "Destination"} • {r.travelers || r.travelersCount || 2} {t.common.travelers}</div>
                        <div className="text-xs text-[#64748B]">{r.dates || r.date || "-"} • {r.budget || "-"} • {r.status || (t as any).dashboard.waiting}</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-[#E6F4F1] text-[#0E7C6B] text-xs font-bold">{r.responses || 0} {t.dashboard.responses}</span>
                        <button onClick={() => delRequest(r.id)} className="px-3 py-1.5 rounded-full border text-xs dark:text-white">{(t as any).dashboard.delete}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "quotes" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5">
              <h3 className="font-bold mb-3 dark:text-white">{t.dashboard.quotesReceived}</h3>
              {quotes.length === 0 ? <div className="text-sm text-[#64748B] py-6 text-center">{(t as any).dashboard.noData}</div> : (
                <div className="grid lg:grid-cols-3 gap-3">
                  {quotes.map((q: any) => (
                    <div key={q.id} className="rounded-2xl border p-4 bg-[#F8FAFB] dark:bg-[#1A2332]">
                      <div className="font-bold text-sm dark:text-white">{q.destination || q.dest}</div>
                      <div className="text-lg font-black dark:text-white">{q.budget || "-"}</div>
                      <div className="text-xs text-[#64748B]">{q.status || "En attente"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "favs" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5">
              <h3 className="font-bold mb-3 dark:text-white">{t.dashboard.favs}</h3>
              {favs.length === 0 ? <div className="text-sm text-[#64748B] py-6 text-center">{(t as any).favorites.emptyTitle} — {(t as any).favorites.emptyDesc}</div> : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favs.map((f: any) => {
                    const off = staticOffers.find(o => o.id === f.offerId || o.id === f.id) as any;
                    return (
                      <div key={f.id} className="rounded-2xl border overflow-hidden">
                        <img src={f.image || off?.image || "https://picsum.photos/400/300"} alt={f.title || off?.title} className="w-full h-32 object-cover" />
                        <div className="p-3">
                          <div className="font-bold text-sm line-clamp-1 dark:text-white">{f.title || off?.title || f.offerId}</div>
                          <button onClick={() => delFav(f.id)} className="mt-2 text-xs px-3 py-1 rounded-full border dark:text-white">{(t as any).dashboard.delete}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "searches" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5">
              <h3 className="font-bold mb-3 dark:text-white">{t.dashboard.searches}</h3>
              {searches.length === 0 ? <div className="text-sm text-[#64748B] py-6 text-center">{(t as any).dashboard.noData}</div> : (
                <div className="space-y-2">
                  {searches.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl border">
                      <div><div className="font-bold text-sm dark:text-white">{s.query || s.destination}</div><div className="text-xs text-[#64748B]">{s.createdAt?.toDate ? s.createdAt.toDate().toLocaleString() : ""}</div></div>
                      <button onClick={() => delSearch(s.id)} className="px-3 py-1 rounded-full border text-xs">{(t as any).dashboard.delete}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "reels" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5">
              <h3 className="font-bold mb-3 dark:text-white">{(t as any).dashboard.reelsTab}</h3>
              <p className="text-sm text-[#64748B]">Reels sauvegardés (temps réel) — swipe et sauvegarde depuis /reels.</p>
              {favs.filter((f: any) => f.type === "reel").length === 0 ? <div className="text-sm text-[#64748B] py-6 text-center">{(t as any).dashboard.noData}</div> : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {favs.filter((f: any) => f.type === "reel").map((r: any) => (
                    <div key={r.id} className="rounded-2xl border overflow-hidden p-3 text-sm dark:text-white">{r.title || r.reelId} <button onClick={() => delFav(r.id)} className="ml-2 text-xs border px-2 py-0.5 rounded-full">{(t as any).dashboard.delete}</button></div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "notifs" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5">
              <h3 className="font-bold mb-3 dark:text-white">{(t as any).dashboard.notifications}</h3>
              {notifs.length === 0 ? <div className="text-sm text-[#64748B] py-6 text-center">{(t as any).dashboard.noData}</div> : (
                <div className="space-y-2">
                  {notifs.map((n: any) => (
                    <div key={n.id} className="flex items-center justify-between p-3 rounded-2xl border">
                      <div><div className="font-bold text-sm dark:text-white">{n.title || "Notification"}</div><div className="text-xs text-[#64748B]">{n.message || n.body || ""}</div></div>
                      <button onClick={() => delNotif(n.id)} className="px-3 py-1 rounded-full border text-xs">{(t as any).dashboard.delete}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "profile" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold mb-4 dark:text-white">{(t as any).dashboard.editProfile}</h3>
              <div className="flex items-center gap-4 mb-4">
                <img src={user.photoURL || user.avatar || `https://i.pravatar.cc/100?u=${user.email}`} alt="avatar" className="h-20 w-20 rounded-full object-cover border" />
                <label className="px-4 py-2 rounded-full border text-sm font-bold dark:text-white cursor-pointer">
                  {(t as any).dashboard.photo} — Choisir
                  <input type="file" accept="image/*" className="hidden" onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
                </label>
                {photoFile && <span className="text-xs text-[#0E7C6B]">{photoFile.name}</span>}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><label className="text-xs font-bold dark:text-white">{(t as any).dashboard.nameLabel}</label><input value={editName} onChange={e => setEditName(e.target.value)} className="w-full mt-1 h-11 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm" /></div>
                <div><label className="text-xs font-bold dark:text-white">{(t as any).dashboard.phoneLabel}</label><input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full mt-1 h-11 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm" /></div>
                <div><label className="text-xs font-bold dark:text-white">{(t as any).dashboard.cityLabel}</label><input value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="Riyad / Jeddah..." className="w-full mt-1 h-11 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm" /></div>
                <div><label className="text-xs font-bold dark:text-white">{(t as any).dashboard.languageLabel}</label><select value={lang} onChange={e => location.reload()} className="w-full mt-1 h-11 rounded-full border px-4 bg-white dark:bg-[#1A2332] dark:text-white text-sm"><option>FR</option><option>AR</option><option>EN</option></select></div>
                <div className="sm:col-span-2"><label className="text-xs font-bold dark:text-white">{(t as any).dashboard.bioLabel}</label><textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3} className="w-full mt-1 rounded-2xl border p-3 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm" placeholder="À propos..." /></div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={handleSaveProfile} disabled={saving} className="px-6 h-11 rounded-full bg-[#0E7C6B] text-white font-bold disabled:opacity-50">{saving ? "..." : (t as any).dashboard.save}</button>
                <span className="text-sm text-[#0E7C6B] self-center">{msg}</span>
              </div>
              <div className="mt-4 p-3 rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border text-xs dark:text-white">
                <div><b>Email:</b> {user.email}</div><div><b>UID:</b> {user.uid}</div><div><b>Rôle:</b> {user.role}</div>
              </div>
            </div>
          )}

          <div>
            <h3 className="font-bold mb-3 dark:text-white">{t.dashboard.recommended}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {staticOffers.slice(0,3).map(o=> <OfferCard key={o.id} offer={o as any} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
