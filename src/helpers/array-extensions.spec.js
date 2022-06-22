import { range } from './array-extensions';

describe('range', () => {
  it('should create an array of values for a positive range', () => {
    expect(range(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(range(2, 3)).toEqual([2, 3]);
    expect(range(3, 3)).toEqual([3]);
  });

  it('should create an empty array for invalid range', () => {
    expect(range(0, -10)).toEqual([]);
    expect(range(4, 3)).toEqual([]);
  });
});
