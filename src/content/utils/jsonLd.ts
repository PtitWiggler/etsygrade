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

interface ProductJsonLd {
  "@type"?: string;
  offers?: ProductOffer;
  description?: string;
}

function isProductJsonLd(value: unknown): value is ProductJsonLd {
  return typeof value === "object" && value !== null && (value as { "@type"?: unknown })["@type"] === "Product";
}

function getProductJsonLd(doc: Document): ProductJsonLd | null {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts.item(i);
    if (!script) continue;

    try {
      const parsed = JSON.parse(script.textContent ?? "");
      const candidates: unknown[] = Array.isArray(parsed) ? parsed : [parsed];
      const product = candidates.find(isProductJsonLd);
      if (product) return product;
    } catch {
      continue; // script malformé, on essaie le suivant
    }
  }
  return null;
}

export { getProductJsonLd };
export type { SimpleOffer, AggregateOffer, ProductOffer, ProductJsonLd };