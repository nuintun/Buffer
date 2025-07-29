/**
 * @module examples
 */

import { hexdump } from './hexdump';
import { Buffer, Endian, endianness } from '@nuintun/buffer';

let raf: number;
let index: number = 0;

const start: HTMLElement = document.getElementById('start') as HTMLElement;
const stop: HTMLElement = document.getElementById('stop') as HTMLElement;
const view: HTMLTextAreaElement = document.getElementById('view') as HTMLTextAreaElement;

function onStart() {
  onStop();

  const timeStamp: number = window.performance.now();

  const buffer: Buffer = new Buffer();

  buffer.write(`${++index}: A buffer tool for javascript.`);

  const performance: number = window.performance.now() - timeStamp;

  view.value = `${hexdump(buffer.bytes)}\r\n\r\nendianness: ${Endian[endianness()]}\r\nperformance: ${performance}ms`;

  raf = window.requestAnimationFrame(onStart);
}

function onStop() {
  window.cancelAnimationFrame(raf);
}

start.addEventListener('click', onStart, false);
stop.addEventListener('click', onStop, false);
