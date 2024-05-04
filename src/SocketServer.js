/**
 * Module dependencies.
 */
import { Server } from "socket.io";

/**
 * SocketServer class representing a WebSocket server.
 */
export default class SocketServer {
  /**
   * Constructor of the SocketServer class.
   * @param {string} apiUrl The URL of the server API.
   * @param {number} port The port number for the WebSocket server.
   */
  constructor(apiUrl, port) {
    this.apiUrl = apiUrl;
    this.port = port;
    this.io = new Server({
      cors: {
        origin: [apiUrl],
      },
    });
    this.peers = {};
  }

  /**
   * Start the WebSocket server.
   */
  start() {
    this.io.listen(this.port);
    this.handleConnections();
    console.log(`Server listening on port ${this.port}`);
  }

  /**
   * Handle incoming connections.
   */
  handleConnections() {
    this.io.on("connection", (socket) => {
      this.handleNewConnection(socket);
      this.handleSignal(socket);
      this.handleDisconnect(socket);
    });
  }

  /**
   * Handle a new connection.
   * @param {SocketIO.Socket} socket The socket of the new connection.
   */
  handleNewConnection(socket) {
    if (!this.peers[socket.id]) {
      this.peers[socket.id] = {};
      socket.emit("introduction", Object.keys(this.peers));
      this.io.emit("newUserConnected", socket.id);
      console.log(
        "Peer joined with ID",
        socket.id,
        ". There are " + this.io.engine.clientsCount + " peer(s) connected."
      );
    }
  }

  /**
   * Handle signal transmission.
   * @param {SocketIO.Socket} socket The socket of the user.
   */
  handleSignal(socket) {
    socket.on("signal", (to, from, data) => {
      if (to in this.peers) {
        this.io.to(to).emit("signal", to, from, data);
      } else {
        console.log("Peer not found!");
      }
    });
  }

  /**
   * Handle disconnection of a peer.
   * @param {SocketIO.Socket} socket The socket of the disconnected peer.
   */
  handleDisconnect(socket) {
    socket.on("disconnect", () => {
      delete this.peers[socket.id];
      this.io.sockets.emit("userDisconnected", socket.id);
      console.log(
        "Peer disconnected with ID",
        socket.id,
        ". There are " + this.io.engine.clientsCount + " peer(s) connected."
      );
    });
  }
}
