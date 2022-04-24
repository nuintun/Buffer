/**
 * @module errors
 */

// 未支持的编码格式
export function encodingInvalid(encoding: string): string {
  return 'Unsupported encoding ' + encoding;
}

// 未知字节序
export const unknownEndianness = 'Unknown endianness';

// 非法长度
export const lengthInvalid: string = 'Invalid buffer length';

// 非法读写指针
export const offsetInvalid: string = 'Invalid buffer offset';

// 数据读取溢出
export const readOverflow: string = 'Read is outside the bounds of the Buffer';

// 读写指针溢出
export const offsetOverflow: string = 'Offset is outside the bounds of the Buffer';
