import { getProductJsonLd, type ProductOffer } from "../utils/jsonLd";

interface CompletenessData {
  price: string | null;
  hasShippingInfo: boolean;
}

function retrieveCompleteness(doc: Document): CompletenessData {
    const price = retrievePrice(getProductJsonLd(doc)?.offers);
    const hasShippingInfo = !!doc.querySelector('[data-selector="shipping-highlights"]');

    return {
        price,
        hasShippingInfo,
    };
}

function retrievePrice(offers: ProductOffer | undefined): string | null {
  if (offers === undefined) {
    return null;
  }

  if (offers["@type"] === "Offer") {
    return offers.price;
  } else {
    return `${offers.lowPrice} - ${offers.highPrice}`;
  }
}

export default retrieveCompleteness;
export type { CompletenessData };