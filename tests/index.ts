/**
 * @module tests
 */

import hex from './hex';
import Buffer from '../src';

const buffer: Buffer = new Buffer();

buffer.write(`A buffer tool using WebAssembly.`);

process.stdout.write(hex(buffer.bytes));
