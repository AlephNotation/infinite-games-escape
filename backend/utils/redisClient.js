"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ioredis_1 = require("ioredis");
var redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
exports.default = redis;
