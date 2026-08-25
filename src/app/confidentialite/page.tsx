import Link from "next/link";

export const metadata = { title: "Politique de confidentialité — TravGo KSA", description: "TravGo KSA protège vos données personnelles. Dernière mise à jour 25 août 2026 — collecte, usage, partage, cookies, sécurité, droits." };

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-[#080C14]">
      <div className="bg-gradient-to-br from-[#0E7C6B] via-[#0A5E51] to-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.14),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1280px] px-4 lg:px-6 py-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs font-bold">🔒 Politique de confidentialité</div>
          <h1 className="text-3xl lg:text-4xl font-black mt-4">Confidentialité</h1>
          <p className="text-white/70 mt-2 max-w-2xl text-sm">Dernière mise à jour : <b className="text-white">25 août 2026</b> — TravGo accorde une grande importance à la protection de vos données personnelles.</p>
          <div className="flex gap-2 mt-4 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-white text-[#0E7C6B] font-black">Données chiffrées</span>
            <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white font-bold">SAR • me-central1</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] bg-white dark:bg-[#0F172A] rounded-[20px] border p-4">
            <div className="text-xs font-black tracking-widest text-[#64748B] mb-3">11 SECTIONS</div>
            <nav className="space-y-1 text-sm">
              {[
                ["1", "Données collectées"],
                ["2", "Utilisation"],
                ["3", "Partage"],
                ["4", "Cookies"],
                ["5", "Sécurité"],
                ["6", "Conservation"],
                ["7", "Vos droits"],
                ["8", "Mineurs"],
                ["9", "Transferts"],
                ["10", "Modifications"],
                ["11", "Contact"],
              ].map(([n, t]) => (
                <a key={n} href={`#s${n}`} className="block px-3 py-2 rounded-full text-[#334155] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332] font-medium">{n}. {t}</a>
              ))}
            </nav>
            <div className="mt-4 p-3 rounded-2xl bg-[#0F172A] text-white text-xs">
              <div className="font-bold">Contact confidentialité</div>
              <a href="tel:+966598009209" className="underline font-black">+966 598 009 209</a>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6 text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">
            Cette Politique explique quelles informations peuvent être collectées lorsque vous utilisez TravGo, comment elles peuvent être utilisées et quelles mesures sont mises en place pour contribuer à leur protection.
          </div>

          <section id="s1" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6 lg:p-8">
            <h2 className="text-lg font-black dark:text-white flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-[#E6F4F1] dark:bg-[#134E4A] flex items-center justify-center text-sm">1</span> Données que nous pouvons collecter</h2>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border p-4">
                <div className="font-bold text-sm dark:text-white">Compte</div>
                <ul className="mt-2 space-y-1 text-xs text-[#475569] dark:text-[#94A3B8] list-disc list-inside">
                  <li>Nom et prénom</li><li>Adresse e-mail</li><li>Numéro de téléphone</li><li>Préférences de langue</li><li>Préférences d'utilisation</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border p-4">
                <div className="font-bold text-sm dark:text-white">Voyages</div>
                <ul className="mt-2 space-y-1 text-xs text-[#475569] dark:text-[#94A3B8] list-disc list-inside">
                  <li>Destination recherchée</li><li>Dates souhaitées</li><li>Nombre de voyageurs</li><li>Type de voyage</li><li>Demande de devis</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border p-4">
                <div className="font-bold text-sm dark:text-white">Technique</div>
                <ul className="mt-2 space-y-1 text-xs text-[#475569] dark:text-[#94A3B8] list-disc list-inside">
                  <li>Type d'appareil / Navigateur</li><li>Système d'exploitation</li><li>Adresse IP</li><li>Pages consultées</li><li>Erreurs techniques</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="s2" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">2. Comment utilisons-nous vos données ?</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {["Créer et gérer votre compte","Permettre les fonctionnalités TravGo","Répondre à vos demandes","Traiter vos demandes de devis","Vous mettre en relation avec les prestataires","Personnaliser votre expérience","Améliorer les performances","Détecter la fraude","Assurer la sécurité","Vous envoyer des communications","Respecter les obligations légales"].map(x=>(
                <div key={x} className="flex gap-2 text-sm p-2 rounded-xl bg-[#F8FAFB] dark:bg-[#1A2332] border dark:border-[#1E293B] dark:text-white"><span className="text-[#0E7C6B]">•</span>{x}</div>
              ))}
            </div>
          </section>

          <section id="s3" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">3. Partage des informations</h2>
            <div className="mt-3 p-4 rounded-2xl bg-[#ECFDF5] dark:bg-[#052E2B] border border-[#A7F3D0] dark:border-[#134E4A] text-sm dark:text-white"><b className="text-[#065F46] dark:text-[#6EE7B7]">TravGo ne vend pas vos données personnelles.</b> Certaines informations peuvent être transmises au prestataire lorsque vous demandez un devis, ou à des prestataires techniques (hébergement, sécurité, analyse) uniquement pour l'exécution de leurs services.</div>
          </section>

          <section id="s4" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">4. Cookies et technologies similaires</h2>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-2">TravGo peut utiliser des cookies pour faire fonctionner la plateforme, mémoriser des préférences, comprendre l'utilisation, améliorer les performances et renforcer la sécurité. Vous pouvez limiter certains cookies dans votre navigateur — certaines fonctionnalités peuvent être affectées.</p>
            <div className="mt-3 flex gap-2 text-xs"><span className="px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] border dark:text-white">Fonctionnels</span><span className="px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] border dark:text-white">Préférences</span><span className="px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] border dark:text-white">Performance</span></div>
          </section>

          <section id="s5" className="bg-[#0F172A] text-white rounded-[20px] p-6">
            <h2 className="font-black">5. Sécurité des données</h2>
            <p className="text-sm text-white/70 mt-2">Mesures techniques et organisationnelles raisonnables contre l'accès non autorisé, la perte ou la modification. Aucun système ne peut garantir une sécurité absolue — protégez vos identifiants et ne partagez jamais votre mot de passe.</p>
          </section>

          <section id="s6" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">6. Conservation des données</h2>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8]">Conservation uniquement pendant la durée nécessaire aux finalités collectées, ou pour respecter nos obligations légales, résoudre les litiges et faire respecter nos accords. La durée varie selon la nature des informations.</p>
          </section>

          <section id="s7" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">7. Vos droits</h2>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {["Accès à certaines données","Correction d'informations incorrectes","Suppression lorsque possible","Opposition à certains traitements","Limitation de traitements","Retrait du consentement","Informations sur l'utilisation"].map(x=>(
                <div key={x} className="p-3 rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border text-sm dark:text-white">• {x}</div>
              ))}
            </div>
            <p className="text-xs text-[#94A3B8] mt-3">Certaines demandes peuvent être soumises à des conditions ou exceptions prévues par la réglementation.</p>
          </section>

          <section id="s8" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">8. Données des mineurs</h2>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8]">TravGo n'a pas vocation à collecter volontairement des données de mineurs nécessitant un consentement parental. Si vous pensez qu'un mineur a fourni des informations de manière inappropriée, contactez-nous.</p>
          </section>

          <section id="s9" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">9. Transferts internationaux</h2>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8]">TravGo peut utiliser des services ou prestataires pouvant traiter certaines données depuis des pays différents. Des mesures appropriées sont prises pour un traitement conforme aux exigences légales.</p>
          </section>

          <section id="s10" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <h2 className="font-black dark:text-white">10. Modifications de cette politique</h2>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8]">Cette Politique peut être mise à jour périodiquement. La date en haut de page indique la dernière mise à jour. Consultez régulièrement cette page.</p>
          </section>

          <section id="s11" className="bg-gradient-to-br from-[#0E7C6B] to-[#0A5E51] rounded-[20px] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div><div className="font-black">11. Nous contacter</div><div className="text-sm text-white/80">Une question sur vos données ? Contact • <a href="tel:+966598009209" className="underline font-black">+966 598 009 209</a></div></div>
            <Link href="/help" className="px-5 py-2.5 rounded-full bg-white text-[#0E7C6B] font-black text-sm">Centre d'aide</Link>
          </section>

          <div className="text-center text-xs text-[#94A3B8]">© 2026 TravGo KSA — Discover. Compare. Travel.</div>
        </div>
      </div>
    </div>
  );
}
