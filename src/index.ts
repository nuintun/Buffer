/**
 * @module Buffer
 */

import type { TypedArray } from './utils';

import * as errors from './errors';
import { mapping } from './binary';
import { Endian, SizeOf } from './enum';
import { decode, encode, TextDecode, TextEncode } from './encoding';
import { isNaturalNumber, isTypedArray, makeUint8Array } from './utils';

export { Endian };

export type { TypedArray };

export interface Options {
  /**
   * @property {number} [pageSize]
   * @description 缓存页大小
   */
  pageSize?: number;
  /**
   * @property {TextEncode} [encode]
   * @description 文本编码函数
   */
  encode?: TextEncode;
  /**
   * @property {TextDecode} [decode]
   * @description 文本解码函数
   */
  decode?: TextDecode;
  /**
   * @property {boolean} [littleEndian]
   * @description 指定默认字节序
   */
  littleEndian?: boolean;
}

/**
 * @function endianness
 * @description 获取系统默认字节序
 * @returns {Endian}
 */
export function endianness(): Endian {
  switch (new Uint8Array(new Uint16Array([0x00ff]).buffer)[0]) {
    case 0x00:
      return Endian.Big;
    case 0xff:
      return Endian.Little;
    default:
      throw new TypeError(errors.unknownEndianness);
  }
}

/**
 * @class Buffer
 * @classdesc Buffer 类提供用于优化读取，写入以及处理二进制数据的方法和属性
 */
export class Buffer {
  // 缓冲区页大小
  // 容量不足时按页大小增长
  #pageSize: number;
  // 缓冲区数据
  #bytes: Uint8Array;
  // 缓冲区视图
  #dataView: DataView;
  // 读写指针位置
  #offset: number = 0;
  // 已使用字节长度
  #length: number = 0;
  // 文本编码方法
  #encode: TextEncode;
  // 文本解码方法
  #decode: TextDecode;
  // 字节序
  #littleEndian: boolean;

  /**
   * @constructor
   * @param {number} [length] 缓冲区初始字节大小
   * @param {number} [pageSize] 缓冲区分页大小，扩容时将按分页大小增加
   */
  constructor(length?: number, options?: Options);
  /**
   * @constructor
   * @param {Uint8Array} bytes 缓冲区初始字节数据
   * @param {number} [pageSize] 缓冲区分页大小，扩容时将按分页大小增加
   */
  constructor(bytes: TypedArray, options?: Options);
  constructor(input: number | TypedArray = 0, options: Options = {}) {
    let length: number;
    let bytes: Uint8Array;

    const { pageSize = 4096 } = options;

    if (isTypedArray(input)) {
      length = input.byteLength;

      bytes = makeUint8Array(length, pageSize);

      if (length > 0) {
        bytes.set(new Uint8Array(input.buffer, input.byteOffset, length));
      }
    } else {
      length = input;

      bytes = makeUint8Array(length, pageSize);
    }

    this.#bytes = bytes;
    this.#length = length;
    this.#pageSize = pageSize;
    this.#encode = options.encode ?? encode;
    this.#decode = options.decode ?? decode;
    this.#dataView = new DataView(bytes.buffer);
    this.#littleEndian = options.littleEndian ?? false;
  }

  /**
   * @private
   * @method seek
   * @description 移动读写指针
   * @param {number} offset 指针位置
   */
  #seek(offset: number): void {
    if (offset > this.#length) {
      this.#length = offset;
    }

    this.#offset = offset;
  }

  /**
   * @private
   * @method getOffset
   * @description 根据数据类型获取最新指针位置
   * @param size 数据类型长度
   */
  #getOffset(size: number): number {
    return this.#offset + size;
  }

  /**
   * @private
   * @method assertRead
   * @description 读取断言，防止越界读取
   * @param {number} size 断言字节长度
   */
  #assertRead(length: number): asserts length {
    if (length > this.#length) {
      throw new RangeError(errors.readOverflow);
    }
  }

  /**
   * @private
   * @method alloc
   * @description 分配指定长度的缓冲区大小，如果缓冲区溢出则刷新缓冲区
   * @param {number} length 分配字节长度
   */
  #alloc(length: number): void {
    const bytes = this.#bytes;

    if (length > bytes.length) {
      const newBytes = makeUint8Array(length, this.#pageSize);

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
  public set offset(offset: number) {
    if (!isNaturalNumber(offset)) {
      throw new RangeError(errors.offsetInvalid);
    }

    this.#offset = offset;
  }

  /**
   * @public
   * @property {number} offset
   * @description 获取读写指针的位置
   * @returns {number}
   */
  public get offset(): number {
    return this.#offset;
  }

  /**
   * @public
   * @property {number} length
   * @description 设置 Buffer 长度
   * @description 如果将长度设置为小于当前长度的值，将会截断该字节数组
   * @description 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧
   */
  public set length(length: number) {
    if (!isNaturalNumber(length)) {
      throw new RangeError(errors.lengthInvalid);
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
  public get length(): number {
    return this.#length;
  }

  /**
   * @public
   * @property {ArrayBuffer} buffer
   * @description 获取全部 ArrayBuffer 原始缓冲区
   * @returns {ArrayBuffer}
   */
  public get buffer(): ArrayBuffer {
    return this.#bytes.buffer;
  }

  /**
   * @public
   * @property {Uint8Array} bytes
   * @description 获取已写入 Uint8Array 原始缓冲区
   * @returns {Uint8Array}
   */
  public get bytes(): Uint8Array {
    return this.#bytes.subarray(0, this.#length);
  }

  /**
   * @public
   * @method writeInt8
   * @description 在缓冲区中写入一个有符号整数
   * @param {number} value 介于 -128 和 127 之间的整数
   */
  public writeInt8(value: number): void {
    const offset = this.#getOffset(SizeOf.INT8);

    this.#alloc(offset);
    this.#dataView.setInt8(this.#offset, value);
    this.#seek(offset);
  }

  /**
   * @public
   * @method writeUint8
   * @description 在缓冲区中写入一个无符号整数
   * @param {number} value 介于 0 和 255 之间的整数
   */
  public writeUint8(value: number): void {
    const offset = this.#getOffset(SizeOf.UINT8);

    this.#alloc(offset);
    this.#dataView.setUint8(this.#offset, value);
    this.#seek(offset);
  }

  /**
   * @method writeBoolean
   * @description 在缓冲区中写入布尔值，true 写 1，false写 0
   * @param {boolean} value 布尔值
   */
  public writeBoolean(value: boolean): void {
    this.writeUint8(value ? 1 : 0);
  }

  /**
   * @method writeInt16
   * @description 在缓冲区中写入一个 16 位有符号整数
   * @param {number} value 要写入的 16 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeInt16(value: number, littleEndian = this.#littleEndian): void {
    const offset = this.#getOffset(SizeOf.INT16);

    this.#alloc(offset);
    this.#dataView.setInt16(this.#offset, value, littleEndian);
    this.#seek(offset);
  }

  /**
   * @method writeUint16
   * @description 在缓冲区中写入一个 16 位无符号整数
   * @param {number} value 要写入的 16 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeUint16(value: number, littleEndian = this.#littleEndian): void {
    const offset = this.#getOffset(SizeOf.UINT16);

    this.#alloc(offset);
    this.#dataView.setUint16(this.#offset, value, littleEndian);
    this.#seek(offset);
  }

  /**
   * @method writeInt32
   * @description 在缓冲区中写入一个有符号的 32 位有符号整数
   * @param {number} value 要写入的 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeInt32(value: number, littleEndian = this.#littleEndian): void {
    const offset = this.#getOffset(SizeOf.INT32);

    this.#alloc(offset);
    this.#dataView.setInt32(this.#offset, value, littleEndian);
    this.#seek(offset);
  }

  /**
   * @method writeUint32
   * @description 在缓冲区中写入一个无符号的 32 位无符号整数
   * @param {number} value 要写入的 32 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeUint32(value: number, littleEndian = this.#littleEndian): void {
    const offset = this.#getOffset(SizeOf.UINT32);

    this.#alloc(offset);
    this.#dataView.setUint32(this.#offset, value, littleEndian);
    this.#seek(offset);
  }

  /**
   * @method writeInt64
   * @description 在缓冲区中写入一个 64 位有符号整数
   * @param {bigint} value 要写入的 64 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeInt64(value: bigint, littleEndian = this.#littleEndian): void {
    const offset = this.#getOffset(SizeOf.INT64);

    this.#alloc(offset);
    this.#dataView.setBigInt64(this.#offset, value, littleEndian);
    this.#seek(offset);
  }

  /**
   * @method writeUint64
   * @description 在缓冲区中写入一个无符号的 64 位无符号整数
   * @param {bigint} value 要写入的 64 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeUint64(value: bigint, littleEndian = this.#littleEndian): void {
    const offset = this.#getOffset(SizeOf.UINT64);

    this.#alloc(offset);
    this.#dataView.setBigUint64(this.#offset, value, littleEndian);
    this.#seek(offset);
  }

  /**
   * @method writeFloat32
   * @description 在缓冲区中写入一个 IEEE 754 单精度 32 位浮点数
   * @param {number} value 单精度 32 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeFloat32(value: number, littleEndian = this.#littleEndian): void {
    const offset = this.#getOffset(SizeOf.FLOAT32);

    this.#alloc(offset);
    this.#dataView.setFloat32(this.#offset, value, littleEndian);
    this.#seek(offset);
  }

  /**
   * @method writeFloat64
   * @description 在缓冲区中写入一个 IEEE 754 双精度 64 位浮点数
   * @param {number} value 双精度 64 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeFloat64(value: number, littleEndian = this.#littleEndian): void {
    const offset = this.#getOffset(SizeOf.FLOAT64);

    this.#alloc(offset);
    this.#dataView.setFloat64(this.#offset, value, littleEndian);
    this.#seek(offset);
  }

  /**
   * @method write
   * @description 将字符串用指定编码写入字节流
   * @param {string} value 要写入的字符串
   * @param {string} [encoding] 字符串编码
   */
  public write(value: string, encoding?: string): void;
  /**
   * @method write
   * @description 将 Uint8Array 对象写入字节流
   * @param {Uint8Array} bytes 要写入 Uint8Array 对象
   * @param {number} [start] Uint8Array 对象开始索引
   * @param {number} [end] Uint8Array 对象结束索引
   */
  public write(bytes: Uint8Array, start?: number, end?: number): void;
  public write(input: string | Uint8Array, start?: string | number, end?: number): void {
    let bytes: Uint8Array;

    if (input instanceof Uint8Array) {
      bytes = input.subarray(start as number | undefined, end);
    } else {
      bytes = this.#encode(input, (start as string | undefined) ?? 'utf-8');
    }

    const { length } = bytes;

    if (length > 0) {
      const offset = this.#getOffset(length);

      this.#alloc(offset);
      this.#bytes.set(bytes, this.#offset);
      this.#seek(offset);
    }
  }

  /**
   * @method readInt8
   * @description 从缓冲区中读取有符号的整数
   * @returns {number} 介于 -128 和 127 之间的整数
   */
  public readInt8(): number {
    const offset = this.#getOffset(SizeOf.INT8);

    this.#assertRead(offset);

    const value = this.#dataView.getInt8(this.#offset);

    this.#seek(offset);

    return value;
  }

  /**
   * @method readUint8
   * @description 从缓冲区中读取无符号的整数
   * @returns {number} 介于 0 和 255 之间的无符号整数
   */
  public readUint8(): number {
    const offset = this.#getOffset(SizeOf.UINT8);

    this.#assertRead(offset);

    const value = this.#dataView.getUint8(this.#offset);

    this.#seek(offset);

    return value;
  }

  /**
   * @method readBoolean
   * @description 从缓冲区中读取布尔值
   * @returns {boolean} 如果字节非零，则返回 true，否则返回 false
   */
  public readBoolean(): boolean {
    return Boolean(this.readUint8());
  }

  /**
   * @method readInt16
   * @description 从缓冲区中读取一个 16 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 -32768 和 32767 之间的 16 位有符号整数
   */
  public readInt16(littleEndian = this.#littleEndian): number {
    const offset = this.#getOffset(SizeOf.INT16);

    this.#assertRead(offset);

    const value = this.#dataView.getInt16(this.#offset, littleEndian);

    this.#seek(offset);

    return value;
  }

  /**
   * @method readUint16
   * @description 从缓冲区中读取一个 16 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 0 和 65535 之间的 16 位无符号整数
   */
  public readUint16(littleEndian = this.#littleEndian): number {
    const offset = this.#getOffset(SizeOf.UINT16);

    this.#assertRead(offset);

    const value = this.#dataView.getUint16(this.#offset, littleEndian);

    this.#seek(offset);

    return value;
  }

  /**
   * @method readInt32
   * @description 从缓冲区中读取一个 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 -2147483648 和 2147483647 之间的 32 位有符号整数
   */
  public readInt32(littleEndian = this.#littleEndian): number {
    const offset = this.#getOffset(SizeOf.INT32);

    this.#assertRead(offset);

    const value = this.#dataView.getInt32(this.#offset, littleEndian);

    this.#seek(offset);

    return value;
  }

  /**
   * @method readUint32
   * @description 从缓冲区中读取一个 32 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 0 和 4294967295 之间的 32 位无符号整数
   */
  public readUint32(littleEndian = this.#littleEndian): number {
    const offset = this.#getOffset(SizeOf.UINT32);

    this.#assertRead(offset);

    const value = this.#dataView.getUint32(this.#offset, littleEndian);

    this.#seek(offset);

    return value;
  }

  /**
   * @method readInt64
   * @description 从缓冲区中读取一个 64 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {bigint} 介于 -9223372036854775808 和 9223372036854775807 之间的 64 位有符号整数
   */
  public readInt64(littleEndian = this.#littleEndian): bigint {
    const offset = this.#getOffset(SizeOf.INT64);

    this.#assertRead(offset);

    const value = this.#dataView.getBigInt64(this.#offset, littleEndian);

    this.#seek(offset);

    return value;
  }

  /**
   * @method readUint64
   * @description 从缓冲区中读取一个 64 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {bigint} 介于 0 和 18446744073709551615 之间的 64 位无符号整数
   */
  public readUint64(littleEndian = this.#littleEndian): bigint {
    const offset = this.#getOffset(SizeOf.UINT64);

    this.#assertRead(offset);

    const value = this.#dataView.getBigUint64(this.#offset, littleEndian);

    this.#seek(offset);

    return value;
  }

  /**
   * @method readFloat32
   * @description 从缓冲区中读取一个 IEEE 754 单精度 32 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 单精度 32 位浮点数
   */
  public readFloat32(littleEndian = this.#littleEndian): number {
    const offset = this.#getOffset(SizeOf.FLOAT32);

    this.#assertRead(offset);

    const value = this.#dataView.getFloat32(this.#offset, littleEndian);

    this.#seek(offset);

    return value;
  }

  /**
   * @method readFloat64
   * @description 从缓冲区中读取一个 IEEE 754 双精度 64 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 双精度 64 位浮点数
   */
  public readFloat64(littleEndian = this.#littleEndian): number {
    const offset = this.#getOffset(SizeOf.FLOAT64);

    this.#assertRead(offset);

    const value = this.#dataView.getFloat64(this.#offset, littleEndian);

    this.#seek(offset);

    return value;
  }

  /**
   * @method read
   * @description 从缓冲区中读取指定长度的 Uint8Array 对象
   * @param {number} length 读取的字节长度
   * @returns {Uint8Array}
   */
  public read(length: number): Uint8Array;
  /**
   * @method read
   * @description 从缓冲区中读取一个字符串
   * @param {number} length 读取的字节长度
   * @param {string} encoding 字符串编码
   * @returns {string} 指定编码的字符串
   */
  public read(length: number, encoding: string): string;
  public read(length: number, encoding?: string): string | Uint8Array {
    if (!isNaturalNumber(length)) {
      throw new RangeError(errors.readLengthInvalid);
    }

    const offset = this.#getOffset(length);

    this.#assertRead(offset);

    const bytes = this.#bytes.slice(this.#offset, offset);

    this.#seek(offset);

    if (encoding != null) {
      return this.#decode(bytes, encoding);
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
  public slice(start?: number, end?: number): Buffer {
    return new Buffer(this.bytes.subarray(start, end), {
      encode: this.#encode,
      decode: this.#decode,
      pageSize: this.#pageSize,
      littleEndian: this.#littleEndian
    });
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
  public copyWithin(target: number, start: number, end?: number): this {
    this.bytes.copyWithin(target, start, end);

    return this;
  }

  /**
   * @method entries
   * @description 获取迭代器
   * @returns {IterableIterator<[number, number]>}
   */
  public *entries(): IterableIterator<[number, number]> {
    const bytes = this.bytes;
    const length = this.#length;

    for (let i = 0; i < length; i++) {
      yield [i, bytes[i]];
    }
  }

  /**
   * @method values
   * @description 获取迭代器
   * @returns {IterableIterator<number>}
   */
  public *values(): IterableIterator<number> {
    const bytes = this.bytes;
    const length = this.#length;

    for (let i = 0; i < length; i++) {
      yield bytes[i];
    }
  }

  /**
   * @method iterator
   * @description 迭代器
   * @returns {IterableIterator<number>}
   */
  public [Symbol.iterator]() {
    return this.values();
  }

  /**
   * @override
   * @method toString
   * @description 获取 Buffer 对象二进制编码字符串
   * @returns {string}
   */
  public toString(): string {
    // 二进制编码字符串
    let binary = '';

    // 获取二进制编码
    for (const byte of this) {
      binary += mapping[byte];
    }

    // 返回二进制编码
    return binary;
  }
}
