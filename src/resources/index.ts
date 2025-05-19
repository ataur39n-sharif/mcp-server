import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGreetingResource } from "./greetingResource";

export const registerAllResources = (server: McpServer) => {
  registerGreetingResource(server);
};