import { describe, it, expect } from 'vitest';
import { mockListingData } from '../utils/test-utils';
import { calculateDuplicateWordScore, calculateFrontLoadingScore, calculateLengthScore, calculateSeparatorScore } from './title';
import { NON_DESCRIPTIVE_WORDS } from './title-constants';

describe('calculateLengthScore', () => {
  it('retourne le score max quand il y plus de 140 caractères', () => {
    const data = mockListingData({ title: 'a'.repeat(141) });
    const result = calculateLengthScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).toBeNull();
  });

  it('retourne le score max quand il y a 140 caractères', () => {
    const data = mockListingData({ title: 'a'.repeat(140) });
    const result = calculateLengthScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).toBeNull();
  });

  it('retourne le score max quand il y a 80 caractères', () => {
    const data = mockListingData({ title: 'a'.repeat(80) });
    const result = calculateLengthScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).toBeNull();
  });

  it('retourne un score intermédiaire quand il y a 79 caractères', () => {
    const data = mockListingData({ title: 'a'.repeat(79) });
    const result = calculateLengthScore(data);
    const expectedScore = Math.round(result.maxScore * 0.5);
    expect(result.score).toBe(expectedScore);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).not.toBeNull();
  });

  it('retourne un score intermédiaire quand il y a 40 caractères', () => {
    const data = mockListingData({ title: 'a'.repeat(40) });
    const result = calculateLengthScore(data);
    const expectedScore = Math.round(result.maxScore * 0.5);
    expect(result.score).toBe(expectedScore);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).not.toBeNull();
  });

  it('retourne un score nul quand il y a 39 caractères', () => {
    const data = mockListingData({ title: 'a'.repeat(39) });
    const result = calculateLengthScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('critical');
    expect(result.recommendation).not.toBeNull();
  });

  it('retourne un score nul quand le titre est null', () => {
    const data = mockListingData({ title: null });
    const result = calculateLengthScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('critical');
    expect(result.recommendation).not.toBeNull();
  });
});

describe('calculateSeparatorScore', () => {
  it("retourne le score max quand le caractère | est présent", () => {
    const data = mockListingData({ title: 'a | b' });
    const result = calculateSeparatorScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).toBeNull();
  });

  it("retourne le score max quand le caractère , est présent", () => {
    const data = mockListingData({ title: 'a , b' });
    const result = calculateSeparatorScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).toBeNull();
  });

  it("retourne le score max quand le caractère - est présent", () => {
    const data = mockListingData({ title: 'a - b' });
    const result = calculateSeparatorScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).toBeNull();
  });

  it("retourne un score nul quand aucun séparateur n'est présent", () => {
    const data = mockListingData({ title: 'a b' });
    const result = calculateSeparatorScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('tip');
    expect(result.recommendation).not.toBeNull();
  });

  it("retourne un score nul quand le titre est null", () => {
    const data = mockListingData({ title: null });
    const result = calculateSeparatorScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('critical');
    expect(result.recommendation).not.toBeNull();
  });
});

describe('calculateFrontLoadingScore', () => {
  it("retourne un score à 0 quand le premier mot fait partie de la liste NON_DESCRIPTIVE_WORDS", () => {
    const data = mockListingData({ title: NON_DESCRIPTIVE_WORDS[0] });
    const result = calculateFrontLoadingScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).not.toBeNull();
  });

  it("retourne le score max quand le premier mot ne fait pas partie de la liste NON_DESCRIPTIVE_WORDS", () => {
    const data = mockListingData({ title: 'Produit exceptionnel ' + NON_DESCRIPTIVE_WORDS[0] });
    const result = calculateFrontLoadingScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).toBeNull();
  });

  it("retourne un score à 0 quand le premier mot fait partie de la liste NON_DESCRIPTIVE_WORDS avec virgule", () => {
    const data = mockListingData({ title: NON_DESCRIPTIVE_WORDS[0] + ',' });
    const result = calculateFrontLoadingScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).not.toBeNull();
  });

  it("retourne un score à 0 quand le premier mot fait partie de la liste NON_DESCRIPTIVE_WORDS avec casse différente", () => {
    const data = mockListingData({ title: NON_DESCRIPTIVE_WORDS[0].toUpperCase() });
    const result = calculateFrontLoadingScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).not.toBeNull();
  });

  it("retourne un score nul quand le titre est null", () => {
    const data = mockListingData({ title: null });
    const result = calculateFrontLoadingScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('critical');
    expect(result.recommendation).not.toBeNull();
  });
});

describe('calculateDuplicateWordScore', () => {
  it("retourne le score max quand aucun mot n'est dupliqué", () => {
    const data = mockListingData({ title: "Titre unique" });
    const result = calculateDuplicateWordScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).toBeNull();
  });

  it("retourne un score à 0 quand un mot est dupliqué hors STOP_WORDS", () => {
    const data = mockListingData({ title: "Ceramic Mug Ceramic Bowl" });
    const result = calculateDuplicateWordScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).toBe("Le mot 'ceramic' apparaît 2 fois. Chaque mot devrait apporter une info nouvelle.");
  });

  it("retourne un score max quand aucun mot n'est dupliqué hors STOP_WORDS", () => {
    const data = mockListingData({ title: "Mug for the Coffee for the Morning" });
    const result = calculateDuplicateWordScore(data);
    expect(result.score).toBe(result.maxScore);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).toBeNull();
  });

  it("retourne un score à 0 quand plusieurs mots sont dupliqués hors STOP_WORDS", () => {
    const data = mockListingData({ title: "Mug Mug Coffee Coffee Coffee" });
    const result = calculateDuplicateWordScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('warning');
    expect(result.recommendation).toBe("Le mot 'coffee' apparaît 3 fois. Chaque mot devrait apporter une info nouvelle.");
  });

  it("retourne un score nul quand le titre est null", () => {
    const data = mockListingData({ title: null });
    const result = calculateDuplicateWordScore(data);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('critical');
    expect(result.recommendation).not.toBeNull();
  });

});