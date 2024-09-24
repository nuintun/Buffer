/**
 * @package @nuintun/buffer
 * @license MIT
 * @version 0.0.1
 * @author nuintun <nuintun@qq.com>
 * @description A buffer tool for javascript.
 * @see https://github.com/nuintun/Buffer#readme
 */

/**
 * @module hex
 */
/**
 * @type {string[]}
 * @description 已获得的 hex 映射表
 */
const mapping$1 = [];
// 字母映射表
const alphabet = '0123456789ABCDEF';
// 生成映射表
for (let i = 0; i < 16; ++i) {
  const i16 = i * 16;
  for (let j = 0; j < 16; ++j) {
    mapping$1[i16 + j] = alphabet[i] + alphabet[j];
  }
}
/**
 * @function zero
 * @description 数字左边补零操作
 * @param {number} value
 * @param {number} max
 * @returns {string}
 */
function zero(value, max) {
  return (value > 0xff ? value.toString(16) : mapping$1[value]).padStart(max, '0');
}
/**
 * @function hex
 * @function Hex 查看器
 * @param {Uint8Array} buffer
 * @returns {string}
 */
function hex(buffer) {
  const { length } = buffer;
  const last = length % 16 || 16;
  const rows = Math.ceil(length / 16);
  const offsetLength = Math.max(6, length.toString(16).length);
  let rowBytes;
  let index = 0;
  let rowSpaces;
  let hex = `\u001b[36mOFFSET  `;
  for (let i = 0; i < 16; i++) {
    hex += ` ${zero(i, 2)}`;
  }
  hex += `\u001b[0m\n`;
  if (length) {
    hex += `\n`;
  }
  for (let i = 0; i < rows; i++) {
    hex += `\u001b[36m${zero(index, offsetLength)}\u001b[0m  `;
    rowBytes = i === rows - 1 ? last : 16;
    rowSpaces = 16 - rowBytes;
    for (let j = 0; j < rowBytes; j++) {
      hex += ` \u001b[33m${zero(buffer[index++], 2)}\u001b[0m`;
    }
    for (let j = 0; j <= rowSpaces; j++) {
      hex += `   `;
    }
    index -= rowBytes;
    for (let j = 0; j < rowBytes; j++) {
      const byte = buffer[index++];
      hex += (byte > 31 && byte < 127) || byte > 159 ? String.fromCharCode(byte) : `.`;
    }
    hex += `\n`;
  }
  return hex.trim();
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a getter');
  if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError('Cannot read private member from an object whose class did not declare it');
  return kind === 'm' ? f : kind === 'a' ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === 'm') throw new TypeError('Private method is not writable');
  if (kind === 'a' && !f) throw new TypeError('Private accessor was defined without a setter');
  if (typeof state === 'function' ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError('Cannot write private member to an object whose class did not declare it');
  return kind === 'a' ? f.call(receiver, value) : f ? (f.value = value) : state.set(receiver, value), value;
}

typeof SuppressedError === 'function'
  ? SuppressedError
  : function (error, suppressed, message) {
      var e = new Error(message);
      return (e.name = 'SuppressedError'), (e.error = error), (e.suppressed = suppressed), e;
    };

/**
 * @module utils
 */
/**
 * @function calcBufferLength
 * @description 计算适合的 Buffer 长度
 * @param {number} length 数据字节总大小
 * @param {number} pageSize 缓冲区页大小
 * @returns {number}
 */
function calcBufferLength(length, pageSize) {
  if (length > pageSize) {
    const pages = Math.ceil(length / pageSize);
    return pages * pageSize;
  } else {
    return length;
  }
}

/**
 * @module Binary
 */
/**
 * @type {string[]}
 * @description 已获得的二进制映射表
 */
const mapping = [];
// 生成映射表
for (let code = 0; code < 256; code++) {
  mapping[code] = String.fromCharCode(code);
}

/**
 * @module errors
 */
// 未支持的编码格式
function encodingInvalid(encoding) {
  return 'Unsupported encoding ' + encoding;
}
// 未知字节序
const unknownEndianness = 'Unknown endianness';
// 非法长度
const lengthInvalid = 'Invalid buffer length';
// 非法读写指针
const offsetInvalid = 'Invalid buffer offset';
// 数据读取溢出
const readOverflow = 'Read is outside the bounds of the Buffer';
// 读写指针溢出
const offsetOverflow = 'Offset is outside the bounds of the Buffer';

/**
 * @module UTF8
 */
// 编码器实例
const encoder = new TextEncoder();
// 解码器实例
const decoder = new TextDecoder();
/**
 * @function encode
 * @param {string} input
 * @returns {Uint8Array}
 */
const encode$2 = encoder.encode.bind(encoder);
/**
 * @function decode
 * @param {BufferSource} input
 * @returns {string}
 */
const decode$2 = decoder.decode.bind(decoder);

/**
 * @module Unicode
 */
/**
 * @function encode
 * @param {string} input
 * @param {TypeArray} Buffer
 * @returns {Uint8Array}
 */
function encode$1(input, TypeArray) {
  const { length } = input;
  const array = new TypeArray(length);
  for (let i = 0; i < length; i++) {
    array[i] = input.codePointAt(i) || 0;
  }
  return new Uint8Array(array.buffer);
}
/**
 * @function decode
 * @param {BufferSource} input
 * @param {TypeArray} Buffer
 * @returns {string}
 */
function decode$1(input, TypeArray) {
  let result = '';
  const array = new TypeArray(ArrayBuffer.isView(input) ? input.buffer : input);
  for (const code of array) {
    result += String.fromCodePoint(code);
  }
  return result;
}

/**
 * @module Encoding
 */
/**
 * @function encode
 * @description 用指定编码编码字符串
 * @param {string} input 需要编码的字符串
 * @param {string} [encoding] 字符串编码
 * @returns {Uint8Array}
 */
function encode(input, encoding = 'UTF8') {
  switch (encoding.toUpperCase()) {
    case 'UTF8':
    case 'UTF-8':
      return encode$2(input);
    case 'UTF16':
    case 'UTF-16':
      return encode$1(input, Uint16Array);
    case 'UTF32':
    case 'UTF-32':
      return encode$1(input, Uint32Array);
    default:
      throw new TypeError(encodingInvalid(encoding));
  }
}
/**
 * @function decode
 * @description 用指定编码解码字符串数据
 * @param {BufferSource} input 需要解码的字符串数据
 * @param {string} [encoding] 字符串编码
 * @returns {string}
 */
function decode(input, encoding = 'UTF8') {
  switch (encoding.toUpperCase()) {
    case 'UTF8':
    case 'UTF-8':
      return decode$2(input);
    case 'UTF16':
    case 'UTF-16':
      return decode$1(input, Uint16Array);
    case 'UTF32':
    case 'UTF-32':
      return decode$1(input, Uint32Array);
    default:
      throw new TypeError(encodingInvalid(encoding));
  }
}

/**
 * @module Buffer
 */
var _Buffer_instances,
  _Buffer_pageSize,
  _Buffer_bytes,
  _Buffer_dataView,
  _Buffer_offset,
  _Buffer_length,
  _Buffer_grow,
  _Buffer_seek,
  _Buffer_assertRead,
  _Buffer_alloc;
// 字节序类型
var Endian;
(function (Endian) {
  Endian[(Endian['Big'] = 0)] = 'Big';
  Endian[(Endian['Little'] = 1)] = 'Little';
})(Endian || (Endian = {}));
/**
 * @function endianness
 * @description 获取系统默认字节序
 * @returns {Endian}
 */
function endianness() {
  switch (new Uint8Array(new Uint32Array([0x12345678]))[0]) {
    case 0x12:
      return Endian.Big;
    case 0x78:
      return Endian.Little;
    default:
      throw new TypeError(unknownEndianness);
  }
}
/**
 * @class Buffer
 * @classdesc Buffer 类提供用于优化读取，写入以及处理二进制数据的方法和属性
 */
class Buffer {
  constructor(input = 0, pageSize = 4096) {
    _Buffer_instances.add(this);
    // 缓冲区页大小
    // 容量不足时按页大小增长
    _Buffer_pageSize.set(this, void 0);
    // 缓冲区数据
    _Buffer_bytes.set(this, void 0);
    // 缓冲区视图
    _Buffer_dataView.set(this, void 0);
    // 读写指针位置
    _Buffer_offset.set(this, 0);
    // 已使用字节长度
    _Buffer_length.set(this, 0);
    __classPrivateFieldSet(this, _Buffer_pageSize, pageSize, 'f');
    if (input instanceof Uint8Array) {
      __classPrivateFieldSet(this, _Buffer_bytes, input, 'f');
      __classPrivateFieldSet(this, _Buffer_length, input.length, 'f');
      __classPrivateFieldSet(this, _Buffer_dataView, new DataView(input.buffer), 'f');
    } else {
      const bytes = new Uint8Array(calcBufferLength(input, pageSize));
      __classPrivateFieldSet(this, _Buffer_bytes, bytes, 'f');
      __classPrivateFieldSet(this, _Buffer_length, input, 'f');
      __classPrivateFieldSet(this, _Buffer_dataView, new DataView(bytes.buffer), 'f');
    }
  }
  /**
   * @public
   * @property {number} offset
   * @description 设置读写指针位置，以字节为单位
   * @description 下一次调用读写方法时将在此位置开始读写
   */
  set offset(offset) {
    if (offset < 0) {
      throw new RangeError(offsetInvalid);
    }
    if (offset > __classPrivateFieldGet(this, _Buffer_length, 'f')) {
      throw new RangeError(offsetOverflow);
    }
    __classPrivateFieldSet(this, _Buffer_offset, offset, 'f');
  }
  /**
   * @public
   * @property {number} offset
   * @description 获取读写指针的位置
   * @returns {number}
   */
  get offset() {
    return __classPrivateFieldGet(this, _Buffer_offset, 'f');
  }
  /**
   * @public
   * @property {number} length
   * @description 设置 Buffer 长度
   * @description 如果将长度设置为小于当前长度的值，将会截断该字节数组
   * @description 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧
   */
  set length(length) {
    if (length < 0) {
      throw new RangeError(lengthInvalid);
    }
    const currentLength = __classPrivateFieldGet(this, _Buffer_length, 'f');
    if (length > currentLength) {
      __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, length - currentLength);
    } else {
      __classPrivateFieldSet(this, _Buffer_length, length, 'f');
      // 重置多余字节
      __classPrivateFieldGet(this, _Buffer_bytes, 'f').fill(0, length);
    }
    if (__classPrivateFieldGet(this, _Buffer_offset, 'f') > length) {
      __classPrivateFieldSet(this, _Buffer_offset, length, 'f');
    }
  }
  /**
   * @public
   * @property {number} length
   * @description 获取 Buffer 长度
   * @returns {number}
   */
  get length() {
    return __classPrivateFieldGet(this, _Buffer_length, 'f');
  }
  /**
   * @public
   * @property {ArrayBuffer} buffer
   * @description 获取 ArrayBuffer 缓冲区
   * @returns {ArrayBuffer}
   */
  get buffer() {
    return __classPrivateFieldGet(this, _Buffer_bytes, 'f').buffer.slice(0, __classPrivateFieldGet(this, _Buffer_length, 'f'));
  }
  /**
   * @public
   * @property {Uint8Array} bytes
   * @description 获取 Uint8Array 缓冲区
   * @returns {Uint8Array}
   */
  get bytes() {
    return __classPrivateFieldGet(this, _Buffer_bytes, 'f').slice(0, __classPrivateFieldGet(this, _Buffer_length, 'f'));
  }
  /**
   * @public
   * @method writeInt8
   * @description 在缓冲区中写入一个有符号整数
   * @param {number} value 介于 -128 和 127 之间的整数
   */
  writeInt8(value) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, 1 /* SizeOf.INT8 */);
    __classPrivateFieldGet(this, _Buffer_dataView, 'f').setInt8(__classPrivateFieldGet(this, _Buffer_offset, 'f'), value);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, 1 /* SizeOf.INT8 */);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 1 /* SizeOf.INT8 */);
  }
  /**
   * @public
   * @method writeUint8
   * @description 在缓冲区中写入一个无符号整数
   * @param {number} value 介于 0 和 255 之间的整数
   */
  writeUint8(value) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, 1 /* SizeOf.UINT8 */);
    __classPrivateFieldGet(this, _Buffer_dataView, 'f').setUint8(__classPrivateFieldGet(this, _Buffer_offset, 'f'), value);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, 1 /* SizeOf.UINT8 */);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 1 /* SizeOf.UINT8 */);
  }
  /**
   * @method writeBoolean
   * @description 在缓冲区中写入布尔值，true 写 1，false写 0
   * @param {boolean} value 布尔值
   */
  writeBoolean(value) {
    this.writeUint8(value ? 1 : 0);
  }
  /**
   * @method writeInt16
   * @description 在缓冲区中写入一个 16 位有符号整数
   * @param {number} value 要写入的 16 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeInt16(value, littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, 2 /* SizeOf.INT16 */);
    __classPrivateFieldGet(this, _Buffer_dataView, 'f').setInt16(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      value,
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, 2 /* SizeOf.INT16 */);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 2 /* SizeOf.INT16 */);
  }
  /**
   * @method writeUint16
   * @description 在缓冲区中写入一个 16 位无符号整数
   * @param {number} value 要写入的 16 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeUint16(value, littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, 2 /* SizeOf.UINT16 */);
    __classPrivateFieldGet(this, _Buffer_dataView, 'f').setUint16(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      value,
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, 2 /* SizeOf.UINT16 */);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 2 /* SizeOf.UINT16 */);
  }
  /**
   * @method writeInt32
   * @description 在缓冲区中写入一个有符号的 32 位有符号整数
   * @param {number} value 要写入的 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeInt32(value, littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, 4 /* SizeOf.INT32 */);
    __classPrivateFieldGet(this, _Buffer_dataView, 'f').setInt32(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      value,
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, 4 /* SizeOf.INT32 */);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 4 /* SizeOf.INT32 */);
  }
  /**
   * @method writeUint32
   * @description 在缓冲区中写入一个无符号的 32 位无符号整数
   * @param {number} value 要写入的 32 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeUint32(value, littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, 4 /* SizeOf.UINT32 */);
    __classPrivateFieldGet(this, _Buffer_dataView, 'f').setUint32(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      value,
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, 4 /* SizeOf.UINT32 */);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 4 /* SizeOf.UINT32 */);
  }
  /**
   * @method writeInt64
   * @description 在缓冲区中写入一个无符号的 64 位有符号整数
   * @param {bigint} value 要写入的 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeInt64(value, littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, 8 /* SizeOf.INI64 */);
    __classPrivateFieldGet(this, _Buffer_dataView, 'f').setBigInt64(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      value,
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, 8 /* SizeOf.INI64 */);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 8 /* SizeOf.INI64 */);
  }
  /**
   * @method writeUint64
   * @description 在缓冲区中写入一个无符号的 64 位无符号整数
   * @param {bigint} value 要写入的 64 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeUint64(value, littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, 8 /* SizeOf.UINT64 */);
    __classPrivateFieldGet(this, _Buffer_dataView, 'f').setBigUint64(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      value,
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, 8 /* SizeOf.UINT64 */);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 8 /* SizeOf.UINT64 */);
  }
  /**
   * @method writeFloat32
   * @description 在缓冲区中写入一个 IEEE 754 单精度 32 位浮点数
   * @param {number} value 单精度 32 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeFloat32(value, littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, 4 /* SizeOf.FLOAT32 */);
    __classPrivateFieldGet(this, _Buffer_dataView, 'f').setFloat32(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      value,
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, 4 /* SizeOf.FLOAT32 */);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 4 /* SizeOf.FLOAT32 */);
  }
  /**
   * @method writeFloat64
   * @description 在缓冲区中写入一个 IEEE 754 双精度 64 位浮点数
   * @param {number} value 双精度 64 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeFloat64(value, littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, 8 /* SizeOf.FLOAT64 */);
    __classPrivateFieldGet(this, _Buffer_dataView, 'f').setFloat64(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      value,
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, 8 /* SizeOf.FLOAT64 */);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 8 /* SizeOf.FLOAT64 */);
  }
  write(input, start, end) {
    let bytes;
    if (input instanceof Uint8Array) {
      bytes = input.subarray(start, end);
    } else {
      bytes = encode(input, start);
    }
    const { length } = bytes;
    if (length > 0) {
      __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_alloc).call(this, length);
      __classPrivateFieldGet(this, _Buffer_bytes, 'f').set(bytes, __classPrivateFieldGet(this, _Buffer_offset, 'f'));
      __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_grow).call(this, length);
      __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, length);
    }
  }
  /**
   * @method readInt8
   * @description 从缓冲区中读取有符号的整数
   * @returns {number} 介于 -128 和 127 之间的整数
   */
  readInt8() {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, 1 /* SizeOf.INT8 */);
    const value = __classPrivateFieldGet(this, _Buffer_dataView, 'f').getInt8(
      __classPrivateFieldGet(this, _Buffer_offset, 'f')
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 1 /* SizeOf.INT8 */);
    return value;
  }
  /**
   * @method readUint8
   * @description 从缓冲区中读取无符号的整数
   * @returns {number} 介于 0 和 255 之间的无符号整数
   */
  readUint8() {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, 1 /* SizeOf.UINT8 */);
    const value = __classPrivateFieldGet(this, _Buffer_dataView, 'f').getUint8(
      __classPrivateFieldGet(this, _Buffer_offset, 'f')
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 1 /* SizeOf.UINT8 */);
    return value;
  }
  /**
   * @method readBoolean
   * @description 从缓冲区中读取布尔值
   * @returns {boolean} 如果字节非零，则返回 true，否则返回 false
   */
  readBoolean() {
    return Boolean(this.readUint8());
  }
  /**
   * @method readInt16
   * @description 从缓冲区中读取一个 16 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 -32768 和 32767 之间的 16 位有符号整数
   */
  readInt16(littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, 2 /* SizeOf.INT16 */);
    const value = __classPrivateFieldGet(this, _Buffer_dataView, 'f').getInt16(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 2 /* SizeOf.INT16 */);
    return value;
  }
  /**
   * @method readUint16
   * @description 从缓冲区中读取一个 16 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 0 和 65535 之间的 16 位无符号整数
   */
  readUint16(littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, 2 /* SizeOf.UINT16 */);
    const value = __classPrivateFieldGet(this, _Buffer_dataView, 'f').getUint16(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 2 /* SizeOf.UINT16 */);
    return value;
  }
  /**
   * @method readInt32
   * @description 从缓冲区中读取一个 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 -2147483648 和 2147483647 之间的 32 位有符号整数
   */
  readInt32(littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, 4 /* SizeOf.INT32 */);
    const value = __classPrivateFieldGet(this, _Buffer_dataView, 'f').getInt32(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 4 /* SizeOf.INT32 */);
    return value;
  }
  /**
   * @method readUint32
   * @description 从缓冲区中读取一个 32 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 0 和 4294967295 之间的 32 位无符号整数
   */
  readUint32(littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, 4 /* SizeOf.UINT32 */);
    const value = __classPrivateFieldGet(this, _Buffer_dataView, 'f').getUint32(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 4 /* SizeOf.UINT32 */);
    return value;
  }
  /**
   * @method readInt64
   * @description 从缓冲区中读取一个 64 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {bigint} 介于 -9223372036854775808 和 9223372036854775807 之间的 64 位有符号整数
   */
  readInt64(littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, 8 /* SizeOf.INI64 */);
    const value = __classPrivateFieldGet(this, _Buffer_dataView, 'f').getBigInt64(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 8 /* SizeOf.INI64 */);
    return value;
  }
  /**
   * @method readUint64
   * @description 从缓冲区中读取一个 64 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {bigint} 介于 0 和 18446744073709551615 之间的 64 位无符号整数
   */
  readUint64(littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, 8 /* SizeOf.UINT64 */);
    const value = __classPrivateFieldGet(this, _Buffer_dataView, 'f').getBigUint64(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 8 /* SizeOf.UINT64 */);
    return value;
  }
  /**
   * @method readFloat32
   * @description 从缓冲区中读取一个 IEEE 754 单精度 32 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 单精度 32 位浮点数
   */
  readFloat32(littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, 4 /* SizeOf.FLOAT32 */);
    const value = __classPrivateFieldGet(this, _Buffer_dataView, 'f').getFloat32(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 4 /* SizeOf.FLOAT32 */);
    return value;
  }
  /**
   * @method readFloat64
   * @description 从缓冲区中读取一个 IEEE 754 双精度 64 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 双精度 64 位浮点数
   */
  readFloat64(littleEndian) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, 8 /* SizeOf.FLOAT64 */);
    const value = __classPrivateFieldGet(this, _Buffer_dataView, 'f').getFloat64(
      __classPrivateFieldGet(this, _Buffer_offset, 'f'),
      littleEndian
    );
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, 8 /* SizeOf.FLOAT64 */);
    return value;
  }
  read(length, encoding) {
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_assertRead).call(this, length);
    const offset = __classPrivateFieldGet(this, _Buffer_offset, 'f');
    const bytes = __classPrivateFieldGet(this, _Buffer_bytes, 'f').slice(offset, offset + length);
    __classPrivateFieldGet(this, _Buffer_instances, 'm', _Buffer_seek).call(this, length);
    if (arguments.length >= 2) {
      return decode(bytes, encoding);
    }
    return bytes;
  }
  /**
   * @public
   * @method slice
   * @description 从指定开始和结束位置索引截取并返回新的 Buffer 对象
   * @param {number} [start] 截取开始位置索引
   * @param {number} [end] 截取结束位置索引
   * @returns {Buffer}
   */
  slice(start, end) {
    const bytes = __classPrivateFieldGet(this, _Buffer_bytes, 'f').slice(start, end);
    return new Buffer(bytes, __classPrivateFieldGet(this, _Buffer_pageSize, 'f'));
  }
  /**
   * @public
   * @method copyWithin
   * @description 从 Buffer 对象中将指定位置的数据复制到以 target 起始的位置
   * @param {number} target 粘贴开始位置索引
   * @param {number} start 复制开始位置索引
   * @param {number} [end] 复制结束位置索引
   * @returns {this}
   */
  copyWithin(target, start, end) {
    __classPrivateFieldGet(this, _Buffer_bytes, 'f').copyWithin(target, start, end);
    return this;
  }
  /**
   * @override
   * @method toString
   * @description 获取 Buffer 对象二进制编码字符串
   * @returns {string}
   */
  toString() {
    // 二进制编码字符串
    let binary = '';
    // 提前获取 bytes，防止重复计算
    const bytes = this.bytes;
    // 获取二进制编码
    for (const byte of bytes) {
      binary += mapping[byte];
    }
    // 返回二进制编码
    return binary;
  }
}
(_Buffer_pageSize = new WeakMap()),
  (_Buffer_bytes = new WeakMap()),
  (_Buffer_dataView = new WeakMap()),
  (_Buffer_offset = new WeakMap()),
  (_Buffer_length = new WeakMap()),
  (_Buffer_instances = new WeakSet()),
  (_Buffer_grow = function _Buffer_grow(length) {
    __classPrivateFieldSet(this, _Buffer_length, __classPrivateFieldGet(this, _Buffer_length, 'f') + length, 'f');
  }),
  (_Buffer_seek = function _Buffer_seek(offset) {
    __classPrivateFieldSet(this, _Buffer_offset, __classPrivateFieldGet(this, _Buffer_offset, 'f') + offset, 'f');
  }),
  (_Buffer_assertRead = function _Buffer_assertRead(length) {
    if (
      length < 0 ||
      __classPrivateFieldGet(this, _Buffer_offset, 'f') + length > __classPrivateFieldGet(this, _Buffer_length, 'f')
    ) {
      throw new RangeError(readOverflow);
    }
  }),
  (_Buffer_alloc = function _Buffer_alloc(length) {
    length += __classPrivateFieldGet(this, _Buffer_offset, 'f');
    const bytes = __classPrivateFieldGet(this, _Buffer_bytes, 'f');
    if (length > bytes.length) {
      const newBytes = new Uint8Array(calcBufferLength(length, __classPrivateFieldGet(this, _Buffer_pageSize, 'f')));
      newBytes.set(bytes);
      __classPrivateFieldSet(this, _Buffer_bytes, newBytes, 'f');
      __classPrivateFieldSet(this, _Buffer_dataView, new DataView(newBytes.buffer), 'f');
    }
  });

/**
 * @module tests
 */
/**
 * @function byteLength
 * @description 获取字符串指定编码字节长度
 * @param {string} input
 * @param {string} [encoding]
 * @returns {number}
 */
function byteLength(input, encoding) {
  const buffer = new Buffer();
  buffer.write(input, encoding);
  return buffer.length;
}
const buffer = new Buffer();
const desc = `A buffer tool for javascript.`;
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
console.log(desc, '->', buffer.read(byteLength(desc), 'UTF-8'));
console.log(`\r\n${hex(buffer.bytes)}\r\n`);
console.log('endianness', '->', Endian[endianness()]);
