// rollup.config.js

import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.cjs.js',
      format: 'cjs'
    },
    plugins: [
      typescript()
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.esm.js',
      format: 'esm'
    },
    plugins: [
      typescript()
    ]
  }
];