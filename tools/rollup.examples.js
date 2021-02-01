/**
 * @module rollup.examples
 */

import clean from './clean';
import pkg from '../package.json';
import treeShake from './plugins/tree-shake';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const banner = `/**
 * @module Buffer
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @author ${pkg.author.name}
 * @description ${pkg.description}
 * @see ${pkg.homepage}
 */
`;

clean('examples/index.js');

export default {
  input: 'examples/index.ts',
  output: {
    banner,
    format: 'umd',
    name: 'Buffer',
    interop: false,
    esModule: false,
    amd: { id: 'buffer' },
    file: 'examples/index.js'
  },
  onwarn(error, warn) {
    if (error.code !== 'CIRCULAR_DEPENDENCY') {
      warn(error);
    }
  },
  plugins: [resolve(), typescript(), treeShake()]
};
