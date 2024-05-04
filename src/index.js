"use strict";

import SocketServer from "./SocketServer.js";

/**
 * Load environment variables from .env file.
 */
const apiUrl = process.env.SERVER_URL;
const port = process.env.PORT;

/**
 * Start the WebSocket server.
 */
const socketServer = new SocketServer(apiUrl, port);
socketServer.start();
