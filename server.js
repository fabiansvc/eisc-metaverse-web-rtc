import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: ["http://localhost:3000", "https://eisc-metaverse.vercel.app", "https://eisc-metaverse-fabiansvc.vercel.app/"]
  },
});

io.listen(5000);

let peers = {};

io.on("connection", (socket) => {
  console.log(
    "Peer joined with ID",
    socket.id,
    ". There are " +
    io.engine.clientsCount +
    " peer(s) connected."
  );

  if (!peers[socket.id]) {
    peers[socket.id] = {};
  }

  socket.emit( "introduction", Object.keys(peers));

  io.emit("newUserConnected", socket.id);

  socket.on("signal", (to, from, data) => {
    if (to in peers) {
      io.to(to).emit("signal", to, from, data);
    } else {
      console.log("Peer not found!");
    }
  });

  socket.on("disconnect", () => {
    delete peers[socket.id];
    io.sockets.emit(
      "userDisconnected",
      io.engine.clientsCount,
      socket.id,
      Object.keys(peers)
    );
    console.log(
      "User " +
      socket.id +
      " diconnected, there are " +
      io.engine.clientsCount +
      " clients connected"
    );
  });
});
