import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { searchPlaces } from "./lib/placesSearch";

function placesDevApi(env: Record<string, string>): Plugin {
  return {
    name: "places-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url ?? "";
        if (!rawUrl.startsWith("/api/places")) {
          next();
          return;
        }

        const url = new URL(rawUrl, "http://localhost");
        const query = url.searchParams.get("query");
        if (!query) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "query required" }));
          return;
        }

        const apiKey =
          env.GOOGLE_MAPS_API_KEY ?? env.VITE_GOOGLE_MAPS_API_KEY;
        const data = await searchPlaces(query, apiKey);

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-store");
        res.end(JSON.stringify(data));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET;
  const useLocalPlacesApi = !apiProxyTarget;

  return {
    plugins: [react(), ...(useLocalPlacesApi ? [placesDevApi(env)] : [])],
    server: apiProxyTarget
      ? {
          proxy: {
            "/api": {
              target: apiProxyTarget,
              changeOrigin: true,
              rewrite: (path) => path,
            },
          },
        }
      : undefined,
  };
});
