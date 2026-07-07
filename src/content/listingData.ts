interface listingData {
  title: string | null;
  tags: string[];           // vide si aucun tag trouvé
  photoCount: number;
  hasVideo: boolean;
  description: string | null;
  price: string | null;     // string brute, pas de parsing € / $ ici
  hasShippingInfo: boolean;
  shopSection: string | null;
}