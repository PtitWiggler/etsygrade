import { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {

    chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      const url = tabs[0]?.url ?? "";
      const isListingPage = /etsy\.com\/(\w{2}\/)?listing\//.test(url);

      if (isListingPage) {
        chrome.runtime.sendMessage({ type: "GET_LISTING_TITLE" })
        .then(response => {
          if (response && response.data) {
            setTitle(response.data);
          }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération du titre :", error);
        });
      }
    });
  }, []);

  return (
    <>
      <section id="center">
        {title ? (
          <div className="title">
            <h1>{title}</h1>
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
