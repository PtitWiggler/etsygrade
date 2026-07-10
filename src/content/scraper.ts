import retrieveCompleteness from "./extractors/completeness";
import retrieveTitle from "./extractors/title";
import type ListingData from "./listingData";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SCRAPE_LISTING") {

    const titre = retrieveTitle(document);
    const completeness = retrieveCompleteness(document);

    const result: ListingData = {
      title: titre,
      photoCount: 0, // TODO : implement photo count extraction
      hasVideo: false, // TODO : implement video detection
      description: null, // TODO : implement description extraction
      price: completeness?.price,
      hasShippingInfo: completeness?.hasShippingInfo,
      shopSection: completeness?.shopSection,
    }

    sendResponse({ data: result });
    return true;
  }
});