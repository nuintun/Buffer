/**
 * @module examples
 */

import hex from './hex';
import Buffer from '../src';

let timer: number;
let index: number = 0;

const view: HTMLElement = document.getElementById('view') as HTMLElement;

function onStart() {
  onStop();

  const buffer: Buffer = new Buffer();

  buffer.write(`${++index}: A buffer tool for javascript.`);

  view.innerHTML = hex(buffer.bytes);

  timer = window.setTimeout(onStart, 16);
}

function onStop() {
  clearTimeout(timer);
}

(document.getElementById('start') as HTMLElement).addEventListener('click', onStart, false);
(document.getElementById('stop') as HTMLElement).addEventListener('click', onStop, false);
