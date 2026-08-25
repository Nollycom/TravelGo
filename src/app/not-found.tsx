import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[640px] px-4 py-16 text-center">
      <div className="text-6xl">🏝️</div>
      <h1 className="text-3xl font-black mt-4">Cette destination n&apos;existe pas encore.</h1>
      <p className="text-[#64748B] mt-2">La page que vous cherchez a peut-être été déplacée ou n&apos;a jamais existé — comme une île non cartographiée.</p>
      <Link href="/" className="inline-flex mt-6 px-8 py-3 rounded-full bg-[#0E7C6B] text-white font-bold">Retourner à l&apos;exploration →</Link>
    </div>
  );
}
