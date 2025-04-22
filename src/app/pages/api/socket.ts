import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: HTTPServer & { io?: IOServer };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Démarrage du serveur WebSocket...");

    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("Un utilisateur est connecté 🔥");

      socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message);
      });

      socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté ❌");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Le serveur WebSocket est déjà lancé !");
  }

  res.end();
}
