"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWeatherTools = void 0;
const zod_1 = require("zod");
const registerWeatherTools = (server) => {
    server.tool("fetch-weather", { city: zod_1.z.string() }, async ({ city }) => {
        const response = await fetch(`https://api.weather.com/${city}`);
        const data = await response.text();
        return {
            content: [{ type: "text", text: data }]
        };
    });
};
exports.registerWeatherTools = registerWeatherTools;
