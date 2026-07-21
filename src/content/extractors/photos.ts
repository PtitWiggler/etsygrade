import { getProductJsonLd, getVideoJsonLd } from "../utils/jsonLd";

interface PhotoData {
  photoCount: number;
  hasVideo: boolean;
}

function retrievePhotoData(doc: Document): PhotoData {
    const photoCount = getProductJsonLd(doc)?.image?.length ?? 0;
    const hasVideo = !!getVideoJsonLd(doc);

    return {
        photoCount,
        hasVideo,
    };
}

export default retrievePhotoData;
export type { PhotoData };