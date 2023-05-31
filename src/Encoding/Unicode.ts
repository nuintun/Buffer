/**
 * @module Unicode
 */

export type TypeArray = typeof Uint16Array | typeof Uint32Array;

/**
 * @function encode
 * @param {string} input
 * @param {TypeArray} Buffer
 * @returns {Uint8Array}
 */
export function encode(input: string, TypeArray: TypeArray): Uint8Array {
  const { length } = input;
  const array = new TypeArray(length);

  for (let i = 0; i < length; i++) {
    array[i] = input.codePointAt(i) || 0;
  }

  return new Uint8Array(array.buffer);
}

/**
 * @function decode
 * @param {BufferSource} input
 * @param {TypeArray} Buffer
 * @returns {string}
 */
export function decode(input: BufferSource, TypeArray: TypeArray): string {
  let result = '';

  const array = new TypeArray(ArrayBuffer.isView(input) ? input.buffer : input);

  for (const code of array) {
    result += String.fromCodePoint(code);
  }

  return result;
}
