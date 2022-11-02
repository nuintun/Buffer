/**
 * @module rollup.examples
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
  onwarn(error, warn) {
    if (error.code !== 'CIRCULAR_DEPENDENCY') {
      warn(error);
    }
  },
  plugins: [resolve(), typescript({ tsconfig: 'examples/tsconfig.json' }), treeShake()]
};
