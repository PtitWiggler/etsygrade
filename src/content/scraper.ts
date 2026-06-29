chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_LISTING_TITLE") {

    const h1 = document.querySelector("h1");

    if (h1) {
      const titre = h1.textContent ?? "";
      sendResponse({ data: titre });
    } else {
      sendResponse({ data: "Pas de titre" });
    }
  }

  return true;
});