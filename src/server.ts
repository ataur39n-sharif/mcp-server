import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { SERVER_CONFIG } from "./config/server.config";
import { registerAllTools } from "./tools";
import { registerAllResources } from "./resources";
import { SessionManager } from "./transport/sessionManager";

export class CustomMCPServer {
  private app = express();
  private sessionManager = new SessionManager();

  constructor() {
    this.app.use(express.json());
    this.setupRoutes();
  }

  private setupRoutes() {
    this.app.post('/mcp', this.handlePost.bind(this));
    this.app.get('/mcp', this.handleSessionRequest.bind(this));
    this.app.delete('/mcp', this.handleSessionRequest.bind(this));
  }

  private async handlePost(req: express.Request, res: express.Response) {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    
    if (sessionId) {
      const transport = this.sessionManager.getTransport(sessionId);
      if (!transport) {
        res.status(400).send('Invalid session ID');
        return;
      }
      await transport.handleRequest(req, res, req.body);
      return;
    }

    if (isInitializeRequest(req.body)) {
      const transport = this.sessionManager.createTransport();
      const server = new McpServer(SERVER_CONFIG);
      
      registerAllTools(server);
      registerAllResources(server);
      
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

  private async handleSessionRequest(req: express.Request, res: express.Response) {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
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
    this.app.listen(SERVER_CONFIG.port, () => {
      console.log(`MCP Server listening on port ${SERVER_CONFIG.port}`);
    });
  }
}