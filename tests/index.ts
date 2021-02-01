/**
 * @module tests
 */

import hex from './hex';
import Buffer from '../src';

/**
 * @function byteLength
 * @description 获取字符串指定编码字节长度
 * @param {string} input
 * @param {string} [encoding]
 * @returns {number}
 */
function byteLength(input: string, encoding?: string): number {
  const buffer: Buffer = new Buffer();

  buffer.write(input, encoding);

  return buffer.length;
}

const buffer: Buffer = new Buffer();
const desc: string = `A buffer tool for javascript.`;

buffer.writeInt8(0xaf);
buffer.writeUint8(0xfa);
buffer.writeBoolean(true);
buffer.writeInt16(0xfafc);
buffer.writeUint16(0xfcfa);
buffer.writeInt32(0xfafbfcfd);
buffer.writeUint32(0xfdfbfafc);
// @ts-ignore
buffer.writeInt64(0xf0f1fafbfcfdfeffn);
// @ts-ignore
buffer.writeUint64(0xfffefdfcfbfaf1f0n);
buffer.writeFloat32(123456.654321);
buffer.writeFloat64(987654321.123456789);
buffer.write(desc);

buffer.offset = 0;

console.log(0xaf, '->', buffer.readInt8());
console.log(0xfa, '->', buffer.readUint8());
console.log(true, '->', buffer.readBoolean());
console.log(0xfafc, '->', buffer.readInt16());
console.log(0xfcfa, '->', buffer.readUint16());
console.log(0xfafbfcfd, '->', buffer.readInt32());
console.log(0xfdfbfafc, '->', buffer.readUint32());
// @ts-ignore
console.log(0xf0f1fafbfcfdfeffn, '->', buffer.readInt64());
// @ts-ignore
console.log(0xfffefdfcfbfaf1f0n, '->', buffer.readUint64());
console.log(123456.654321, '->', buffer.readFloat32());
console.log(987654321.123456789, '->', buffer.readFloat64());
console.log(desc, '->', buffer.read(byteLength(desc)));

process.stdout.write(`\r\n${hex(buffer.bytes)}`);
