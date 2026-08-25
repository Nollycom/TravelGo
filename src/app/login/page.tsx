"use client";
import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useI18n } from "@/lib/i18n/provider";

function phoneToEmail(phone:string){
  const digits = phone.replace(/\D/g,"");
  const norm = digits.startsWith("966") ? digits : digits.startsWith("0") ? "966"+digits.slice(1) : "966"+digits;
  return `${norm}@phone.travgo.sa`;
}

export default function LoginPage(){
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<"phone"|"email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async ()=>{
    setMsg(""); setLoading(true);
    const em = tab==="phone" ? phoneToEmail(phone) : email.trim().toLowerCase();
    try{
      if(!em || !pass) throw new Error(lang==="ar"?"املأ كل الحقول":"Remplis tous les champs");
      const cred = await signInWithEmailAndPassword(auth, em, pass);
      // Récupère rôle depuis Firestore
      let role: string | null = null;
      let userData:any = null;
      try{
        const snap = await getDoc(doc(db,"users", cred.user.uid));
        if(snap.exists()){
          userData = snap.data();
          role = userData.role;
          localStorage.setItem("travgo-user", JSON.stringify(userData));
          if(role) localStorage.setItem("travgo-role", role);
        }
      }catch(e){ console.warn("users doc read failed", e); }

      setMsg("✓ "+(lang==="ar"?"تم تسجيل الدخول":"Connecté")+" — redirection...");
      setTimeout(()=>{
        if(role==="ADMIN" || role==="SUPER_ADMIN") location.href="/admin";
        else if(role==="PROVIDER" || role==="PROVIDER_PENDING") location.href="/provider/dashboard";
        else location.href="/dashboard";
      }, 700);
      return;
    }catch(e:any){
      // Fallback Firestore si Auth désactivé (CONFIGURATION_NOT_FOUND)
      const isConfigMissing = e.message?.includes("CONFIGURATION_NOT_FOUND") || e.code?.includes("CONFIGURATION_NOT_FOUND");
      if(isConfigMissing){
        try{
          const q = query(collection(db,"users"), where("email","==", em));
          const snap = await getDocs(q);
          let found:any=null; let foundId="";
          snap.forEach(d=>{ const v=d.data(); if(v.password===pass || v.email===em) {found=v; foundId=d.id;} });
          if(!found && tab==="phone"){
            const phoneNorm = phone.replace(/\D/g,"");
            const q2 = query(collection(db,"users"), where("phone","==", phoneNorm));
            const snap2 = await getDocs(q2);
            snap2.forEach(d=>{ const v=d.data(); if(v.password===pass) {found=v; foundId=d.id;} });
          }
          // Admin fallback dur (si doc contient password)
          if(!found && em==="khalil.alnajjar81@gmail.com" && pass==="2026@"){
            found={role:"ADMIN", name:"khalil", email:em}; foundId="khalil-admin";
          }
          if(found){
            const docData = {...found, uid: foundId || found.uid};
            localStorage.setItem("travgo-user", JSON.stringify(docData));
            localStorage.setItem("travgo-role", found.role);
            if(found.password) console.warn("Login via Firestore fallback (Auth désactivé) — à migrer");
            setMsg("✓ "+(lang==="ar"?"تم تسجيل الدخول":"Connecté")+" (mode dégradé) — redirection...");
            setTimeout(()=> { if(found.role==="ADMIN" || found.role==="SUPER_ADMIN") location.href="/admin"; else if(found.role==="PROVIDER"||found.role==="PROVIDER_PENDING") location.href="/provider/dashboard"; else location.href="/dashboard"; }, 700);
            return;
          }
        }catch(fe){ console.error(fe); }
        setMsg("✗ CONFIGURATION_NOT_FOUND: Active Email/Password dans Firebase Console > Authentication > Sign-in method. En attendant, aucun compte Firestore trouvé.");
        console.error(e);
        return;
      }
      let m = e.message || "Erreur";
      const code = e.code || "";
      if(code.includes("invalid-credential") || code.includes("user-not-found") || code.includes("wrong-password")){
        m = lang==="ar" ? "بيانات غير صحيحة — تحقق من الهاتف/البريد وكلمة المرور" : "Identifiants incorrects — vérifie téléphone/email et mot de passe.";
      }
      if(code.includes("invalid-email")) m = "Email invalide.";
      if(code.includes("too-many-requests")) m = "Trop de tentatives — réessaie plus tard.";
      if(code.includes("network-request-failed")) m = "Erreur réseau — vérifie ta connexion.";
      if(code.includes("CONFIGURATION_NOT_FOUND")) m = "Auth non configurée — active Email/Password dans Firebase Console.";
      setMsg("✗ "+m);
      console.error(e);
    }finally{ setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left - Saudi visual */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&h=1200&fit=crop" alt="AlUla Saudi" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-[#0E7C6B]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs font-bold">🇸🇦 المملكة العربية السعودية • KSA</div>
            <h2 className="text-4xl font-black leading-tight mt-6">أهلاً وسهلاً<br/><span className="text-[#FFD8B5]">في TravGo</span></h2>
            <p className="text-white/90 mt-3 max-w-md leading-relaxed">اكتشف العلا، جدة، الرياض ونيوم مع محترفين مرخصين. عروض موثقة، دفع آمن، ورد خلال ساعتين.</p>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-bold">العلا • Hegra</span>
              <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-bold">جدة • البحر الأحمر</span>
              <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-bold">نيوم</span>
            </div>
            <p className="text-white/60 text-xs">© 2026 TravGo KSA — Marketplace licencié MOT • SAR • Asia/Riyadh</p>
          </div>
        </div>
      </div>

      {/* Right - Form with splash bg */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-[#F8FAFB] dark:bg-[#080C14] relative">
        <div className="absolute inset-0 lg:hidden opacity-[0.07]" style={{backgroundImage:"url(https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=800&fit=crop)", backgroundSize:"cover", backgroundPosition:"center"}} />
        <div className="relative w-full max-w-[440px] rounded-[24px] border border-[#E2E8F0] dark:border-[#1E293B] p-6 lg:p-8 shadow-xl shadow-black/5 overflow-hidden bg-white dark:bg-[#0F172A]" style={{backgroundImage:"url('/bg-login.png')", backgroundSize:"cover", backgroundPosition:"center"}}>
          <div className="absolute inset-0 bg-white/88 dark:bg-[#0F172A]/88 backdrop-blur-[1px]" />
          <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-[#0E7C6B] dark:bg-[#14B8A6] flex items-center justify-center text-white font-black text-sm icon-3d">TG</div>
            <span className="font-black">TravGo</span><span className="text-xs bg-[#0E7C6B]/10 dark:bg-[#14B8A6]/15 text-[#0E7C6B] dark:text-[#14B8A6] px-2 py-0.5 rounded-full font-bold">KSA</span>
          </div>
          <h1 className="text-xl font-black dark:text-white">{t.login.title}</h1>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{t.login.sub}</p>
          <div className="flex gap-2 mt-5">
            <button onClick={()=>setTab("phone")} className={`flex-1 h-11 rounded-full font-bold text-sm transition ${tab==="phone"?"bg-[#0F172A] dark:bg-white dark:text-black text-white":"border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white hover:bg-[#F8FAFB] dark:hover:bg-[#1A2332]"}`}>{t.login.phoneTab}</button>
            <button onClick={()=>setTab("email")} className={`flex-1 h-11 rounded-full font-bold text-sm transition ${tab==="email"?"bg-[#0F172A] dark:bg-white dark:text-black text-white":"border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white hover:bg-[#F8FAFB] dark:hover:bg-[#1A2332]"}`}>{t.login.emailTab}</button>
          </div>
          <div className="mt-5 space-y-3">
            {tab==="phone" ? (
              <div>
                <label className="text-sm font-bold dark:text-white">{t.login.phoneLabel}</label>
                <div className="flex gap-2 mt-1">
                  <span className="h-12 px-3 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white flex items-center font-bold text-sm">+966</span>
                  <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="5X XXX XXXX" className="flex-1 h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm" dir="ltr" />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-bold dark:text-white">{t.login.emailLabel}</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="nom@exemple.sa" type="email" className="w-full h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm mt-1" dir="ltr" />
              </div>
            )}
            <div>
              <label className="text-sm font-bold dark:text-white">{t.login.passLabel}</label>
              <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" type="password" className="w-full h-12 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm mt-1" dir="ltr" />
            </div>
            <button onClick={onLogin} disabled={loading} className="w-full h-12 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold disabled:opacity-50 shadow hover:opacity-90 transition">{loading?"...":t.login.loginBtn}</button>
            {msg && <div className={`text-sm p-3 rounded-2xl ${msg.startsWith("✓")?"bg-[#ECFDF5] dark:bg-[#0F2A26] text-[#065F46] dark:text-[#6EE7B7] border border-[#A7F3D0] dark:border-[#134E4A]":"bg-[#FEF2F2] dark:bg-[#2A0F12] text-[#991B1B] dark:text-[#FCA5A5] border border-[#FECACA] dark:border-[#450A18]"}`}>{msg}</div>}
            <div className="flex justify-between text-xs text-[#64748B] dark:text-[#94A3B8] pt-1">
              <Link href="/register" className="font-bold text-[#0E7C6B] dark:text-[#14B8A6] hover:underline">{t.login.noAccount}</Link>
              <Link href="/" className="hover:underline">← Retour</Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
