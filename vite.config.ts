import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: './packages/super-wheel.ts',
            name: 'SuperWheel',
            formats: ['esm', 'umd']
        }
    }
})
