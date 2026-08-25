export const metadata = { title: "Télécharger APK — TravGo" };

export default function DownloadPage() {
  return (
    <div className="mx-auto max-w-[640px] px-4 py-10">
      <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-8 text-center">
        <img src="/icon.png" alt="TravGo" className="h-24 w-24 mx-auto rounded-3xl border shadow" />
        <h1 className="text-2xl font-black mt-4 dark:text-white">TravGo APK</h1>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">travgo.web.app • com.travgo.app • 9.7 MB</p>
        <div className="grid gap-3 mt-6">
          <a href="https://github.com/Nollycom/TravelGo/releases/download/v1.0.0/app-debug.apk" className="w-full h-12 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold flex items-center justify-center">⬇️ Télécharger APK v1.0.0 (GitHub)</a>
          <a href="https://github.com/Nollycom/TravelGo/releases/tag/v1.0.0" target="_blank" className="w-full h-11 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white font-bold flex items-center justify-center">Voir la Release GitHub</a>
          <span className="text-xs text-[#64748B]">Hébergement Firebase Spark : APK non autorisé en Hosting (.apk bloqué) — utilisez GitHub ou Storage (voir ci-dessous). Passe en Blaze pour héberger sur travgo.web.app/app-debug.apk</span>
        </div>
        <div className="mt-6 p-3 rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border dark:border-[#1E293B] text-left text-xs text-[#475569] dark:text-[#94A3B8]">
          <b>Installation:</b> Autoriser les sources inconnues → ouvrir l&apos;APK → Installer. Version debug signée — pour prod, générer une clé release.
        </div>
      </div>
    </div>
  );
}
