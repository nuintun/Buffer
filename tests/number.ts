/**
 * @module number
 */

// 使用位运算将数字转换为8位有符号整数
export function toInt8(value: number): number {
  return (value << 24) >> 24;
}

// 使用位运算将数字转换为8位无符号整数
export function toUint8(value: number): number {
  return value & 0xff;
}

// 使用位运算将数字转换为16位有符号整数
export function toInt16(value: number): number {
  return (value << 16) >> 16;
}

// 使用位运算将数字转换为16位无符号整数
export function toUint16(value: number): number {
  return value & 0xffff;
}

// 使用位运算将数字转换为32位有符号整数
export function toInt32(value: number): number {
  return value | 0;
}

// 使用位运算将数字转换为32位无符号整数
export function toUint32(value: number): number {
  return value >>> 0;
}

// 使用内置方法将数字转换为64位有符号整数
export function toInt64(value: bigint): bigint {
  return BigInt.asIntN(64, value);
}

// 使用内置方法将数字转换为64位无符号整数
export function toUint64(value: bigint): bigint {
  return BigInt.asUintN(64, value);
}

// 使用内置方法将数字转换为32位有符号浮点数
export function toFloat32(value: number): number {
  const buffer = new ArrayBuffer(4);
  const dataView = new DataView(buffer);

  dataView.setFloat32(0, value);

  return dataView.getFloat32(0);
}

// 使用内置方法将数字转换为64位有符号浮点数
export function toFloat64(value: number): number {
  const buffer = new ArrayBuffer(8);
  const dataView = new DataView(buffer);

  dataView.setFloat64(0, value);

  return dataView.getFloat64(0);
}
