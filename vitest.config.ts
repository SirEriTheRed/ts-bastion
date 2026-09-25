// SPDX-FileCopyrightText: 2026 ts-bastion contributors
// SPDX-FileContributor: EriTheRed aka Azelann Borde <azelann.borde@gmail.com>
//
// SPDX-License-Identifier: MIT

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reportsDirectory: 'reports/coverage',
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
