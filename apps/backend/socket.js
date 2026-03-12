import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Admin connected");
  });
}

export function notifyAdmin(msg) {
  if (!io) return;
  io.emit("admin_notification", {
    text: msg,
    time: new Date().toLocaleTimeString(),
  });
}