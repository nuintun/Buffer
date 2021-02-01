/**
 * @module UTF8
 */

// 编码器实例
const encoder: TextEncoder = new TextEncoder();
// 解码器实例
const decoder: TextDecoder = new TextDecoder();

/**
 * @function encode
 * @param {string} input
 * @returns {Uint8Array}
 */
export const encode: (input?: string) => Uint8Array = encoder.encode.bind(encoder);

/**
 * @function decode
 * @param {BufferSource} input
 * @returns {string}
 */
export const decode: (input?: BufferSource) => string = decoder.decode.bind(decoder);
