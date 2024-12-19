/**
 * @module errors
 */

// 未支持的编码格式
export function encodingInvalid(encoding: string): string {
  return 'unsupported encoding ' + encoding;
}

// 未知字节序
export const unknownEndianness = 'unknown endianness';

// 非法长度
export const lengthInvalid = 'invalid buffer length';

// 非法读写指针
export const offsetInvalid = 'invalid buffer offset';

// 数据读取溢出
export const readOverflow = 'read is outside the bounds of the Buffer';

// 读写指针溢出
export const offsetOverflow = 'offset is outside the bounds of the Buffer';
