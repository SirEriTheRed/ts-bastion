// SPDX-FileCopyrightText: 2026 ts-bastion contributors
// SPDX-FileContributor: EriTheRed aka Azelann Borde <azelann.borde@gmail.com>
//
// SPDX-License-Identifier: MIT

import { describe, expect, it } from 'vitest';

import { logHello } from '../src/index.js';

describe('hello utility', () => {
  it('returns hello world', () => {
    expect.hasAssertions();

    expect(logHello()).toBe('hello world!');
  });
});
