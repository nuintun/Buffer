/**
 * @module Buffer
 */

import { SizeOf } from './enum';
import * as utils from './utils';
import * as Binary from './Binary';
import * as errors from './errors';
import * as Encoding from './Encoding';

// 字节序类型
export enum Endian {
  Big,
  Little
}

/**
 * @function endianness
 * @description 获取系统默认字节序
 * @returns {Endian}
 */
export function endianness(): Endian {
  switch (new Uint8Array(new Uint32Array([0x12345678]))[0]) {
    case 0x12:
      return Endian.Big;
    case 0x78:
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
  // 已使用字节长度
  #length = 0;
  // 读写指针位置
  #offset = 0;
  // 缓冲区页大小
  // 容量不足时按页大小增长
  #pageSize: number;
  // 缓冲区数据
  #bytes: Uint8Array;
  // 缓冲区视图
  #dataView: DataView;

  /**
   * @constructor
   * @param {number} [length] 缓冲区初始大小
   * @param {number} [pageSize] 缓冲区分页大小，扩容时将按分页大小增加
   */
  constructor(length?: number, pageSize?: number);
  /**
   * @constructor
   * @param {Uint8Array} bytes 缓冲区初始数据
   * @param {number} [pageSize] 缓冲区分页大小，扩容时将按分页大小增加
   */
  constructor(bytes?: Uint8Array, pageSize?: number);
  constructor(input: number | Uint8Array = 0, pageSize: number = 4096) {
    this.#pageSize = pageSize;

    if (input instanceof Uint8Array) {
      this.#bytes = input;
      this.#length = input.length;
      this.#dataView = new DataView(input.buffer);
    } else {
      const bytes = new Uint8Array(utils.calcBufferLength(input, pageSize));

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
  #grow(length: number): void {
    this.#length += length;
  }

  /**
   * @private
   * @method seek
   * @description 移动读写指针
   * @param {number} offset 指针偏移量
   */
  #seek(offset: number): void {
    this.#offset += offset;
  }

  /**
   * @private
   * @method assertRead
   * @description 读取断言，防止越界读取
   * @param {number} length 断言字节长度
   */
  #assertRead(length: number): void {
    if (length < 0 || this.#offset + length > this.#length) {
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
    length += this.#offset;

    const bytes = this.#bytes;

    if (length > bytes.length) {
      const newBytes = new Uint8Array(utils.calcBufferLength(length, this.#pageSize));

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
    if (offset < 0) {
      throw new RangeError(errors.offsetInvalid);
    }

    if (offset > this.#length) {
      throw new RangeError(errors.offsetOverflow);
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
    if (length < 0) {
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
   * @description 获取 ArrayBuffer 缓冲区
   * @returns {ArrayBuffer}
   */
  public get buffer(): ArrayBuffer {
    return this.#bytes.buffer.slice(0, this.#length);
  }

  /**
   * @public
   * @property {Uint8Array} bytes
   * @description 获取 Uint8Array 缓冲区
   * @returns {Uint8Array}
   */
  public get bytes(): Uint8Array {
    return this.#bytes.slice(0, this.#length);
  }

  /**
   * @public
   * @method writeInt8
   * @description 在缓冲区中写入一个有符号整数
   * @param {number} value 介于 -128 和 127 之间的整数
   */
  public writeInt8(value: number): void {
    this.#alloc(SizeOf.INT8);
    this.#dataView.setInt8(this.#offset, value);
    this.#grow(SizeOf.INT8);
    this.#seek(SizeOf.INT8);
  }

  /**
   * @public
   * @method writeUint8
   * @description 在缓冲区中写入一个无符号整数
   * @param {number} value 介于 0 和 255 之间的整数
   */
  public writeUint8(value: number): void {
    this.#alloc(SizeOf.UINT8);
    this.#dataView.setUint8(this.#offset, value);
    this.#grow(SizeOf.UINT8);
    this.#seek(SizeOf.UINT8);
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
  public writeInt16(value: number, littleEndian?: boolean): void {
    this.#alloc(SizeOf.INT16);
    this.#dataView.setInt16(this.#offset, value, littleEndian);
    this.#grow(SizeOf.INT16);
    this.#seek(SizeOf.INT16);
  }

  /**
   * @method writeUint16
   * @description 在缓冲区中写入一个 16 位无符号整数
   * @param {number} value 要写入的 16 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeUint16(value: number, littleEndian?: boolean): void {
    this.#alloc(SizeOf.UINT16);
    this.#dataView.setUint16(this.#offset, value, littleEndian);
    this.#grow(SizeOf.UINT16);
    this.#seek(SizeOf.UINT16);
  }

  /**
   * @method writeInt32
   * @description 在缓冲区中写入一个有符号的 32 位有符号整数
   * @param {number} value 要写入的 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeInt32(value: number, littleEndian?: boolean): void {
    this.#alloc(SizeOf.INT32);
    this.#dataView.setInt32(this.#offset, value, littleEndian);
    this.#grow(SizeOf.INT32);
    this.#seek(SizeOf.INT32);
  }

  /**
   * @method writeUint32
   * @description 在缓冲区中写入一个无符号的 32 位无符号整数
   * @param {number} value 要写入的 32 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeUint32(value: number, littleEndian?: boolean): void {
    this.#alloc(SizeOf.UINT32);
    this.#dataView.setUint32(this.#offset, value, littleEndian);
    this.#grow(SizeOf.UINT32);
    this.#seek(SizeOf.UINT32);
  }

  /**
   * @method writeInt64
   * @description 在缓冲区中写入一个无符号的 64 位有符号整数
   * @param {bigint} value 要写入的 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeInt64(value: bigint, littleEndian?: boolean): void {
    this.#alloc(SizeOf.INI64);
    this.#dataView.setBigInt64(this.#offset, value, littleEndian);
    this.#grow(SizeOf.INI64);
    this.#seek(SizeOf.INI64);
  }

  /**
   * @method writeUint64
   * @description 在缓冲区中写入一个无符号的 64 位无符号整数
   * @param {bigint} value 要写入的 64 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeUint64(value: bigint, littleEndian?: boolean): void {
    this.#alloc(SizeOf.UINT64);
    this.#dataView.setBigUint64(this.#offset, value, littleEndian);
    this.#grow(SizeOf.UINT64);
    this.#seek(SizeOf.UINT64);
  }

  /**
   * @method writeFloat32
   * @description 在缓冲区中写入一个 IEEE 754 单精度 32 位浮点数
   * @param {number} value 单精度 32 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeFloat32(value: number, littleEndian?: boolean): void {
    this.#alloc(SizeOf.FLOAT32);
    this.#dataView.setFloat32(this.#offset, value, littleEndian);
    this.#grow(SizeOf.FLOAT32);
    this.#seek(SizeOf.FLOAT32);
  }

  /**
   * @method writeFloat64
   * @description 在缓冲区中写入一个 IEEE 754 双精度 64 位浮点数
   * @param {number} value 双精度 64 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  public writeFloat64(value: number, littleEndian?: boolean): void {
    this.#alloc(SizeOf.FLOAT64);
    this.#dataView.setFloat64(this.#offset, value, littleEndian);
    this.#grow(SizeOf.FLOAT64);
    this.#seek(SizeOf.FLOAT64);
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
      bytes = input.subarray(start as number, end);
    } else {
      bytes = Encoding.encode(input, start as string);
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
  public readInt8(): number {
    this.#assertRead(SizeOf.INT8);

    const value = this.#dataView.getInt8(this.#offset);

    this.#seek(SizeOf.INT8);

    return value;
  }

  /**
   * @method readUint8
   * @description 从缓冲区中读取无符号的整数
   * @returns {number} 介于 0 和 255 之间的无符号整数
   */
  public readUint8(): number {
    this.#assertRead(SizeOf.UINT8);

    const value = this.#dataView.getUint8(this.#offset);

    this.#seek(SizeOf.UINT8);

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
  public readInt16(littleEndian?: boolean): number {
    this.#assertRead(SizeOf.INT16);

    const value = this.#dataView.getInt16(this.#offset, littleEndian);

    this.#seek(SizeOf.INT16);

    return value;
  }

  /**
   * @method readUint16
   * @description 从缓冲区中读取一个 16 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 0 和 65535 之间的 16 位无符号整数
   */
  public readUint16(littleEndian?: boolean): number {
    this.#assertRead(SizeOf.UINT16);

    const value = this.#dataView.getUint16(this.#offset, littleEndian);

    this.#seek(SizeOf.UINT16);

    return value;
  }

  /**
   * @method readInt32
   * @description 从缓冲区中读取一个 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 -2147483648 和 2147483647 之间的 32 位有符号整数
   */
  public readInt32(littleEndian?: boolean): number {
    this.#assertRead(SizeOf.INT32);

    const value = this.#dataView.getInt32(this.#offset, littleEndian);

    this.#seek(SizeOf.INT32);

    return value;
  }

  /**
   * @method readUint32
   * @description 从缓冲区中读取一个 32 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 0 和 4294967295 之间的 32 位无符号整数
   */
  public readUint32(littleEndian?: boolean): number {
    this.#assertRead(SizeOf.UINT32);

    const value = this.#dataView.getUint32(this.#offset, littleEndian);

    this.#seek(SizeOf.UINT32);

    return value;
  }

  /**
   * @method readInt64
   * @description 从缓冲区中读取一个 64 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {bigint} 介于 -9223372036854775808 和 9223372036854775807 之间的 64 位有符号整数
   */
  public readInt64(littleEndian?: boolean): bigint {
    this.#assertRead(SizeOf.INI64);

    const value = this.#dataView.getBigInt64(this.#offset, littleEndian);

    this.#seek(SizeOf.INI64);

    return value;
  }

  /**
   * @method readUint64
   * @description 从缓冲区中读取一个 64 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {bigint} 介于 0 和 18446744073709551615 之间的 64 位无符号整数
   */
  public readUint64(littleEndian?: boolean): bigint {
    this.#assertRead(SizeOf.UINT64);

    const value = this.#dataView.getBigUint64(this.#offset, littleEndian);

    this.#seek(SizeOf.UINT64);

    return value;
  }

  /**
   * @method readFloat32
   * @description 从缓冲区中读取一个 IEEE 754 单精度 32 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 单精度 32 位浮点数
   */
  public readFloat32(littleEndian?: boolean): number {
    this.#assertRead(SizeOf.FLOAT32);

    const value = this.#dataView.getFloat32(this.#offset, littleEndian);

    this.#seek(SizeOf.FLOAT32);

    return value;
  }

  /**
   * @method readFloat64
   * @description 从缓冲区中读取一个 IEEE 754 双精度 64 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 双精度 64 位浮点数
   */
  public readFloat64(littleEndian?: boolean): number {
    this.#assertRead(SizeOf.FLOAT64);

    const value = this.#dataView.getFloat64(this.#offset, littleEndian);

    this.#seek(SizeOf.FLOAT64);

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
    this.#assertRead(length);

    const offset = this.#offset;
    const bytes = this.#bytes.slice(offset, offset + length);

    this.#seek(length);

    if (arguments.length >= 2) {
      return Encoding.decode(bytes, encoding);
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
  public copyWithin(target: number, start: number, end?: number): this {
    this.#bytes.copyWithin(target, start, end);

    return this;
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

    // 提前获取 bytes，防止重复计算
    const bytes: Uint8Array = this.bytes;

    // 获取二进制编码
    for (const byte of bytes) {
      binary += Binary.mapping[byte];
    }

    // 返回二进制编码
    return binary;
  }
}
