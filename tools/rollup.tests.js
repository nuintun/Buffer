/**
 * @module rollup.tests
 */

import { createRequire } from 'module';
import treeShake from './plugins/tree-shake.js';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const pkg = createRequire(import.meta.url)('../package.json');

const banner = `/**
  * @package ${pkg.name}
  * @license ${pkg.license}
  * @version ${pkg.version}
  * @author ${pkg.author.name} <${pkg.author.email}>
  * @description ${pkg.description}
  * @see ${pkg.homepage}
  */
 `;

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'tests/index.ts',
  output: {
    banner,
    esModule: false,
    exports: 'auto',
    interop: 'auto',
    file: 'tests/index.js',
    generatedCode: { constBindings: true }
  },
  onwarn(error, warn) {
    if (error.code !== 'CIRCULAR_DEPENDENCY') {
      warn(error);
    }
  },
  plugins: [resolve(), typescript({ tsconfig: 'tests/tsconfig.json' }), treeShake()]
};
