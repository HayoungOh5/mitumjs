// rollup.config.js

import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.cjs.cjs',
      format: 'cjs',
      exports: 'named'
    },
    plugins: [
      typescript()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.esm.mjs',
      format: 'esm'
    },
    plugins: [
      typescript()
    ]
  }
];