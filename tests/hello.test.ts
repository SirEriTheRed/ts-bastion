import { describe, expect, it } from 'vitest';

import { logHello } from '../src/index.js';

describe('hello utility', () => {
  it('returns hello world', () => {
    expect.hasAssertions();

    expect(logHello()).toBe('hello world!');
  });
});
