"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./socket/index");
const project_routes_1 = __importDefault(require("./routes/project.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*', // For dev purposes, in prod should be specific origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/projects', project_routes_1.default);
// Socket.io initialization
(0, index_1.initSocket)(io);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map