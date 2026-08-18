import { describe, it, expect } from 'vitest';
import { mockListingData } from '../utils/test-utils';
import { calculateDescLengthScore, calculateDescStructureScore, calculateTitleCoherenceScore } from './description';

describe('calculateDescLengthScore', () => {
  it('retourne le score max quand il y plus de 500 caractères', () => {
    const data = mockListingData({ description: 'a'.repeat(501) });
    const result = calculateDescLengthScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).toBeNull();
  });

  it('retourne le score max quand il y a 500 caractères', () => {
    const data = mockListingData({ description: 'a'.repeat(500) });
    const result = calculateDescLengthScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).toBeNull();
  });

  it('retourne le score intermédiaire quand il y a 499 caractères', () => {
    const data = mockListingData({ description: 'a'.repeat(499) });
    const result = calculateDescLengthScore(data);
    const expectedScore = Math.round(result.maxScore * 0.5);
    expect(result.score).toBe(expectedScore);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).not.toBeNull();
  });

  it('retourne un score intermédiaire quand il y a 150 caractères', () => {
    const data = mockListingData({ description: 'a'.repeat(150) });
    const result = calculateDescLengthScore(data);
    const expectedScore = Math.round(result.maxScore * 0.5);
    expect(result.score).toBe(expectedScore);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).not.toBeNull();
  });

  it('retourne un score nul quand il y a 149 caractères', () => {
    const data = mockListingData({ description: 'a'.repeat(149) });
    const result = calculateDescLengthScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('critical');
    expect(result.recommendation).not.toBeNull();
  });

  it('retourne un score nul quand la description est null', () => {
    const data = mockListingData({ description: null });
    const result = calculateDescLengthScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('critical');
    expect(result.recommendation).not.toBeNull();
  });
});

describe('calculateDescStructureScore', () => {
    it('retourne un score max quand la description contient des paragraphes', () => {
        const data = mockListingData({ description: 'Ceci est un paragraphe.\n\nCeci est un autre paragraphe.' });
        const result = calculateDescStructureScore(data);
        expect(result.score).toBe(result.maxScore);
        expect(result.severity).toBe('warning');
        expect(result.recommendation).toBeNull();
    });

    it('retourne un score nul quand la description est en un seul bloc', () => {
        const data = mockListingData({ description: 'Ceci est un seul bloc de texte sans paragraphes.' });
        const result = calculateDescStructureScore(data);
        expect(result.score).toBe(0);
        expect(result.severity).toBe('warning');
        expect(result.recommendation).not.toBeNull();
    });

    it('retourne un score nul quand la description est null', () => {
        const data = mockListingData({ description: null });
        const result = calculateDescStructureScore(data);
        expect(result.score).toBe(0);
        expect(result.severity).toBe('critical');
        expect(result.recommendation).not.toBeNull();
    });
});

describe('calculateTitleCoherenceScore', () => {
    it('retourne un score max quand tous les mots du titre sont présents dans la description', () => {
        const data = mockListingData({ title: 'Chaussures de course', description: 'Ces chaussures de course sont parfaites pour le jogging.' });
        const result = calculateTitleCoherenceScore(data);
        expect(result.score).toBe(result.maxScore);
        expect(result.severity).toBe('tip');
        expect(result.recommendation).toBeNull();
    });

    it('retourne un score nul quand un mot du titre est absent de la description', () => {
        const data = mockListingData({ title: 'Chaussures de course', description: 'Ces chaussures sont parfaites pour le jogging.' });
        const result = calculateTitleCoherenceScore(data);
        expect(result.score).toBe(0);
        expect(result.severity).toBe('tip');
        expect(result.recommendation).not.toBeNull();
    });

    it('retourne un score nul quand le titre est null', () => {
        const data = mockListingData({ title: null, description: 'Ces chaussures sont parfaites pour le jogging.' });
        const result = calculateTitleCoherenceScore(data);
        expect(result.score).toBe(0);
        expect(result.severity).toBe('critical');
        expect(result.recommendation).not.toBeNull();
    });

    it('retourne un score nul quand la description est null', () => {
        const data = mockListingData({ title: 'Chaussures de course', description: null });
        const result = calculateTitleCoherenceScore(data);
        expect(result.score).toBe(0);
        expect(result.severity).toBe('critical');
        expect(result.recommendation).not.toBeNull();
    });
});