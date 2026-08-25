"use client";
export function AIStatusBadge({ status }: { status: "AI_CHECKING"|"AI_APPROVED"|"AI_WARNING"|"AI_REJECTED"|"ADMIN_REVIEW"|"PUBLISHED"|"SUSPENDED"|"DRAFT" }){
  const map:Record<string,string> = {
    DRAFT:"bg-[#F1F5F9] text-[#475569] border",
    AI_CHECKING:"bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] animate-pulse",
    AI_APPROVED:"bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]",
    AI_WARNING:"bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]",
    AI_REJECTED:"bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]",
    ADMIN_REVIEW:"bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]",
    PUBLISHED:"bg-[#0E7C6B] text-white",
    SUSPENDED:"bg-[#0F172A] text-white",
  };
  const label:Record<string,string> = {
    DRAFT:"Brouillon", AI_CHECKING:"IA en vérification…", AI_APPROVED:"IA approuvé", AI_WARNING:"IA alerte", AI_REJECTED:"IA bloqué", ADMIN_REVIEW:"Revue admin", PUBLISHED:"Publié", SUSPENDED:"Suspendu"
  };
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${map[status]}`}>{status==="AI_CHECKING" && <span className="h-2 w-2 rounded-full bg-current animate-pulse"/>}{label[status] || status}</span>;
}
export function AIWarning({ reason, score }: { reason:string; score:number }){
  return (
    <div className="rounded-2xl bg-[#FEF2F2] dark:bg-[#2A0F12] border border-[#FECACA] dark:border-[#450A18] p-4">
      <div className="flex items-center gap-2 font-bold text-sm text-[#991B1B] dark:text-[#FCA5A5]">⚠️ Incohérence détectée — Score {(score*100).toFixed(0)}%</div>
      <p className="text-sm text-[#7F1D1D] dark:text-[#FECACA] mt-1">{reason}</p>
      <p className="text-xs text-[#991B1B] dark:text-[#FCA5A5] mt-2">Votre contenu semble présenter une destination différente de celle indiquée. Vérifiez vos médias avant publication.</p>
    </div>
  );
}
