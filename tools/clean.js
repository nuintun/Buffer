/**
 * @module clean
 */

import rimraf from 'rimraf';

rimraf.sync(['cjs', 'esm', 'typings', 'tests/index.js', 'examples/index.js']);
