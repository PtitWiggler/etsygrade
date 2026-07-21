import retrieveCompleteness from "./extractors/completeness";
import retrieveDescription from "./extractors/description";
import retrievePhotoData from "./extractors/photos";
import retrieveTitle from "./extractors/title";
import type ListingData from "./listingData";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SCRAPE_LISTING") {

    const title = retrieveTitle(document);
    const completeness = retrieveCompleteness(document);
    const description = retrieveDescription(document);
    const photoData = retrievePhotoData(document);
    
    const result: ListingData = {
      title: title,
      photoCount: photoData.photoCount,
      hasVideo: photoData.hasVideo,
      description: description,
      price: completeness.price,
      hasShippingInfo: completeness.hasShippingInfo,
    }

    sendResponse({ data: result });
    return true;
  }
});