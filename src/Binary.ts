/**
 * @module Binary
 */

/**
 * @type {string[]}
 * @description 已获得的二进制映射表
 */
export const mapping: string[] = [];

// 生成映射表
for (let code = 0; code < 256; code++) {
  mapping[code] = String.fromCharCode(code);
}
