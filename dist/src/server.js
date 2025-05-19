"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMCPServer = void 0;
const express_1 = __importDefault(require("express"));
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const server_config_1 = require("./config/server.config");
const tools_1 = require("./tools");
const resources_1 = require("./resources");
const sessionManager_1 = require("./transport/sessionManager");
class CustomMCPServer {
    app = (0, express_1.default)();
    sessionManager = new sessionManager_1.SessionManager();
    constructor() {
        this.app.use(express_1.default.json());
        this.setupRoutes();
    }
    setupRoutes() {
        this.app.post('/mcp', this.handlePost.bind(this));
        this.app.get('/mcp', this.handleSessionRequest.bind(this));
        this.app.delete('/mcp', this.handleSessionRequest.bind(this));
    }
    async handlePost(req, res) {
        const sessionId = req.headers['mcp-session-id'];
        if (sessionId) {
            const transport = this.sessionManager.getTransport(sessionId);
            if (!transport) {
                res.status(400).send('Invalid session ID');
                return;
            }
            await transport.handleRequest(req, res, req.body);
            return;
        }
        if ((0, types_js_1.isInitializeRequest)(req.body)) {
            const transport = this.sessionManager.createTransport();
            const server = new mcp_js_1.McpServer(server_config_1.SERVER_CONFIG);
            (0, tools_1.registerAllTools)(server);
            (0, resources_1.registerAllResources)(server);
            await server.connect(transport);
            await transport.handleRequest(req, res, req.body);
            return;
        }
        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided',
            },
            id: null,
        });
    }
    async handleSessionRequest(req, res) {
        const sessionId = req.headers['mcp-session-id'];
        if (!sessionId) {
            res.status(400).send('Missing session ID');
            return;
        }
        const transport = this.sessionManager.getTransport(sessionId);
        if (!transport) {
            res.status(400).send('Invalid session ID');
            return;
        }
        await transport.handleRequest(req, res);
    }
    start() {
        this.app.listen(server_config_1.SERVER_CONFIG.port, () => {
            console.log(`MCP Server listening on port ${server_config_1.SERVER_CONFIG.port}`);
        });
    }
}
exports.CustomMCPServer = CustomMCPServer;
