import { describe, it, expect } from 'vitest';
import { calculatePhotoCountScore, calculateVideoScore } from './photos';
import { mockListingData } from '../utils/test-utils';

describe('calculatePhotoCountScore', () => {
  it('retourne le score max quand il y a 7 photos', () => {
    const data = mockListingData({ photoCount: 7 });
    const result = calculatePhotoCountScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).toBeNull();
  });

  it('retourne un score intermédiaire quand il y a 6 photos', () => {
    const data = mockListingData({ photoCount: 6 });
    const result = calculatePhotoCountScore(data);
    const expectedScore = Math.round(result.maxScore * 0.7);
    expect(result.score).toBe(expectedScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).not.toBeNull();
  });

  it('retourne un score intermédiaire quand il y a 5 photos', () => {
    const data = mockListingData({ photoCount: 5 });
    const result = calculatePhotoCountScore(data);
    const expectedScore = Math.round(result.maxScore * 0.7);
    expect(result.score).toBe(expectedScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).not.toBeNull();
  });

  it('retourne un score intermédiaire quand il y a 4 photos', () => {
    const data = mockListingData({ photoCount: 4 });
    const result = calculatePhotoCountScore(data);
    const expectedScore = Math.round(result.maxScore * 0.4);
    expect(result.score).toBe(expectedScore);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).not.toBeNull();
  });

  it('retourne un score intermédiaire quand il y a 3 photos', () => {
    const data = mockListingData({ photoCount: 3 });
    const result = calculatePhotoCountScore(data);
    const expectedScore = Math.round(result.maxScore * 0.4);
    expect(result.score).toBe(expectedScore);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).not.toBeNull();
  });

  it('retourne un score intermédiaire quand il y a 2 photos', () => {
    const data = mockListingData({ photoCount: 2 });
    const result = calculatePhotoCountScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('critical');
    expect(result.recommendation).not.toBeNull();
  });
});

describe('calculateVideoScore', () => {
  it("retourne le score max quand une vidéo est présente", () => {
    const data = mockListingData({ hasVideo: true });
    const result = calculateVideoScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).toBeNull();
  });

  it("retourne 0 quand il n'y a pas de vidéo", () => {
      const data = mockListingData({ hasVideo: false });
      const result = calculateVideoScore(data);
      expect(result.score).toBe(0);
      expect(result.severity).toBe('tip');
      expect(result.recommendation).not.toBeNull();
  });
});