import { offers, providers } from "@/lib/data";
import ProviderDetailClient from "@/components/provider/ProviderDetailClient";

export function generateStaticParams() { return providers.map(p=>({ slug: p.slug })); }

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = (providers as any[]).find(p=>p.slug===slug) || (providers as any[])[0];
  const provOffers = (offers as any[]).filter(o=>o.providerId===provider.id);
  return <ProviderDetailClient provider={provider} provOffers={provOffers} offers={offers as any[]} />;
}
