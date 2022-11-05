/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import legacy from "@vitejs/plugin-legacy"

const PORT = 5173// } = process.env


// https://vitejs.dev/config/
/** @type {import("vite").UserConfig} */
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults"]
    })
  ],
  server: {
    port: PORT,
    strictPort: true,
    // Defines the origin of the generated asset URLs during development, for backend server:
    origin: "http://localhost:8080",
    // don't reload on server file changes:
    watch: {
      ignored: ["server/"]
    }
  },
  define: {
    "import.meta.vitest": undefined,
    "import.meta.DEBUG": undefined
  },
  // for Bootstrap Sass lang and SCSS:
  resolve: {
    alias: {
      "~bootstrap": "node_modules/bootstrap"
    }
  },
  build: {
    // generate a manifest.json file in outDir that contains a mapping of non-hashed asset filenames to their hashed versions, used by the server framework to render the correct asset links:
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry point for Rollup bundler:
      input: "/src/main.tsx",
      output: {
        entryFileNames: "assets/main.js",
        assetFileNames: "assets/[name].[ext]",
        format: "es"
      }
    }
  }
})
