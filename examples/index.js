/**
 * @module Buffer
 * @license MIT
 * @version 0.0.1
 * @author nuintun
 * @description A buffer tool for javascript.
 * @see https://github.com/nuintun/Buffer#readme
 */

(function (factory) {
  typeof define === 'function' && define.amd ? define('buffer', factory) : factory();
})(function () {
  'use strict';

  /**
   * @module hex
   */
  /**
   * @type {string[]}
   * @description 已获得的 hex 映射表
   */
  var mapping$1 = [];
  // 字母映射表
  var alphabet = '0123456789ABCDEF';
  // 生成映射表
  for (var i$1 = 0; i$1 < 16; ++i$1) {
    var i16 = i$1 * 16;
    for (var j = 0; j < 16; ++j) {
      mapping$1[i16 + j] = alphabet[i$1] + alphabet[j];
    }
  }
  /**
   * @function zero
   * @description 数字左边补零操作
   * @param {number} value
   * @param {number} max
   * @returns {string}
   */
  function zero(value, max) {
    return (value > 0xff ? value.toString(16) : mapping$1[value]).padStart(max, '0');
  }
  /**
   * @function hex
   * @function Hex 查看器
   * @param {Uint8Array} buffer
   * @returns {string}
   */
  function hex(buffer) {
    var length = buffer.length;
    var last = length % 16 || 16;
    var rows = Math.ceil(length / 16);
    var offsetLength = Math.max(6, length.toString(16).length);
    var rowBytes;
    var index = 0;
    var rowSpaces;
    var hex = 'OFFSET  ';
    for (var i = 0; i < 16; i++) {
      hex += ' '.concat(zero(i, 2));
    }
    hex += '\n';
    if (length) {
      hex += '\n';
    }
    for (var i = 0; i < rows; i++) {
      hex += ''.concat(zero(index, offsetLength), '  ');
      rowBytes = i === rows - 1 ? last : 16;
      rowSpaces = 16 - rowBytes;
      for (var j = 0; j < rowBytes; j++) {
        hex += ' '.concat(zero(buffer[index++], 2));
      }
      for (var j = 0; j <= rowSpaces; j++) {
        hex += '   ';
      }
      index -= rowBytes;
      for (var j = 0; j < rowBytes; j++) {
        var byte = buffer[index++];
        hex += (byte > 31 && byte < 127) || byte > 159 ? String.fromCharCode(byte) : '.';
      }
      hex += '\n';
    }
    return hex.trim();
  }

  /**
   * @module const
   */
  // 非法长度
  var LENGTH_INVALID = 'Invalid buffer length';
  // 非法读写指针
  var OFFSET_INVALID = 'Invalid buffer offset';
  // 数据读取溢出
  var READ_OVERFLOW = 'Read is outside the bounds of the Buffer';
  // 读写指针溢出
  var OFFSET_OVERFLOW = 'Offset is outside the bounds of the Buffer';

  /**
   * @module utils
   */
  /**
   * @function calcBufferLength
   * @description 计算适合的 Buffer 长度
   * @param {number} length 数据字节总大小
   * @param {number} pageSize 缓冲区页大小
   * @returns {number}
   */
  function calcBufferLength(length, pageSize) {
    if (length > pageSize) {
      var pages = Math.ceil(length / pageSize);
      return pages * pageSize;
    } else {
      return length;
    }
  }

  /**
   * @module Binary
   */
  /**
   * @type {string[]}
   * @description 已获得的二进制映射表
   */
  var mapping = [];
  // 生成映射表
  for (var i = 0; i < 256; i++) {
    mapping[i] = String.fromCharCode(i);
  }

  /**
   * @module UTF8
   */
  // 编码器实例
  var encoder = new TextEncoder();
  // 解码器实例
  var decoder = new TextDecoder();
  /**
   * @function encode
   * @param {string} input
   * @returns {Uint8Array}
   */
  var encode$2 = encoder.encode.bind(encoder);
  /**
   * @function decode
   * @param {BufferSource} input
   * @returns {string}
   */
  var decode$2 = decoder.decode.bind(decoder);

  /**
   * @module Unicode
   */
  /**
   * @function encode
   * @param {string} input
   * @param {TypeArray} Buffer
   * @returns {Uint8Array}
   */
  function encode$1(input, Buffer) {
    var length = input.length;
    var raw = new Buffer(length);
    for (var i = 0; i < length; i++) {
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
  function decode$1(input, Buffer) {
    var buffer = ArrayBuffer.isView(input) ? input.buffer : input;
    var raw = new Buffer(buffer);
    var length = raw.length;
    var result = '';
    for (var i = 0; i < length; i++) {
      result += String.fromCodePoint(raw[i]);
    }
    return result;
  }

  /**
   * @module Encoding
   */
  /**
   * @function encode
   * @description 用指定编码编码字符串
   * @param {string} input 需要编码的字符串
   * @param {string} [encoding] 字符串编码
   * @returns {Uint8Array}
   */
  function encode(input, encoding) {
    if (encoding === void 0) {
      encoding = 'UTF8';
    }
    switch (encoding.toUpperCase()) {
      case 'UTF8':
      case 'UTF-8':
        return encode$2(input);
      case 'UTF16':
      case 'UTF-16':
        return encode$1(input, Uint16Array);
      case 'UTF32':
      case 'UTF-32':
        return encode$1(input, Uint32Array);
      default:
        throw new TypeError('Unsupported encoding ' + encoding);
    }
  }
  /**
   * @function decode
   * @description 用指定编码解码字符串数据
   * @param {BufferSource} input 需要解码的字符串数据
   * @param {string} [encoding] 字符串编码
   * @returns {string}
   */
  function decode(input, encoding) {
    if (encoding === void 0) {
      encoding = 'UTF8';
    }
    switch (encoding.toUpperCase()) {
      case 'UTF8':
      case 'UTF-8':
        return decode$2(input);
      case 'UTF16':
      case 'UTF-16':
        return decode$1(input, Uint16Array);
      case 'UTF32':
      case 'UTF-32':
        return decode$1(input, Uint32Array);
      default:
        throw new TypeError('Unsupported encoding ' + encoding);
    }
  }

  /**
   * @module Buffer
   */
  // 字节序类型
  var Endian;
  (function (Endian) {
    Endian[(Endian['Big'] = 0)] = 'Big';
    Endian[(Endian['Little'] = 1)] = 'Little';
  })(Endian || (Endian = {}));
  /**
   * @function endianness
   * @description 获取系统默认字节序
   * @returns {Endian}
   */
  function endianness() {
    switch (new Uint8Array(new Uint32Array([0x12345678]))[0]) {
      case 0x12:
        return Endian.Big;
      case 0x78:
        return Endian.Little;
      default:
        throw new TypeError('Unknown endianness');
    }
  }
  /**
   * @class Buffer
   * @classdesc Buffer 类提供用于优化读取，写入以及处理二进制数据的方法和属性
   */
  var Buffer = /*#__PURE__*/ (function () {
    function Buffer(input, pageSize) {
      if (input === void 0) {
        input = 0;
      }
      if (pageSize === void 0) {
        pageSize = 4096;
      }
      // 已使用字节长度
      this._length = 0;
      // 读写指针位置
      this._offset = 0;
      this._pageSize = pageSize;
      if (input instanceof Uint8Array) {
        this._bytes = input;
        this._length = input.length;
        this._dataView = new DataView(input.buffer);
      } else {
        var bytes = new Uint8Array(calcBufferLength(input, pageSize));
        this._bytes = bytes;
        this._length = input;
        this._dataView = new DataView(bytes.buffer);
      }
    }
    Object.defineProperty(Buffer.prototype, 'offset', {
      /**
       * @public
       * @property {number} offset
       * @description 获取读写指针的位置
       * @returns {number}
       */
      get: function () {
        return this._offset;
      },
      /**
       * @public
       * @property {number} offset
       * @description 设置读写指针位置，以字节为单位
       * @description 下一次调用读写方法时将在此位置开始读写
       */
      set: function (value) {
        if (value < 0) {
          throw new RangeError(OFFSET_INVALID);
        }
        if (value > this._length) {
          throw new RangeError(OFFSET_OVERFLOW);
        }
        this._offset = value;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Buffer.prototype, 'length', {
      /**
       * @public
       * @property {number} length
       * @description 获取 Buffer 长度
       * @returns {number}
       */
      get: function () {
        return this._length;
      },
      /**
       * @public
       * @property {number} length
       * @description 设置 Buffer 长度
       * @description 如果将长度设置为小于当前长度的值，将会截断该字节数组
       * @description 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧
       */
      set: function (value) {
        if (value < 0) {
          throw new RangeError(LENGTH_INVALID);
        }
        if (value > this._bytes.length) {
          this.alloc(value - this._offset);
        } else {
          this._length = value;
          // 重置多余字节
          this._bytes.fill(0, value);
        }
        if (this._offset > value) {
          this._offset = value;
        }
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Buffer.prototype, 'buffer', {
      /**
       * @public
       * @property {ArrayBuffer} buffer
       * @description 获取 ArrayBuffer 缓冲区
       * @returns {ArrayBuffer}
       */
      get: function () {
        return this._bytes.buffer.slice(0, this._length);
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Buffer.prototype, 'bytes', {
      /**
       * @public
       * @property {Uint8Array} bytes
       * @description 获取 Uint8Array 缓冲区
       * @returns {Uint8Array}
       */
      get: function () {
        return this._bytes.slice(0, this._length);
      },
      enumerable: false,
      configurable: true
    });
    /**
     * @public
     * @method slice
     * @description 从指定开始和结束位置索引截取并返回新的 Buffer 对象
     * @param {number} [start] 截取开始位置索引
     * @param {number} [end] 截取结束位置索引
     * @returns {Buffer}
     */
    Buffer.prototype.slice = function (start, end) {
      var bytes = this._bytes.slice(start, end);
      return new Buffer(bytes, this._pageSize);
    };
    /**
     * @public
     * @method copyWithin
     * @description 从 Buffer 对象中将指定位置的数据复制到以 target 起始的位置
     * @param {number} target 粘贴开始位置索引
     * @param {number} start 复制开始位置索引
     * @param {number} [end] 复制结束位置索引
     * @returns {this}
     */
    Buffer.prototype.copyWithin = function (target, start, end) {
      this._bytes.copyWithin(target, start, end);
      return this;
    };
    /**
     * @protected
     * @method alloc
     * @description 分配指定长度的缓冲区大小，如果缓冲区溢出则刷新缓冲区
     * @param {number} length 分配字节长度
     */
    Buffer.prototype.alloc = function (length) {
      if (length > 0) {
        length += this.offset;
        if (length > this._bytes.length) {
          var bytes = new Uint8Array(calcBufferLength(length, this._pageSize));
          bytes.set(this._bytes);
          this._bytes = bytes;
          this._dataView = new DataView(bytes.buffer);
        }
        if (length > this._length) {
          this._length = length;
        }
      }
    };
    /**
     * @protected
     * @method seek
     * @description 移动读写指针
     * @param {number} offset 移动偏移量
     */
    Buffer.prototype.seek = function (offset) {
      this.offset = this._offset + offset;
    };
    /**
     * @protected
     * @method assertRead
     * @description 读取断言，防止越界读取
     * @param {number} length 断言字节长度
     */
    Buffer.prototype.assertRead = function (length) {
      if (this._offset + length > this._length) {
        throw new RangeError(READ_OVERFLOW);
      }
    };
    /**
     * @public
     * @method writeInt8
     * @description 在缓冲区中写入一个有符号整数
     * @param {number} value 介于 -128 和 127 之间的整数
     */
    Buffer.prototype.writeInt8 = function (value) {
      this.alloc(1 /* INT8 */);
      this._dataView.setInt8(this._offset, value);
      this.seek(1 /* INT8 */);
    };
    /**
     * @public
     * @method writeUint8
     * @description 在缓冲区中写入一个无符号整数
     * @param {number} value 介于 0 和 255 之间的整数
     */
    Buffer.prototype.writeUint8 = function (value) {
      this.alloc(1 /* UINT8 */);
      this._dataView.setUint8(this._offset, value);
      this.seek(1 /* UINT8 */);
    };
    /**
     * @method writeBoolean
     * @description 在缓冲区中写入布尔值，true 写 1，false写 0
     * @param {boolean} value 布尔值
     */
    Buffer.prototype.writeBoolean = function (value) {
      this.writeUint8(value ? 1 : 0);
    };
    /**
     * @method writeInt16
     * @description 在缓冲区中写入一个 16 位有符号整数
     * @param {number} value 要写入的 16 位有符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     */
    Buffer.prototype.writeInt16 = function (value, littleEndian) {
      this.alloc(2 /* INT16 */);
      this._dataView.setInt16(this._offset, value, littleEndian);
      this.seek(2 /* INT16 */);
    };
    /**
     * @method writeUint16
     * @description 在缓冲区中写入一个 16 位无符号整数
     * @param {number} value 要写入的 16 位无符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     */
    Buffer.prototype.writeUint16 = function (value, littleEndian) {
      this.alloc(2 /* UINT16 */);
      this._dataView.setUint16(this._offset, value, littleEndian);
      this.seek(2 /* UINT16 */);
    };
    /**
     * @method writeInt32
     * @description 在缓冲区中写入一个有符号的 32 位有符号整数
     * @param {number} value 要写入的 32 位有符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     */
    Buffer.prototype.writeInt32 = function (value, littleEndian) {
      this.alloc(4 /* INT32 */);
      this._dataView.setInt32(this._offset, value, littleEndian);
      this.seek(4 /* INT32 */);
    };
    /**
     * @method writeUint32
     * @description 在缓冲区中写入一个无符号的 32 位无符号整数
     * @param {number} value 要写入的 32 位无符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     */
    Buffer.prototype.writeUint32 = function (value, littleEndian) {
      this.alloc(4 /* UINT32 */);
      this._dataView.setUint32(this._offset, value, littleEndian);
      this.seek(4 /* UINT32 */);
    };
    /**
     * @method writeInt64
     * @description 在缓冲区中写入一个无符号的 64 位有符号整数
     * @param {bigint} value 要写入的 32 位有符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     */
    Buffer.prototype.writeInt64 = function (value, littleEndian) {
      this.alloc(8 /* INI64 */);
      this._dataView.setBigInt64(this._offset, value, littleEndian);
      this.seek(8 /* INI64 */);
    };
    /**
     * @method writeUint64
     * @description 在缓冲区中写入一个无符号的 64 位无符号整数
     * @param {bigint} value 要写入的 64 位无符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     */
    Buffer.prototype.writeUint64 = function (value, littleEndian) {
      this.alloc(8 /* UINT64 */);
      this._dataView.setBigUint64(this._offset, value, littleEndian);
      this.seek(8 /* UINT64 */);
    };
    /**
     * @method writeFloat32
     * @description 在缓冲区中写入一个 IEEE 754 单精度 32 位浮点数
     * @param {number} value 单精度 32 位浮点数
     * @param {boolean} [littleEndian] 是否为小端字节序
     */
    Buffer.prototype.writeFloat32 = function (value, littleEndian) {
      this.alloc(4 /* FLOAT32 */);
      this._dataView.setFloat32(this._offset, value, littleEndian);
      this.seek(4 /* FLOAT32 */);
    };
    /**
     * @method writeFloat64
     * @description 在缓冲区中写入一个 IEEE 754 双精度 64 位浮点数
     * @param {number} value 双精度 64 位浮点数
     * @param {boolean} [littleEndian] 是否为小端字节序
     */
    Buffer.prototype.writeFloat64 = function (value, littleEndian) {
      this.alloc(8 /* FLOAT64 */);
      this._dataView.setFloat64(this._offset, value, littleEndian);
      this.seek(8 /* FLOAT64 */);
    };
    Buffer.prototype.write = function (input, start, end) {
      var bytes;
      if (input instanceof Uint8Array) {
        bytes = input.subarray(start, end);
      } else {
        bytes = encode(input, start);
      }
      var length = bytes.length;
      if (length > 0) {
        this.alloc(length);
        this._bytes.set(bytes, this._offset);
        this.seek(length);
      }
    };
    /**
     * @method readInt8
     * @description 从缓冲区中读取有符号的整数
     * @returns {number} 介于 -128 和 127 之间的整数
     */
    Buffer.prototype.readInt8 = function () {
      this.assertRead(1 /* INT8 */);
      var value = this._dataView.getInt8(this._offset);
      this.seek(1 /* INT8 */);
      return value;
    };
    /**
     * @method readUint8
     * @description 从缓冲区中读取无符号的整数
     * @returns {number} 介于 0 和 255 之间的无符号整数
     */
    Buffer.prototype.readUint8 = function () {
      this.assertRead(1 /* UINT8 */);
      var value = this._dataView.getUint8(this._offset);
      this.seek(1 /* UINT8 */);
      return value;
    };
    /**
     * @method readBoolean
     * @description 从缓冲区中读取布尔值
     * @returns {boolean} 如果字节非零，则返回 true，否则返回 false
     */
    Buffer.prototype.readBoolean = function () {
      return Boolean(this.readUint8());
    };
    /**
     * @method readInt16
     * @description 从缓冲区中读取一个 16 位有符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     * @returns {number} 介于 -32768 和 32767 之间的 16 位有符号整数
     */
    Buffer.prototype.readInt16 = function (littleEndian) {
      this.assertRead(2 /* INT16 */);
      var value = this._dataView.getInt16(this._offset, littleEndian);
      this.seek(2 /* INT16 */);
      return value;
    };
    /**
     * @method readUint16
     * @description 从缓冲区中读取一个 16 位无符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     * @returns {number} 介于 0 和 65535 之间的 16 位无符号整数
     */
    Buffer.prototype.readUint16 = function (littleEndian) {
      this.assertRead(2 /* UINT16 */);
      var value = this._dataView.getUint16(this._offset, littleEndian);
      this.seek(2 /* UINT16 */);
      return value;
    };
    /**
     * @method readInt32
     * @description 从缓冲区中读取一个 32 位有符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     * @returns {number} 介于 -2147483648 和 2147483647 之间的 32 位有符号整数
     */
    Buffer.prototype.readInt32 = function (littleEndian) {
      this.assertRead(4 /* INT32 */);
      var value = this._dataView.getInt32(this._offset, littleEndian);
      this.seek(4 /* INT32 */);
      return value;
    };
    /**
     * @method readUint32
     * @description 从缓冲区中读取一个 32 位无符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     * @returns {number} 介于 0 和 4294967295 之间的 32 位无符号整数
     */
    Buffer.prototype.readUint32 = function (littleEndian) {
      this.assertRead(4 /* UINT32 */);
      var value = this._dataView.getUint32(this._offset, littleEndian);
      this.seek(4 /* UINT32 */);
      return value;
    };
    /**
     * @method readInt64
     * @description 从缓冲区中读取一个 64 位有符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     * @returns {bigint} 介于 -9223372036854775808 和 9223372036854775807 之间的 64 位有符号整数
     */
    Buffer.prototype.readInt64 = function (littleEndian) {
      this.assertRead(8 /* INI64 */);
      var value = this._dataView.getBigInt64(this._offset, littleEndian);
      this.seek(8 /* INI64 */);
      return value;
    };
    /**
     * @method readUint64
     * @description 从缓冲区中读取一个 64 位无符号整数
     * @param {boolean} [littleEndian] 是否为小端字节序
     * @returns {bigint} 介于 0 和 18446744073709551615 之间的 64 位无符号整数
     */
    Buffer.prototype.readUint64 = function (littleEndian) {
      this.assertRead(8 /* UINT64 */);
      var value = this._dataView.getBigUint64(this._offset, littleEndian);
      this.seek(8 /* UINT64 */);
      return value;
    };
    /**
     * @method readFloat32
     * @description 从缓冲区中读取一个 IEEE 754 单精度 32 位浮点数
     * @param {boolean} [littleEndian] 是否为小端字节序
     * @returns {number} 单精度 32 位浮点数
     */
    Buffer.prototype.readFloat32 = function (littleEndian) {
      this.assertRead(4 /* FLOAT32 */);
      var value = this._dataView.getFloat32(this._offset, littleEndian);
      this.seek(4 /* FLOAT32 */);
      return value;
    };
    /**
     * @method readFloat64
     * @description 从缓冲区中读取一个 IEEE 754 双精度 64 位浮点数
     * @param {boolean} [littleEndian] 是否为小端字节序
     * @returns {number} 双精度 64 位浮点数
     */
    Buffer.prototype.readFloat64 = function (littleEndian) {
      this.assertRead(8 /* FLOAT64 */);
      var value = this._dataView.getFloat64(this._offset, littleEndian);
      this.seek(8 /* FLOAT64 */);
      return value;
    };
    Buffer.prototype.read = function (length, encoding) {
      if (length >= 0) {
        var end = this._offset + length;
        if (end <= this._length) {
          var bytes = this._bytes.slice(this._offset, end);
          this.seek(length);
          if (arguments.length >= 2) {
            return decode(bytes, encoding);
          }
          return bytes;
        }
      }
      throw new RangeError(READ_OVERFLOW);
    };
    /**
     * @override
     * @method toString
     * @description 获取 Buffer 对象二进制编码字符串
     * @returns {string}
     */
    Buffer.prototype.toString = function () {
      // 二进制编码字符串
      var binary = '';
      // 提前获取 bytes，防止重复计算
      var bytes = this.bytes;
      var length = bytes.length;
      // 获取二进制编码
      for (var i = 0; i < length; i++) {
        binary += mapping[bytes[i]];
      }
      // 返回二进制编码
      return binary;
    };
    return Buffer;
  })();

  /**
   * @module examples
   */
  var raf;
  var index = 0;
  var start = document.getElementById('start');
  var stop = document.getElementById('stop');
  var view = document.getElementById('view');
  function onStart() {
    onStop();
    var timeStamp = window.performance.now();
    var buffer = new Buffer();
    buffer.write(''.concat(++index, ': A buffer tool for javascript.'));
    var performance = window.performance.now() - timeStamp;
    view.value = ''
      .concat(hex(buffer.bytes), '\r\n\r\nendianness: ')
      .concat(Endian[endianness()], '\r\nperformance: ')
      .concat(performance, 'ms');
    raf = window.requestAnimationFrame(onStart);
  }
  function onStop() {
    window.cancelAnimationFrame(raf);
  }
  start.addEventListener('click', onStart, false);
  stop.addEventListener('click', onStop, false);
});
