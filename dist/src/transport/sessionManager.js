"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const node_crypto_1 = require("node:crypto");
class SessionManager {
    transports = {};
    createTransport() {
        const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
            sessionIdGenerator: () => (0, node_crypto_1.randomUUID)(),
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
    getTransport(sessionId) {
        return this.transports[sessionId];
    }
}
exports.SessionManager = SessionManager;
