import { getProductJsonLd } from "../utils/jsonLd";

function retrieveDescription(doc: Document): string | null {
    return getProductJsonLd(doc)?.description || null;
}

export default retrieveDescription;