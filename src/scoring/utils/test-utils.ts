import type ListingData from "../../content/listingData";

function mockListingData(overrides: Partial<ListingData>): ListingData {
  return {
    title: "Mock Title",
    photoCount: 3,
    hasVideo: false,
    description: "Mock Description",
    price: "10.00",
    hasShippingInfo: true,
    ...overrides,
  } as ListingData;
}

export { mockListingData };