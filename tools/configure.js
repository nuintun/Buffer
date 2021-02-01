/**
 * @module configure
 */

import clean from './clean';
import treeShake from './plugins/tree-shake';
import typescript from 'rollup-plugin-typescript2';

export default function configure(esnext) {
  clean(esnext ? ['esm', 'typings'] : ['cjs']);

  const tsconfigOverride = { compilerOptions: { declaration: true, declarationDir: 'typings' } };
  const tsconfig = esnext ? { tsconfigOverride, clean: true, useTsconfigDeclarationDir: true } : { clean: true };

  return {
    input: 'src/index.ts',
    output: {
      interop: false,
      exports: 'auto',
      esModule: false,
      format: esnext ? 'esm' : 'cjs',
      dir: esnext ? 'esnext' : 'es5'
    },
    external: ['tslib'],
    onwarn(error, warn) {
      if (error.code !== 'CIRCULAR_DEPENDENCY') {
        warn(error);
      }
    },
    plugins: [typescript(tsconfig), treeShake()]
  };
}
