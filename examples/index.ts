/**
 * @module examples
 */

import hex from './hex';
import Buffer from '../src';

let raf: number;
let index: number = 0;

const view: HTMLElement = document.getElementById('view') as HTMLElement;

function onStart() {
  onStop();

  const buffer: Buffer = new Buffer();

  buffer.write(`${++index}: A buffer tool for javascript.`);

  view.innerHTML = hex(buffer.bytes);

  raf = window.requestAnimationFrame(onStart);
}

function onStop() {
  window.cancelAnimationFrame(raf);
}

(document.getElementById('start') as HTMLElement).addEventListener('click', onStart, false);
(document.getElementById('stop') as HTMLElement).addEventListener('click', onStop, false);
