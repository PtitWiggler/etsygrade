/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    rolldownOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        'content/scraper': resolve(__dirname, 'src/content/scraper.ts'),
        'background/service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  },
  test: {
    globals: true, // permet d'utiliser describe/it/expect sans les importer partout
  },
})
