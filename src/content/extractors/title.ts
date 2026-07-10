function retrieveTitle(doc: Document): string | null {
    const h1 = doc.querySelector("h1");
    return h1 ? h1.textContent?.trim() || null : null;
}

export default retrieveTitle;