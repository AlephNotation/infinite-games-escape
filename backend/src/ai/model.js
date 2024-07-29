"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bestModel = exports.fastModel = void 0;
var anthropic_1 = require("@ai-sdk/anthropic");
exports.fastModel = (0, anthropic_1.anthropic)("claude-3-haiku-20240307");
exports.bestModel = (0, anthropic_1.anthropic)("claude-3-opus-20240229");
