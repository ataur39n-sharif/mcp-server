"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAllResources = void 0;
const greetingResource_1 = require("./greetingResource");
const registerAllResources = (server) => {
    (0, greetingResource_1.registerGreetingResource)(server);
};
exports.registerAllResources = registerAllResources;
