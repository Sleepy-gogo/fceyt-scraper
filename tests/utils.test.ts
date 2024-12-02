import { describe, expect, it } from 'vitest';
import { parseIntoNumber, parseIntoArray } from '../src/utils.ts';

describe('Utils', () => {
  it('parseIntoNumber debe convertir strings a números o null', () => {
    expect(parseIntoNumber('4')).toBe(4);
    expect(parseIntoNumber('-')).toBeNull();
    expect(parseIntoNumber('')).toBeNull();
    expect(parseIntoNumber('*')).toBeNull();
    expect(parseIntoNumber('abc')).toBeNull();
  });

  it('parseIntoArray debe convertir strings a arrays de números o null', () => {
    expect(parseIntoArray('1-2-3')).toEqual([1, 2, 3]);
    expect(parseIntoArray('-')).toBeNull();
    expect(parseIntoArray('')).toBeNull();
    expect(parseIntoArray('--')).toBeNull();
    expect(parseIntoArray('(**)')).toBeNull();
  });
});
