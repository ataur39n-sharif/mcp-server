import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const registerMathTools = (server: McpServer) => {
  server.tool(
    "add",
    { a: z.number(), b: z.number() },
    async ({ a, b }) => ({
      content: [{ type: "text", text: String(a + b) }]
    })
  );

  server.tool(
    "calculate-bmi",
    {
      weightKg: z.number(),
      heightM: z.number()
    },
    async ({ weightKg, heightM }) => ({
      content: [{
        type: "text",
        text: String(weightKg / (heightM * heightM))
      }]
    })
  );
};