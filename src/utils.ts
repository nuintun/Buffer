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
export function calcBufferLength(length: number, pageSize: number): number {
  if (length > pageSize) {
    const pages: number = Math.ceil(length / pageSize);

    return pages * pageSize;
  } else {
    return length;
  }
}
