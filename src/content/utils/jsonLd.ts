interface SimpleOffer {
  "@type": "Offer";
  price: string;
}

interface AggregateOffer {
  "@type": "AggregateOffer";
  lowPrice: string;
  highPrice: string;
}

type ProductOffer = SimpleOffer | AggregateOffer;

interface ImageJsonLd {
  "@type": "ImageObject";
  contentUrl?: string;
  description?: string;
}

interface VideoJsonLd {
  "@type": "VideoObject";
  name?: string;
  description?: string;
}

interface ProductJsonLd {
  "@type"?: string;
  image?: ImageJsonLd[];
  offers?: ProductOffer;
  description?: string;
}

function isProductJsonLd(value: unknown): value is ProductJsonLd {
  return typeof value === "object" && value !== null && (value as { "@type"?: unknown })["@type"] === "Product";
}

function isVideoJsonLd(value: unknown): value is VideoJsonLd {
  return typeof value === "object" && value !== null && (value as { "@type"?: unknown })["@type"] === "VideoObject";
}

function getProductJsonLd(doc: Document): ProductJsonLd | null {
  return findJsonLdByType(doc, isProductJsonLd);
}

function getVideoJsonLd(doc: Document): VideoJsonLd | null {
  return findJsonLdByType(doc, isVideoJsonLd);
}

function findJsonLdByType<T extends { "@type"?: string }>(
  doc: Document,
  guard: (value: unknown) => value is T
): T | null {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts.item(i);
    if (!script) continue;

    try {
      const parsed = JSON.parse(script.textContent ?? "");
      const candidates: unknown[] = Array.isArray(parsed) ? parsed : [parsed];
      const match = candidates.find(guard);
      if (match) return match;
    } catch {
      continue;
    }
  }
  return null;
}

export { getProductJsonLd, getVideoJsonLd };
export type { SimpleOffer, AggregateOffer, ProductOffer, ProductJsonLd, VideoJsonLd };