"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGreetingResource = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const registerGreetingResource = (server) => {
    server.resource("greeting", new mcp_js_1.ResourceTemplate("greeting://{name}", { list: undefined }), async (uri, { name }) => ({
        contents: [{
                uri: uri.href,
                text: `Hello, ${name}!`
            }]
    }));
};
exports.registerGreetingResource = registerGreetingResource;
