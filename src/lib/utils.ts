export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number, currency: string = "MAD") {
  return new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(price) + " " + currency;
}

export function getOfferUrl(slug: string) { return `/offers/${slug}`; }
export function getProviderUrl(slug: string) { return `/providers/${slug}`; }
