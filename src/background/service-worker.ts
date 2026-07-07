chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
if (message.type === "GET_LISTING_TITLE") {

    chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        if (tabs[0]?.id) {
            return chrome.tabs.sendMessage(tabs[0].id, message).then(response => {
                sendResponse(response);
            });
        } else {
            sendResponse({data: "Pas de réponse"});
        }
    }).catch(() => {
        sendResponse({data: "Erreur d'injection du content script"});
    });
  }

  return true;
});