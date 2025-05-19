"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAllTools = void 0;
const mathTools_1 = require("./mathTools");
const weatherTools_1 = require("./weatherTools");
const registerAllTools = (server) => {
    (0, mathTools_1.registerMathTools)(server);
    (0, weatherTools_1.registerWeatherTools)(server);
};
exports.registerAllTools = registerAllTools;
