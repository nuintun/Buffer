/**
 * @module Encoding
 */

import * as UTF8 from './UTF8';
import * as errors from '../errors';
import * as Unicode from './Unicode';

/**
 * @function encode
 * @description 用指定编码编码字符串
 * @param {string} input 需要编码的字符串
 * @param {string} [encoding] 字符串编码
 * @returns {Uint8Array}
 */
export function encode(input: string, encoding: string = 'UTF8'): Uint8Array {
  switch (encoding.toUpperCase()) {
    case 'UTF8':
    case 'UTF-8':
      return UTF8.encode(input);
    case 'UTF16':
    case 'UTF-16':
      return Unicode.encode(input, Uint16Array);
    case 'UTF32':
    case 'UTF-32':
      return Unicode.encode(input, Uint32Array);
    default:
      throw new TypeError(errors.encodingInvalid(encoding));
  }
}

/**
 * @function decode
 * @description 用指定编码解码字符串数据
 * @param {BufferSource} input 需要解码的字符串数据
 * @param {string} [encoding] 字符串编码
 * @returns {string}
 */
export function decode(input: BufferSource, encoding: string = 'UTF8'): string {
  switch (encoding.toUpperCase()) {
    case 'UTF8':
    case 'UTF-8':
      return UTF8.decode(input);
    case 'UTF16':
    case 'UTF-16':
      return Unicode.decode(input, Uint16Array);
    case 'UTF32':
    case 'UTF-32':
      return Unicode.decode(input, Uint32Array);
    default:
      throw new TypeError(errors.encodingInvalid(encoding));
  }
}
