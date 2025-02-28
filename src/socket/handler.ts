import { Server } from "socket.io";
import { log } from "..";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {
    log.log("Web Socket connected from ", socket.id);
    socket.on("disconnect", () => {
      log.log("Web Socket disconnected from ", socket.id);
    });
  });
};
