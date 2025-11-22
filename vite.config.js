import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(() => {
    // Production/Library build mode
    const libConfig = {
        build: {
            lib: {
                entry: {
                    index: resolve(import.meta.dirname, 'index.js'),
                },
            },
            rollupOptions: {
                external: ['react', 'react-dom', '@preact/signals-core', '@preact/signals-react', 'mutative'],
                input: {
                    index: resolve(import.meta.dirname, 'index.js'),
                },
                output: [
                    {
                        format: 'es',
                        entryFileNames: 'reactSetSignal.js',
                        assetFileNames: 'assets/[name][extname]',
                    }
                ]
            },
            sourcemap: true,
        }
    }

    return libConfig;
})