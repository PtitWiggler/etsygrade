interface CompletenessData {
  price: string | null;
  hasShippingInfo: boolean;
  shopSection: string | null;
}

interface ProductJsonLd {
  "@type"?: string;
  offers?: {
    price?: string;
  };
}

function retrieveCompleteness(doc: Document): CompletenessData {
    const price = getProductJsonLd(doc)?.offers?.price ?? null;
    const hasShippingInfo = !!doc.querySelector(".shipping-info");
    const shopSection = doc.querySelector(".shop-section")?.textContent?.trim() ?? null;

    return {
        price,
        hasShippingInfo,
        shopSection
    };
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

export default retrieveCompleteness;
export type { CompletenessData };