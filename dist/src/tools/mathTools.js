"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMathTools = void 0;
const zod_1 = require("zod");
const registerMathTools = (server) => {
    server.tool("add", { a: zod_1.z.number(), b: zod_1.z.number() }, async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }]
    }));
    server.tool("calculate-bmi", {
        weightKg: zod_1.z.number(),
        heightM: zod_1.z.number()
    }, async ({ weightKg, heightM }) => ({
        content: [{
                type: "text",
                text: String(weightKg / (heightM * heightM))
            }]
    }));
};
exports.registerMathTools = registerMathTools;
