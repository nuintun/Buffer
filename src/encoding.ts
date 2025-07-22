/**
 * @module encoding
 */

import { encodingInvalid } from './errors';

export interface TextEncode {
  /**
   * @function encode
   * @description 用指定编码编码字符串
   * @param {string} content 待编码文本
   * @param {string} encoding 编码类型
   * @returns {Uint8Array}
   */
  (content: string, encoding: string): Uint8Array;
}

export interface TextDecode {
  /**
   * @function decode
   * @description 用指定编码解码字节数组
   * @param {Uint8Array} bytes 待解码字节数组
   * @param {string} encoding 编码类型
   * @returns {string}
   */
  (bytes: Uint8Array, encoding: string): string;
}

/**
 * @function encodeSBSC
 * @description 单字节字符编码
 * @param {string} content 文本内容
 * @param {number} maxCode 最大编码
 * @returns {Uint8Array}
 */
function encodeSBSC(content: string, maxCode: number): Uint8Array {
  const bytes: number[] = [];

  for (const character of content) {
    const code = character.codePointAt(0);

    // If gt max code, push "?".
    bytes.push(code == null || code > maxCode ? 63 : code);
  }

  return new Uint8Array(bytes);
}

/**
 * @function swapEndian
 * @description 翻转字节序
 * @param {number} value 待翻转字节序的值
 * @returns {number}
 */
function swapEndian(value: number): number {
  return ((value & 0xff) << 8) | ((value >> 8) & 0xff);
}

/**
 * @function encodeUTF16
 * @param {string} input 待编码字符串
 * @param {boolean} [littleEndian] 是否使用小端字节序
 * @returns {Uint8Array}
 */
function encodeUTF16(input: string, littleEndian: boolean): Uint8Array {
  let offset = 0;

  // 分配内存
  const codes = new Uint16Array(input.length);

  for (const char of input) {
    const code = char.codePointAt(0)!;

    if (code > 0xffff) {
      // 代理对处理
      const high = 0xd800 | ((code - 0x10000) >> 10);
      const low = 0xdc00 | (code & 0x3ff);

      codes[offset++] = littleEndian ? high : swapEndian(high);
      codes[offset++] = littleEndian ? low : swapEndian(low);
    } else {
      codes[offset++] = littleEndian ? code : swapEndian(code);
    }
  }

  return new Uint8Array(codes.buffer, 0, offset * 2);
}

export function encode(content: string, encoding: string): Uint8Array {
  switch (encoding.toLowerCase()) {
    case 'ascii':
      return encodeSBSC(content, 0x7f);
    case 'latin1':
      return encodeSBSC(content, 0xff);
    case 'utf8':
    case 'utf-8':
      return new TextEncoder().encode(content);
    case 'utf16le':
    case 'utf-16le':
      return encodeUTF16(content, true);
    case 'utf16be':
    case 'utf-16be':
      return encodeUTF16(content, false);
    default:
      throw new Error(encodingInvalid(encoding));
  }
}

export function decode(bytes: Uint8Array, encoding: string): string {
  try {
    return new TextDecoder(encoding).decode(bytes);
  } catch {
    throw new Error(encodingInvalid(encoding));
  }
}
