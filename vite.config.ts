/** @type {import('vite').UserConfig} */
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: Number(env.PORT),
    },
    test: {
      environment: "jsdom",
      includeSource: ["src/**/*.{ts,js}"],
      coverage: {
        provider: "istanbul",
        reporter: ["text", "json", "html"],
        include: ["src/"],
        exclude: ["node_modules/"],
        thresholdAutoUpdate: true,
        lines: 60.0,
        functions: 60.0,
        branches: 60.0,
        statements: 60.0,
        cleanOnRerun: true,
      },
    },
  };
});
