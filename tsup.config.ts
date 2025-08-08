import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'index.ts',
    'src/**/*.{ts,js}'
  ],
  outDir: 'dist',
  format: ['esm'],
  sourcemap: true,
  clean: true,
  dts: true,
  splitting: false,
  target: 'es2022',
  alias: {
    '@models': './src/models',
    '@controllers': './src/controllers',
    '@routes': './src/routes',
    '@services': './src/services',
    '@utils': './src/utils',
    '#types': './src/types',
  },
})
