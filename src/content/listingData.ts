interface ListingData {
  title: string | null;
  photoCount: number;
  hasVideo: boolean;
  description: string | null;
  price: string | null;     // string brute, pas de parsing € / $ ici
  hasShippingInfo: boolean;
}

export type { ListingData as default };