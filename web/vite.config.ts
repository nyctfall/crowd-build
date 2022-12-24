/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import legacy from "@vitejs/plugin-legacy"
import path from "node:path"
import dotenv from "dotenv"

// get environment variables for (PROJECT_ROOT)/.env file:
dotenv.config({
  path: path.resolve(__dirname, "../.env")
})

// MUST COME AFTER dotenv.config():
const {
  // defines the port of the backend server:
  PORT = 8080,
  // for production, URL of hosting website:
  ORIGIN,
  // port for vite dev server:
  VITE_PORT = 5173
} = process.env

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults"]
    })
  ],
  server: {
    port: Number(VITE_PORT),
    origin: ORIGIN ?? `http://localhost:${PORT}`,
    strictPort: true
  },
  define: {
    "import.meta.vitest": undefined,
    "import.meta.DEBUG": undefined
  },
  // for Bootstrap Sass lang and SCSS:
  resolve: {
    alias: {
      "~bootstrap": "node_modules/bootstrap",
      // absolute path alias is used so all files can import it regardless of their location,
      // necessary because of the issue here:
      /**
       @link https://github.com/vitejs/vite/issues/1491 comment by "yyx990803" (Evan You)

       1. Make sure you have your local linked packages also listed in your example (vite) package's dependencies list
       2. If listed, Vite 2 will auto detect linked packages and you shouldn't need to use optimizeDeps.link
       3. If your ui module packages define entry points to built files in their package.json, you will need to configure an alias in the example project to redirect to their source entry instead.
       */
      "~types": `${path.resolve(__dirname, "./node_modules/~types/")}`
    }
  },
  // optimizeDeps: {
  //   include: ["~types"],
  // },
  build: {
    emptyOutDir: false,
    // commonjsOptions: {
    //   include: [/~types/, /node_modules/]
    // },
    outDir: "../dist",
    // generate a manifest.json file in outDir that contains a mapping of non-hashed asset filenames to their hashed versions, used by the server framework to render the correct asset links:
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry point for Rollup bundler:
      input: "/src/main.tsx",
      output: {
        entryFileNames: "assets/main.js",
        assetFileNames: "assets/[name].[ext]",
        chunkFileNames: "assets/[name].js",
        format: "es"
      }
    }
  }
})
