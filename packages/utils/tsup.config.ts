import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.{ts,tsx}'],
  clean: true,
  format: ['cjs', 'esm'],
  dts: true,
})
