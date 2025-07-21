/**
 * @module utils
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

// 获取 TypedArray 原型
const TypedArray = Object.getPrototypeOf(Uint8Array);

/**
 * @function isTypedArray
 * @description 检测是否为 TypedArray
 * @param value 待判断的值
 * @returns {boolean}
 */
export function isTypedArray(value: unknown): value is TypedArray {
  return value instanceof TypedArray;
}

/**
 * @function isNaturalNumber
 * @description 判断是否为自然数
 * @param value 待判断的值
 * @returns {boolean}
 */
export function isNaturalNumber(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 0;
}

/**
 * @function makeUint8Array
 * @description 创建一个合适长度的 Uint8Array
 * @param {number} length 数据长度大小
 * @param {number} pageSize 缓冲区页大小
 * @returns {Uint8Array}
 */
export function makeUint8Array(length: number, pageSize: number): Uint8Array {
  if (length > pageSize) {
    return new Uint8Array(Math.ceil(length / pageSize) * pageSize);
  }

  return new Uint8Array(pageSize);
}
