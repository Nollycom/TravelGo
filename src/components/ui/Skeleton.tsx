export function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-[#E2E8F0] rounded-xl ${className || ""}`} />;
}
