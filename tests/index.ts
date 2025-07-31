/**
 * @module tests
 */

import * as number from './number';
import { hexdump } from './hexdump';
import { Buffer, Endian, endianness } from '@nuintun/buffer';

const buffer = new Buffer();
const desc = `A buffer tool for javascript.`;
const descBytes = new TextEncoder().encode(desc);

buffer.writeInt8(0xaf);
buffer.writeUint8(0xfa);
buffer.writeBoolean(true);
buffer.writeInt16(0xfafc);
buffer.writeUint16(0xfcfa);
buffer.writeInt32(0xfafbfcfd);
buffer.writeUint32(0xfdfbfafc);
buffer.writeInt64(0xf0f1fafbfcfdfeffn);
buffer.writeUint64(0xfffefdfcfbfaf1f0n);
buffer.writeFloat32(123456.654321);
buffer.writeFloat64(987654321.123456789);
buffer.write(descBytes);

buffer.offset = 0;

console.log(number.toInt8(0xaf), '->', buffer.readInt8());
console.log(number.toUint8(0xfa), '->', buffer.readUint8());
console.log(true, '->', buffer.readBoolean());
console.log(number.toInt16(0xfafc), '->', buffer.readInt16());
console.log(number.toUint16(0xfcfa), '->', buffer.readUint16());
console.log(number.toInt32(0xfafbfcfd), '->', buffer.readInt32());
console.log(number.toUint32(0xfdfbfafc), '->', buffer.readUint32());
console.log(number.toInt64(0xf0f1fafbfcfdfeffn), '->', buffer.readInt64());
console.log(number.toUint64(0xfffefdfcfbfaf1f0n), '->', buffer.readUint64());
console.log(number.toFloat32(123456.654321), '->', buffer.readFloat32());
console.log(number.toFloat64(987654321.123456789), '->', buffer.readFloat64());
console.log(desc, '->', buffer.read(descBytes.length, 'utf-8'));
console.log(`\r\n${hexdump(buffer.bytes)}\r\n`);
console.log('endianness', '->', Endian[endianness()]);
