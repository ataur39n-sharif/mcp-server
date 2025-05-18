"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
// Create an MCP server
const server = new mcp_js_1.McpServer({
    name: "Demo",
    version: "1.0.0"
});
// Add an addition tool
server.tool("add", { a: zod_1.z.number(), b: zod_1.z.number() }, async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
}));
// Add a dynamic greeting resource
server.resource("greeting", new mcp_js_1.ResourceTemplate("greeting://{name}", { list: undefined }), async (uri, { name }) => ({
    contents: [{
            uri: uri.href,
            text: `Hello, ${name}!`
        }]
}));
// Simple tool with parameters
server.tool("calculate-bmi", {
    weightKg: zod_1.z.number(),
    heightM: zod_1.z.number()
}, async ({ weightKg, heightM }) => ({
    content: [{
            type: "text",
            text: String(weightKg / (heightM * heightM))
        }]
}));
// Async tool with external API call
server.tool("fetch-weather", { city: zod_1.z.string() }, async ({ city }) => {
    const response = await fetch(`https://api.weather.com/${city}`);
    const data = await response.text();
    return {
        content: [{ type: "text", text: data }]
    };
});
// Start receiving messages on stdin and sending messages on stdout
const transport = new stdio_js_1.StdioServerTransport();
const main = async () => {
    server.connect(transport);
};
main();
