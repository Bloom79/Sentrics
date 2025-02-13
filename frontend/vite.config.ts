import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const VITE_SUPABASE_URL = "https://zcudjmlgfwhecjseybrl.supabase.co"
const VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdWRqbWxnZndoZWNqc2V5YnJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxOTcwMjUsImV4cCI6MjA1MTc3MzAyNX0.y6h_tUWvXfoeCMG36tdL20DfBqKhsKPqq8aaw10rie4"

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Debugging environment variables
  console.log("Supabase URL:", env.VITE_SUPABASE_URL);
  console.log("Supabase ANON KEY:", env.VITE_SUPABASE_ANON_KEY);

  return {
    server: {
      port: 8080,
      host: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(VITE_SUPABASE_ANON_KEY)
    }
  };
});
