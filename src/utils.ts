/**
 * @module utils
 */

/**
 * @function isNaturalNumber
 * @description 判断是否为自然数
 * @param value 待判断的值
 * @returns {boolean}
 */
export function isNaturalNumber(value: number): boolean {
  return value >= 0 && Number.isInteger(value);
}

/**
 * @function makeUint8Array
 * @description 创建一个合适长度的 Uint8Array
 * @param {number} byteLength 数据字节总大小
 * @param {number} pageSize 缓冲区页大小
 * @returns {Uint8Array}
 */
export function makeUint8Array(byteLength: number, pageSize: number): Uint8Array {
  if (byteLength > pageSize) {
    return new Uint8Array(Math.ceil(byteLength / pageSize) * pageSize);
  }

  return new Uint8Array(pageSize);
}
