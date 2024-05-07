"use strict";

import SocketServer from "./SocketServer.js";

/**
 * Load environment variables from .env file.
 */
const clientURLLocalhost = "http://localhost:3000";
const clientURLDeploy = "https://eisc-metaverse.vercel.app";
const port = process.env.PORT;

/**
 * Start the WebSocket server.
 */
const socketServer = new SocketServer(
    port,
    clientURLLocalhost,
    clientURLDeploy
  );
    
socketServer.start();
