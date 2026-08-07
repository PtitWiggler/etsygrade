import { describe, it, expect } from 'vitest';
import type ListingData from '../content/listingData';
import calculateScore from './scorer';
import type { ScoreResult } from './types';

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

describe('calculateScore', () => {
    it('retourne le score total et les recommandations quand tous les champs sont présents', () => {
        const data = mockListingData({ price: "10.00", hasShippingInfo: true });
        const result: ScoreResult = calculateScore(data);
        expect(result.globalScore).toBe(20);
        expect(result.grade).toBe('F');
        expect(result.categories).toHaveLength(4);
    });

    it('retourne le score total et les recommandations quand tous les champs sont vides', () => {
        const data = mockListingData({ price: null, hasShippingInfo: false });
        const result: ScoreResult = calculateScore(data);
        expect(result.globalScore).toBe(0);
        expect(result.grade).toBe('F');
        expect(result.categories).toHaveLength(4);
    });
});