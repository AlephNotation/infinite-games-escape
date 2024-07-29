"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var hono_1 = require("hono");
var cors_1 = require("hono/cors");
var command_route_1 = require("./routes/command.route");
var chatMessages_route_1 = require("./routes/chatMessages.route");
var machine_route_1 = require("./routes/machine.route");
var app = new hono_1.Hono();
app.get("/", function (c) {
    return c.text("Hello Hono!");
});
// Apply CORS middleware to all routes
app.use('*', (0, cors_1.cors)());
app.route("", command_route_1.commandRouter);
app.route("", chatMessages_route_1.chatMessagesRouter);
app.route("", machine_route_1.machineRouter);
exports.default = app;
// Add this line
exports.handler = app.fetch;
