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
      diff = Math.min(length, Math.max(0, end - begin));
    }
  }

  return diff;
}
