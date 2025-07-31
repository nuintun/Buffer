# Buffer

<!-- prettier-ignore -->
> A buffer tool for javascript.
>
> [![NPM Version][npm-image]][npm-url]
> [![Download Status][download-image]][npm-url]
> [![Languages Status][languages-image]][github-url]
> [![Tree Shakeable][tree-shakeable-image]][bundle-phobia-url]
> [![Side Effect][side-effect-image]][bundle-phobia-url]
> [![License][license-image]][license-url]

### Usage

##### Common Interface

```ts
/**
 * @module Buffer
 */

export type TypedArray =
  | Int8Array
  | Int16Array
  | Int32Array
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array
  | Uint8ClampedArray;

export declare enum Endian {
  Big = 0,
  Little = 1
}

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
export declare function endianness(): Endian;

/**
 * @class Buffer
 * @classdesc Buffer 类提供用于优化读取，写入以及处理二进制数据的方法和属性
 */
export declare class Buffer {
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
  /**
   * @public
   * @property {number} offset
   * @description 设置读写指针位置，以字节为单位
   * @description 下一次调用读写方法时将在此位置开始读写
   */
  set offset(offset: number);
  /**
   * @public
   * @property {number} offset
   * @description 获取读写指针的位置
   * @returns {number}
   */
  get offset(): number;
  /**
   * @public
   * @property {number} length
   * @description 设置 Buffer 长度
   * @description 如果将长度设置为小于当前长度的值，将会截断该字节数组
   * @description 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧
   */
  set length(length: number);
  /**
   * @public
   * @property {number} length
   * @description 获取 Buffer 长度
   * @returns {number}
   */
  get length(): number;
  /**
   * @public
   * @property {ArrayBuffer} buffer
   * @description 获取全部 ArrayBuffer 原始缓冲区
   * @returns {ArrayBuffer}
   */
  get buffer(): ArrayBuffer;
  /**
   * @public
   * @property {Uint8Array} bytes
   * @description 获取已写入 Uint8Array 原始缓冲区
   * @returns {Uint8Array}
   */
  get bytes(): Uint8Array;
  /**
   * @public
   * @method writeInt8
   * @description 在缓冲区中写入一个有符号整数
   * @param {number} value 介于 -128 和 127 之间的整数
   */
  writeInt8(value: number): void;
  /**
   * @public
   * @method writeUint8
   * @description 在缓冲区中写入一个无符号整数
   * @param {number} value 介于 0 和 255 之间的整数
   */
  writeUint8(value: number): void;
  /**
   * @method writeBoolean
   * @description 在缓冲区中写入布尔值，true 写 1，false写 0
   * @param {boolean} value 布尔值
   */
  writeBoolean(value: boolean): void;
  /**
   * @method writeInt16
   * @description 在缓冲区中写入一个 16 位有符号整数
   * @param {number} value 要写入的 16 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeInt16(value: number, littleEndian?: boolean): void;
  /**
   * @method writeUint16
   * @description 在缓冲区中写入一个 16 位无符号整数
   * @param {number} value 要写入的 16 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeUint16(value: number, littleEndian?: boolean): void;
  /**
   * @method writeInt32
   * @description 在缓冲区中写入一个有符号的 32 位有符号整数
   * @param {number} value 要写入的 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeInt32(value: number, littleEndian?: boolean): void;
  /**
   * @method writeUint32
   * @description 在缓冲区中写入一个无符号的 32 位无符号整数
   * @param {number} value 要写入的 32 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeUint32(value: number, littleEndian?: boolean): void;
  /**
   * @method writeInt64
   * @description 在缓冲区中写入一个 64 位有符号整数
   * @param {bigint} value 要写入的 64 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeInt64(value: bigint, littleEndian?: boolean): void;
  /**
   * @method writeUint64
   * @description 在缓冲区中写入一个无符号的 64 位无符号整数
   * @param {bigint} value 要写入的 64 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeUint64(value: bigint, littleEndian?: boolean): void;
  /**
   * @method writeFloat32
   * @description 在缓冲区中写入一个 IEEE 754 单精度 32 位浮点数
   * @param {number} value 单精度 32 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeFloat32(value: number, littleEndian?: boolean): void;
  /**
   * @method writeFloat64
   * @description 在缓冲区中写入一个 IEEE 754 双精度 64 位浮点数
   * @param {number} value 双精度 64 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   */
  writeFloat64(value: number, littleEndian?: boolean): void;
  /**
   * @method write
   * @description 将字符串用指定编码写入字节流
   * @param {string} value 要写入的字符串
   * @param {string} [encoding] 字符串编码
   */
  write(value: string, encoding?: string): void;
  /**
   * @method write
   * @description 将 Uint8Array 对象写入字节流
   * @param {Uint8Array} bytes 要写入 Uint8Array 对象
   * @param {number} [start] Uint8Array 对象开始索引
   * @param {number} [end] Uint8Array 对象结束索引
   */
  write(bytes: Uint8Array, start?: number, end?: number): void;
  /**
   * @method readInt8
   * @description 从缓冲区中读取有符号的整数
   * @returns {number} 介于 -128 和 127 之间的整数
   */
  readInt8(): number;
  /**
   * @method readUint8
   * @description 从缓冲区中读取无符号的整数
   * @returns {number} 介于 0 和 255 之间的无符号整数
   */
  readUint8(): number;
  /**
   * @method readBoolean
   * @description 从缓冲区中读取布尔值
   * @returns {boolean} 如果字节非零，则返回 true，否则返回 false
   */
  readBoolean(): boolean;
  /**
   * @method readInt16
   * @description 从缓冲区中读取一个 16 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 -32768 和 32767 之间的 16 位有符号整数
   */
  readInt16(littleEndian?: boolean): number;
  /**
   * @method readUint16
   * @description 从缓冲区中读取一个 16 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 0 和 65535 之间的 16 位无符号整数
   */
  readUint16(littleEndian?: boolean): number;
  /**
   * @method readInt32
   * @description 从缓冲区中读取一个 32 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 -2147483648 和 2147483647 之间的 32 位有符号整数
   */
  readInt32(littleEndian?: boolean): number;
  /**
   * @method readUint32
   * @description 从缓冲区中读取一个 32 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 介于 0 和 4294967295 之间的 32 位无符号整数
   */
  readUint32(littleEndian?: boolean): number;
  /**
   * @method readInt64
   * @description 从缓冲区中读取一个 64 位有符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {bigint} 介于 -9223372036854775808 和 9223372036854775807 之间的 64 位有符号整数
   */
  readInt64(littleEndian?: boolean): bigint;
  /**
   * @method readUint64
   * @description 从缓冲区中读取一个 64 位无符号整数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {bigint} 介于 0 和 18446744073709551615 之间的 64 位无符号整数
   */
  readUint64(littleEndian?: boolean): bigint;
  /**
   * @method readFloat32
   * @description 从缓冲区中读取一个 IEEE 754 单精度 32 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 单精度 32 位浮点数
   */
  readFloat32(littleEndian?: boolean): number;
  /**
   * @method readFloat64
   * @description 从缓冲区中读取一个 IEEE 754 双精度 64 位浮点数
   * @param {boolean} [littleEndian] 是否为小端字节序
   * @returns {number} 双精度 64 位浮点数
   */
  readFloat64(littleEndian?: boolean): number;
  /**
   * @method read
   * @description 从缓冲区中读取指定长度的 Uint8Array 对象
   * @param {number} length 读取的字节长度
   * @returns {Uint8Array}
   */
  read(length: number): Uint8Array;
  /**
   * @method read
   * @description 从缓冲区中读取一个字符串
   * @param {number} length 读取的字节长度
   * @param {string} encoding 字符串编码
   * @returns {string} 指定编码的字符串
   */
  read(length: number, encoding: string): string;
  /**
   * @public
   * @method slice
   * @description 从指定开始和结束位置索引截取并返回新的 Buffer 对象
   * @param {number} [start] 截取开始位置索引
   * @param {number} [end] 截取结束位置索引
   * @returns {Buffer}
   */
  slice(start?: number, end?: number): Buffer;
  /**
   * @public
   * @method copyWithin
   * @description 从 Buffer 对象中将指定位置的数据复制到以 target 起始的位置
   * @param {number} target 粘贴开始位置索引
   * @param {number} start 复制开始位置索引
   * @param {number} [end] 复制结束位置索引
   * @returns {this}
   */
  copyWithin(target: number, start: number, end?: number): this;
  /**
   * @method entries
   * @description 获取迭代器
   * @returns {IterableIterator<[number, number]>}
   */
  entries(): IterableIterator<[number, number]>;
  /**
   * @method values
   * @description 获取迭代器
   * @returns {IterableIterator<number>}
   */
  values(): IterableIterator<number>;
  /**
   * @method iterator
   * @description 迭代器
   * @returns {IterableIterator<number>}
   */
  [Symbol.iterator](): IterableIterator<number>;
  /**
   * @override
   * @method toString
   * @description 获取 Buffer 对象二进制编码字符串
   * @returns {string}
   */
  toString(): string;
}
```

[npm-image]: https://img.shields.io/npm/v/@nuintun/buffer?style=flat-square
[npm-url]: https://www.npmjs.org/package/@nuintun/buffer
[download-image]: https://img.shields.io/npm/dm/@nuintun/buffer?style=flat-square
[languages-image]: https://img.shields.io/github/languages/top/nuintun/buffer?style=flat-square
[github-url]: https://github.com/nuintun/buffer
[tree-shakeable-image]: https://img.shields.io/badge/tree--shakeable-true-brightgreen?style=flat-square
[side-effect-image]: https://img.shields.io/badge/side--effect-free-brightgreen?style=flat-square
[bundle-phobia-url]: https://bundlephobia.com/result?p=@nuintun/buffer
[license-image]: https://img.shields.io/github/license/nuintun/buffer?style=flat-square
[license-url]: https://github.com/nuintun/buffer/blob/main/LICENSE
