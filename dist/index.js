"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_crypto_1 = require("node:crypto");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Map to store transports by session ID
const transports = {};
// Handle POST requests for client-to-server communication
app.post('/mcp', async (req, res) => {
    // Check for existing session ID
    const sessionId = req.headers['mcp-session-id'];
    let transport;
    if (sessionId && transports[sessionId]) {
        // Reuse existing transport
        transport = transports[sessionId];
    }
    else if (!sessionId && (0, types_js_1.isInitializeRequest)(req.body)) {
        // New initialization request
        transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
            sessionIdGenerator: () => (0, node_crypto_1.randomUUID)(),
            onsessioninitialized: (sessionId) => {
                // Store the transport by session ID
                transports[sessionId] = transport;
            }
        });
        // Clean up transport when closed
        transport.onclose = () => {
            if (transport.sessionId) {
                delete transports[transport.sessionId];
            }
        };
        const server = new mcp_js_1.McpServer({
            name: "example-server",
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
        // Connect to the MCP server
        await server.connect(transport);
    }
    else {
        // Invalid request
        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided',
            },
            id: null,
        });
        return;
    }
    // Handle the request
    await transport.handleRequest(req, res, req.body);
});
// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (req, res) => {
    const sessionId = req.headers['mcp-session-id'];
    if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
    }
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
};
// Handle GET requests for server-to-client notifications via SSE
app.get('/mcp', handleSessionRequest);
// Handle DELETE requests for session termination
app.delete('/mcp', handleSessionRequest);
app.listen(3000);
