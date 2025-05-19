import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerMathTools } from "./mathTools";
import { registerWeatherTools } from "./weatherTools";

export const registerAllTools = (server: McpServer) => {
  registerMathTools(server);
  registerWeatherTools(server);
};