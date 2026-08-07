import { describe, it, expect } from 'vitest';
import { calculatePriceScore, calculateShippingScore } from './completeness';
import { mockListingData } from '../utils/test-utils';

describe('calculatePriceScore', () => {
  it('retourne le score max quand le prix est présent', () => {
    const data = mockListingData({ price: '25.00' });
    const result = calculatePriceScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.recommendation).toBeNull();
  });

  it('retourne 0 quand le prix est absent', () => {
    const data = mockListingData({ price: null });
    const result = calculatePriceScore(data);
    expect(result.score).toBe(0);
    expect(result.recommendation).not.toBeNull();
  });
});

describe('calculateShippingScore', () => {
  it('retourne le score max quand les informations de livraison sont présentes', () => {
    const data = mockListingData({ hasShippingInfo: true });
    const result = calculateShippingScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.recommendation).toBeNull();
  });

  it('retourne 0 quand les informations de livraison sont absentes', () => {
    const data = mockListingData({ hasShippingInfo: false });
    const result = calculateShippingScore(data);
    expect(result.score).toBe(0);
    expect(result.recommendation).not.toBeNull();
  });
});