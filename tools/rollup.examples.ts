/**
 * @module rollup.examples
 */

import type { RollupOptions } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import pkg from '../package.json' with { type: 'json' };

const banner = `/**
 * @module Buffer
 * @package ${pkg.name}
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @description ${pkg.description}
 * @see ${pkg.homepage}
 */
`;

export default {
  input: 'examples/index.ts',
  output: {
    banner,
    format: 'umd',
    name: 'Buffer',
    esModule: false,
    interop: 'auto',
    amd: { id: 'buffer' },
    file: 'examples/index.js',
    generatedCode: { constBindings: true }
  },
  plugins: [
    resolve(),
    typescript({
      rootDir: 'examples'
    })
  ],
  onwarn(error, warn) {
    if (error.code !== 'CIRCULAR_DEPENDENCY') {
      warn(error);
    }
  }
} as RollupOptions;
