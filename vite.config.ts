import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import {  tanstackRouter } from '@tanstack/router-plugin/vite'
import path from 'node:path'


// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
    tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        generatedRouteTree: './src/routeTree.gen.ts',
        routesDirectory: './src/pages'
    }),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
})
