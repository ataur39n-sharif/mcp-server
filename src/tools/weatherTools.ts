import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const registerWeatherTools = (server: McpServer) => {
  server.tool(
    "fetch-weather",
    { city: z.string() },
    async ({ city }) => {
      const response = await fetch(`https://api.weather.com/${city}`);
      const data = await response.text();
      return {
        content: [{ type: "text", text: data }]
      };
    }
  );
};