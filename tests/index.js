/**
 * @package @nuintun/buffer
 * @license MIT
 * @version 0.2.0
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

/**
 * @package @nuintun/buffer
 * @license MIT
 * @version 0.2.0
 * @author nuintun <nuintun@qq.com>
 * @description A buffer tool for javascript.
 * @see https://github.com/nuintun/Buffer#readme
 */

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
 * @package @nuintun/buffer
 * @license MIT
 * @version 0.2.0
 * @author nuintun <nuintun@qq.com>
 * @description A buffer tool for javascript.
 * @see https://github.com/nuintun/Buffer#readme
 */

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
 * @package @nuintun/buffer
 * @license MIT
 * @version 0.2.0
 * @author nuintun <nuintun@qq.com>
 * @description A buffer tool for javascript.
 * @see https://github.com/nuintun/Buffer#readme
 */

/**
 * @module errors
 */
// 未支持的编码格式
function encodingInvalid(encoding) {
  return 'unsupported encoding ' + encoding;
}
// 未知字节序
const unknownEndianness = 'unknown endianness';
// 非法长度
const lengthInvalid = 'invalid buffer length';
// 非法读写指针
const offsetInvalid = 'invalid buffer offset';
// 数据读取溢出
const readOverflow = 'read is outside the bounds of the Buffer';
// 读写指针溢出
const offsetOverflow = 'offset is outside the bounds of the Buffer';

/**
 * @package @nuintun/buffer
 * @license MIT
 * @version 0.2.0
 * @author nuintun <nuintun@qq.com>
 * @description A buffer tool for javascript.
 * @see https://github.com/nuintun/Buffer#readme
 */

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
 * @package @nuintun/buffer
 * @license MIT
 * @version 0.2.0
 * @author nuintun <nuintun@qq.com>
 * @description A buffer tool for javascript.
 * @see https://github.com/nuintun/Buffer#readme
 */

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
 * @package @nuintun/buffer
 * @license MIT
 * @version 0.2.0
 * @author nuintun <nuintun@qq.com>
 * @description A buffer tool for javascript.
 * @see https://github.com/nuintun/Buffer#readme
 */

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
 * @package @nuintun/buffer
 * @license MIT
 * @version 0.2.0
 * @author nuintun <nuintun@qq.com>
 * @description A buffer tool for javascript.
 * @see https://github.com/nuintun/Buffer#readme
 */

/**
 * @module Buffer
 */
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
  // 缓冲区页大小
  // 容量不足时按页大小增长
  #pageSize;
  // 缓冲区数据
  #bytes;
  // 缓冲区视图
  #dataView;
  // 读写指针位置
  #offset = 0;
  // 已使用字节长度
  #length = 0;
  constructor(input = 0, pageSize = 4096) {
    this.#pageSize = pageSize;
    if (input instanceof Uint8Array) {
      this.#bytes = input;
      this.#length = input.length;
      this.#dataView = new DataView(input.buffer);
    } else {
      const bytes = new Uint8Array(calcBufferLength(input, pageSize));
      this.#bytes = bytes;
      this.#length = input;
      this.#dataView = new DataView(bytes.buffer);
    }
  }
  /**
   * @private
   * @method grow
   * @description 增加长度
   * @param {number} length 长度增加量
   */
  #grow(length) {
    this.#length += length;
  }
  /**
   * @private
   * @method seek
   * @description 移动读写指针
   * @param {number} offset 指针偏移量
   */
  #seek(offset) {
    this.#offset += offset;
  }
  /**
   * @private
   * @method assertRead
   * @description 读取断言，防止越界读取
   * @param {number} length 断言字节长度
   */
  #assertRead(length) {
    if (length < 0 || this.#offset + length > this.#length) {
      throw new RangeError(readOverflow);
    }
  }
  /**
   * @private
   * @method alloc
   * @description 分配指定长度的缓冲区大小，如果缓冲区溢出则刷新缓冲区
   * @param {number} length 分配字节长度
   */
  #alloc(length) {
    length += this.#offset;
    const bytes = this.#bytes;
    if (length > bytes.length) {
      const newBytes = new Uint8Array(calcBufferLength(length, this.#pageSize));
      newBytes.set(bytes);
      this.#bytes = newBytes;
      this.#dataView = new DataView(newBytes.buffer);
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
    if (offset > this.#length) {
      throw new RangeError(offsetOverflow);
    }
    this.#offset = offset;
  }
  /**
   * @public
   * @property {number} offset
   * @description 获取读写指针的位置
   * @returns {number}
   */
  get offset() {
    return this.#offset;
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
    const currentLength = this.#length;
    if (length > currentLength) {
      this.#alloc(length - currentLength);
    } else {
      this.#length = length;
      // 重置多余字节
      this.#bytes.fill(0, length);
    }
    if (this.#offset > length) {
      this.#offset = length;
    }
  }
  /**
   * @public
   * @property {number} length
   * @description 获取 Buffer 长度
   * @returns {number}
   */
  get length() {
    return this.#length;
  }
  /**
   * @public
   * @property {ArrayBuffer} buffer
   * @description 获取 ArrayBuffer 缓冲区
   * @returns {ArrayBuffer}
   */
  get buffer() {
    return this.#bytes.buffer.slice(0, this.#length);
  }
  /**
   * @public
   * @property {Uint8Array} bytes
   * @description 获取 Uint8Array 缓冲区
   * @returns {Uint8Array}
   */
  get bytes() {
    return this.#bytes.slice(0, this.#length);
  }
  /**
   * @public
   * @method writeInt8
   * @description 在缓冲区中写入一个有符号整数
   * @param {number} value 介于 -128 和 127 之间的整数
   */
  writeInt8(value) {
    this.#alloc(1 /* SizeOf.INT8 */);
    this.#dataView.setInt8(this.#offset, value);
    this.#grow(1 /* SizeOf.INT8 */);
    this.#seek(1 /* SizeOf.INT8 */);
  }
  /**
   * @public
   * @method writeUint8
   * @description 在缓冲区中写入一个无符号整数
   * @param {number} value 介于 0 和 255 之间的整数
   */
  writeUint8(value) {
    this.#alloc(1 /* SizeOf.UINT8 */);
    this.#dataView.setUint8(this.#offset, value);
    this.#grow(1 /* SizeOf.UINT8 */);
    this.#seek(1 /* SizeOf.UINT8 */);
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
    this.#alloc(2 /* SizeOf.INT16 */);
    this.#dataView.setInt16(this.#offset, value, littleEndian);
    this.#grow(2 /* SizeOf.INT16 */);
    this.#seek(2 /* SizeOf.INT16 */);
  }
  /**
   * @method writeUint16
   * @description 在缓冲区中写入一个 16 位无符号整数
   * @param {number} value 要写入的 16 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeUint16(value, littleEndian) {
    this.#alloc(2 /* SizeOf.UINT16 */);
    this.#dataView.setUint16(this.#offset, value, littleEndian);
    this.#grow(2 /* SizeOf.UINT16 */);
    this.#seek(2 /* SizeOf.UINT16 */);
  }
  /**
   * @method writeInt32
   * @description 在缓冲区中写入一个有符号的 32 位有符号整数
   * @param {number} value 要写入的 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeInt32(value, littleEndian) {
    this.#alloc(4 /* SizeOf.INT32 */);
    this.#dataView.setInt32(this.#offset, value, littleEndian);
    this.#grow(4 /* SizeOf.INT32 */);
    this.#seek(4 /* SizeOf.INT32 */);
  }
  /**
   * @method writeUint32
   * @description 在缓冲区中写入一个无符号的 32 位无符号整数
   * @param {number} value 要写入的 32 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeUint32(value, littleEndian) {
    this.#alloc(4 /* SizeOf.UINT32 */);
    this.#dataView.setUint32(this.#offset, value, littleEndian);
    this.#grow(4 /* SizeOf.UINT32 */);
    this.#seek(4 /* SizeOf.UINT32 */);
  }
  /**
   * @method writeInt64
   * @description 在缓冲区中写入一个无符号的 64 位有符号整数
   * @param {bigint} value 要写入的 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeInt64(value, littleEndian) {
    this.#alloc(8 /* SizeOf.INI64 */);
    this.#dataView.setBigInt64(this.#offset, value, littleEndian);
    this.#grow(8 /* SizeOf.INI64 */);
    this.#seek(8 /* SizeOf.INI64 */);
  }
  /**
   * @method writeUint64
   * @description 在缓冲区中写入一个无符号的 64 位无符号整数
   * @param {bigint} value 要写入的 64 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeUint64(value, littleEndian) {
    this.#alloc(8 /* SizeOf.UINT64 */);
    this.#dataView.setBigUint64(this.#offset, value, littleEndian);
    this.#grow(8 /* SizeOf.UINT64 */);
    this.#seek(8 /* SizeOf.UINT64 */);
  }
  /**
   * @method writeFloat32
   * @description 在缓冲区中写入一个 IEEE 754 单精度 32 位浮点数
   * @param {number} value 单精度 32 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeFloat32(value, littleEndian) {
    this.#alloc(4 /* SizeOf.FLOAT32 */);
    this.#dataView.setFloat32(this.#offset, value, littleEndian);
    this.#grow(4 /* SizeOf.FLOAT32 */);
    this.#seek(4 /* SizeOf.FLOAT32 */);
  }
  /**
   * @method writeFloat64
   * @description 在缓冲区中写入一个 IEEE 754 双精度 64 位浮点数
   * @param {number} value 双精度 64 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeFloat64(value, littleEndian) {
    this.#alloc(8 /* SizeOf.FLOAT64 */);
    this.#dataView.setFloat64(this.#offset, value, littleEndian);
    this.#grow(8 /* SizeOf.FLOAT64 */);
    this.#seek(8 /* SizeOf.FLOAT64 */);
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
      this.#alloc(length);
      this.#bytes.set(bytes, this.#offset);
      this.#grow(length);
      this.#seek(length);
    }
  }
  /**
   * @method readInt8
   * @description 从缓冲区中读取有符号的整数
   * @returns {number} 介于 -128 和 127 之间的整数
   */
  readInt8() {
    this.#assertRead(1 /* SizeOf.INT8 */);
    const value = this.#dataView.getInt8(this.#offset);
    this.#seek(1 /* SizeOf.INT8 */);
    return value;
  }
  /**
   * @method readUint8
   * @description 从缓冲区中读取无符号的整数
   * @returns {number} 介于 0 和 255 之间的无符号整数
   */
  readUint8() {
    this.#assertRead(1 /* SizeOf.UINT8 */);
    const value = this.#dataView.getUint8(this.#offset);
    this.#seek(1 /* SizeOf.UINT8 */);
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
    this.#assertRead(2 /* SizeOf.INT16 */);
    const value = this.#dataView.getInt16(this.#offset, littleEndian);
    this.#seek(2 /* SizeOf.INT16 */);
    return value;
  }
  /**
   * @method readUint16
   * @description 从缓冲区中读取一个 16 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 0 和 65535 之间的 16 位无符号整数
   */
  readUint16(littleEndian) {
    this.#assertRead(2 /* SizeOf.UINT16 */);
    const value = this.#dataView.getUint16(this.#offset, littleEndian);
    this.#seek(2 /* SizeOf.UINT16 */);
    return value;
  }
  /**
   * @method readInt32
   * @description 从缓冲区中读取一个 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 -2147483648 和 2147483647 之间的 32 位有符号整数
   */
  readInt32(littleEndian) {
    this.#assertRead(4 /* SizeOf.INT32 */);
    const value = this.#dataView.getInt32(this.#offset, littleEndian);
    this.#seek(4 /* SizeOf.INT32 */);
    return value;
  }
  /**
   * @method readUint32
   * @description 从缓冲区中读取一个 32 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 0 和 4294967295 之间的 32 位无符号整数
   */
  readUint32(littleEndian) {
    this.#assertRead(4 /* SizeOf.UINT32 */);
    const value = this.#dataView.getUint32(this.#offset, littleEndian);
    this.#seek(4 /* SizeOf.UINT32 */);
    return value;
  }
  /**
   * @method readInt64
   * @description 从缓冲区中读取一个 64 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {bigint} 介于 -9223372036854775808 和 9223372036854775807 之间的 64 位有符号整数
   */
  readInt64(littleEndian) {
    this.#assertRead(8 /* SizeOf.INI64 */);
    const value = this.#dataView.getBigInt64(this.#offset, littleEndian);
    this.#seek(8 /* SizeOf.INI64 */);
    return value;
  }
  /**
   * @method readUint64
   * @description 从缓冲区中读取一个 64 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {bigint} 介于 0 和 18446744073709551615 之间的 64 位无符号整数
   */
  readUint64(littleEndian) {
    this.#assertRead(8 /* SizeOf.UINT64 */);
    const value = this.#dataView.getBigUint64(this.#offset, littleEndian);
    this.#seek(8 /* SizeOf.UINT64 */);
    return value;
  }
  /**
   * @method readFloat32
   * @description 从缓冲区中读取一个 IEEE 754 单精度 32 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 单精度 32 位浮点数
   */
  readFloat32(littleEndian) {
    this.#assertRead(4 /* SizeOf.FLOAT32 */);
    const value = this.#dataView.getFloat32(this.#offset, littleEndian);
    this.#seek(4 /* SizeOf.FLOAT32 */);
    return value;
  }
  /**
   * @method readFloat64
   * @description 从缓冲区中读取一个 IEEE 754 双精度 64 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 双精度 64 位浮点数
   */
  readFloat64(littleEndian) {
    this.#assertRead(8 /* SizeOf.FLOAT64 */);
    const value = this.#dataView.getFloat64(this.#offset, littleEndian);
    this.#seek(8 /* SizeOf.FLOAT64 */);
    return value;
  }
  read(length, encoding) {
    this.#assertRead(length);
    const offset = this.#offset;
    const bytes = this.#bytes.slice(offset, offset + length);
    this.#seek(length);
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
    const bytes = this.#bytes.slice(start, end);
    return new Buffer(bytes, this.#pageSize);
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
    this.#bytes.copyWithin(target, start, end);
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
buffer.writeInt64(0xf0f1fafbfcfdfeffn);
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
console.log(0xf0f1fafbfcfdfeffn, '->', buffer.readInt64());
console.log(0xfffefdfcfbfaf1f0n, '->', buffer.readUint64());
console.log(123456.654321, '->', buffer.readFloat32());
console.log(987654321.123456789, '->', buffer.readFloat64());
console.log(desc, '->', buffer.read(byteLength(desc), 'UTF-8'));
console.log(`\r\n${hex(buffer.bytes)}\r\n`);
console.log('endianness', '->', Endian[endianness()]);
