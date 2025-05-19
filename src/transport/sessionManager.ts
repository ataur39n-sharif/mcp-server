import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "node:crypto";

export class SessionManager {
  private transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

  createTransport(): StreamableHTTPServerTransport {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        this.transports[sessionId] = transport;
      }
    });

    transport.onclose = () => {
      if (transport.sessionId) {
        delete this.transports[transport.sessionId];
      }
    };

    return transport;
  }

  getTransport(sessionId: string): StreamableHTTPServerTransport | undefined {
    return this.transports[sessionId];
  }
}