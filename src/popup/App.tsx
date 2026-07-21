import { useState, useEffect } from "react";
import type ListingData from "../content/listingData";

function App() {
  const [listingData, setListingData] = useState<ListingData | null>(null);

  useEffect(() => {

    chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const url = tabs[0]?.url ?? "";
      const isListingPage = /etsy\.com\/(\w{2}\/)?listing\//.test(url);

      if (isListingPage) {
        chrome.runtime.sendMessage({ type: "SCRAPE_LISTING" })
        .then(response => {
          if (response && response.data) {
            setListingData(response.data);
          }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données du listing :", error);
        });
      }
    });
  }, []);

  return (
    <>
      <section id="center">
        {listingData ? (
          <div className="title">
            <pre>{JSON.stringify(listingData, null, 2)}</pre>
          </div>
        ) : (
          <div className="title">
            <h1>EtsyGrade</h1>
            <p>Allez sur une page de listing Etsy</p>
          </div>
        )}
      </section>
    </>
  )
}

export default App
