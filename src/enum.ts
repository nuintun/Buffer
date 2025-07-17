/**
 * @module enum
 */

// 字节序类型
export enum Endian {
  Big,
  Little
}

// 基础类型空间占用
export const enum SizeOf {
  INT8 = 1,
  UINT8 = 1,
  INT16 = 2,
  UINT16 = 2,
  INT32 = 4,
  UINT32 = 4,
  INT64 = 8,
  UINT64 = 8,
  FLOAT32 = 4,
  FLOAT64 = 8
}
