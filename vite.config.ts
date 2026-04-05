import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

const staticPagesBuild = process.env.STATIC_PAGES_BUILD === 'true'

const config = defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [
    devtools(),
    ...(staticPagesBuild
      ? []
      : [cloudflare({ viteEnvironment: { name: 'ssr' } })]),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: true,
        crawlLinks: true,
        autoSubfolderIndex: true,
      },
    }),
    viteReact(),
  ],
})

export default config
