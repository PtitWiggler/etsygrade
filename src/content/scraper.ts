import retrieveTitle from "./extractors/title";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SCRAPE_LISTING") {

    // TODO : refacto avec listingData.ts pour récupérer toutes les données d'un listing en une seule fois

    const titre = retrieveTitle(document);
    
    if (titre) {
      sendResponse({ data: titre });
    } else {
      sendResponse({ data: null });
    }
  }

  return true;
});