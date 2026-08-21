import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Fail with a clear error instead of silently jumping to 5174, 5175...
    // when 5173 is already in use. A silent port switch changes the
    // browser origin, and localStorage (where Admin edits are saved)
    // is scoped per-origin — so a "vanished" edit is usually just data
    // saved under the previous port.
    strictPort: true,
  }
})