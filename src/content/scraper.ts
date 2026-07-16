import retrieveCompleteness from "./extractors/completeness";
import retrieveDescription from "./extractors/description";
import retrieveTitle from "./extractors/title";
import type ListingData from "./listingData";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SCRAPE_LISTING") {

    const title = retrieveTitle(document);
    const completeness = retrieveCompleteness(document);
    const description = retrieveDescription(document);

    const result: ListingData = {
      title: title,
      photoCount: 0, // TODO : implement photo count extraction
      hasVideo: false, // TODO : implement video detection
      description: description,
      price: completeness.price,
      hasShippingInfo: completeness.hasShippingInfo,
    }

    sendResponse({ data: result });
    return true;
  }
});