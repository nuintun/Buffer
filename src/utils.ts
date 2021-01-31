/**
 * @module utils
 */

/**
 * @function calcBestLength
 * @description 计算适合的 ByteArray 长度
 * @param {number} length 数据字节总大小
 * @param {number} pageSize 缓冲区页大小
 * @returns {number}
 */
export function calcBestLength(length: number, pageSize: number): number {
  if (length > <number>pageSize) {
    const pages: number = <number>Math.ceil(length / pageSize);

    return pages * pageSize;
  } else {
    return length;
  }
}

/**
 * @function stringEncode
 * @description 用指定编码编码字符串
 * @param {string} value 需要编码的字符串
 * @param {string} encoding 字符串编码
 * @returns {ArrayBuffer}
 */
export function stringEncode(value: string, encoding: string): ArrayBuffer {
  const formatted = encoding.toUpperCase();

  if (formatted == 'UTF8' || formatted == 'UTF-8') {
    return String.UTF8.encode(value);
  }

  if (formatted == 'UTF16' || formatted == 'UTF-16') {
    return String.UTF16.encode(value);
  }

  throw new TypeError('Unsupported encoding ' + encoding);
}

/**
 * @function stringDecode
 * @description 用指定编码解码字符串数据
 * @param {ArrayBuffer} buffer 需要解码的字符串数据
 * @param {string} encoding 字符串编码
 * @returns {string}
 */
export function stringDecode(buffer: ArrayBuffer, encoding: string): string {
  const formatted = encoding.toUpperCase();

  if (formatted == 'UTF8' || formatted == 'UTF-8') {
    return String.UTF8.decode(buffer);
  }

  if (formatted == 'UTF16' || formatted == 'UTF-16') {
    return String.UTF16.decode(buffer);
  }

  throw new TypeError('Unsupported encoding ' + encoding);
}

/**
 * @function calcSubLength
 * @description 通过开始和结束索引计算截取长度
 * @param {number} length 总长
 * @param {number} begin 开始索引
 * @param {number} end 结束索引
 * @returns {number}
 */
export function calcSubLength(length: number, begin: number, end: number): number {
  let diff: number = 0;

  if (length > 0 && begin >= 0) {
    if (end < 0) {
      diff = length + (end - begin);
    } else if (end > 0) {
      diff = <number>Math.min(length, Math.max(0, end - begin));
    }
  }

  return diff;
}
