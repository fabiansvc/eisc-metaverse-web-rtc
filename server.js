import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: ["https://eisc-metaverse.vercel.app", "http://localhost:3000"]
  },
});

io.listen(5000);

let peers = {};

io.on("connection", (socket) => {
  if (!peers[socket.id]) {
    peers[socket.id] = {};
    socket.emit("introduction", Object.keys(peers));
    io.emit("newUserConnected", socket.id);
    console.log("Peer joined with ID", socket.id, ". There are " + io.engine.clientsCount + " peer(s) connected.");
  }

  socket.on("signal", (to, from, data) => {
    if (to in peers) {
      io.to(to).emit("signal", to, from, data);
    } else {
      console.log("Peer not found!");
    }
  });

  socket.on("disconnect", () => {
    delete peers[socket.id];
    io.sockets.emit("userDisconnected", socket.id);
    console.log("Peer disconnected with ID", socket.id, ". There are " + io.engine.clientsCount + " peer(s) connected.");
  });
});
