export type Currency = "MAD" | "SAR" | "USD" | "EUR";

export interface Provider {
  id: string;
  name: string;
  slug: string;
  logo: string;
  cover: string;
  verified: boolean;
  rating?: number;
  reviews?: number;
  city: string;
  country: string;
  specialties: string[];
  description: string;
  phone: string;
  whatsapp: string;
  website?: string;
  instagram?: string;
  offersCount: number;
  featured?: boolean;
}

export interface Offer {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  cityFrom: string;
  image: string;
  images: string[];
  provider: Provider;
  providerId: string;
  price: number;
  currency: Currency;
  duration: string;
  durationDays: number;
  dates: string;
  includes: string[];
  excludes?: string[];
  category: string;
  sponsored?: boolean;
  featured?: boolean;
  verified: boolean;
  rating?: number;
  saves: number;
  views: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  offers: number;
  sponsored?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
  color: string;
}

export interface Reel {
  id: string;
  title: string;
  cover: string;
  video?: string;
  provider: Provider;
  offerId?: string;
  views: string;
  verified: boolean;
}

export interface QuoteRequest {
  id: string;
  destination: string;
  travelers: number;
  dates: string;
  duration: string;
  budget: string;
  status: "pending" | "answered" | "closed";
  responses: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  offers: number;
  features: string[];
  popular?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  placement: string;
  status: "active" | "paused" | "ended";
  impressions: number;
  clicks: number;
  ctr: string;
  spend: number;
}
