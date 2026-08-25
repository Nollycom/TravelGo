import { offers } from "@/lib/data";
import OfferDetailClient from "@/components/offer/OfferDetailClient";
import { notFound } from "next/navigation";

export function generateStaticParams() { return offers.map(o=>({ id: o.slug })); }

export default async function OfferDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = (offers as any[]).find(o=>o.slug===id) || (offers as any[])[0];
  if(!offer) return notFound();
  return <OfferDetailClient offer={offer} />;
}
