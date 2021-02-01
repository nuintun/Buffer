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
export function encode(input: string, Buffer: TypeArray): Uint8Array {
  const { length }: string = input;
  const raw: InstanceType<TypeArray> = new Buffer(length);

  for (let i: number = 0; i < length; i++) {
    raw[i] = input.codePointAt(i) || 0;
  }

  return new Uint8Array(raw.buffer);
}

/**
 * @function decode
 * @param {BufferSource} input
 * @param {TypeArray} Buffer
 * @returns {string}
 */
export function decode(input: BufferSource, Buffer: TypeArray): string {
  const buffer: ArrayBuffer = ArrayBuffer.isView(input) ? input.buffer : input;
  const raw: InstanceType<TypeArray> = new Buffer(buffer);
  const { length }: InstanceType<TypeArray> = raw;

  let result: string = '';

  for (let i: number = 0; i < length; i++) {
    result += String.fromCodePoint(raw[i]);
  }

  return result;
}
