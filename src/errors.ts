/**
 * @module errors
 */

/**
 * @function encodingInvalid
 * @description 未支持的编码格式
 * @param encoding 编码格式
 */
export function encodingInvalid(encoding: string): string {
  return 'unsupported encoding ' + encoding;
}

// 非法读写指针
export const offsetInvalid = 'invalid buffer offset';

// 非法长度
export const lengthInvalid = 'invalid buffer length';

// 未知字节序
export const unknownEndianness = 'unknown endianness';

// 数据读取长度非法
export const readLengthInvalid = 'invalid read length';

// 数据读取溢出
export const readOverflow = 'read is outside the bounds of the Buffer';

// 读写指针溢出
export const offsetOverflow = 'offset is outside the bounds of the Buffer';
