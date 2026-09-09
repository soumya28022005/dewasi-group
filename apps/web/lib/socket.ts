import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocketOrigin(): string {
  if (
    typeof process.env.NEXT_PUBLIC_SOCKET_URL === "string" &&
    process.env.NEXT_PUBLIC_SOCKET_URL
  ) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  if (
    typeof process.env.NEXT_PUBLIC_API_URL === "string" &&
    process.env.NEXT_PUBLIC_API_URL
  ) {
    return process.env.NEXT_PUBLIC_API_URL.replace(
      /\/api\/v1\/?$/,
      ""
    );
  }

  return "http://localhost:8000";
}

export function getSocket(): Socket {
  if (!socket) {
    const url = getSocketOrigin();

    socket = io(url, {
      autoConnect: false,
      withCredentials: true,

      // WebSocket first.
      // Socket.IO can fall back if the infrastructure
      // does not support WebSocket correctly.
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Socket] Connected:", socket?.id);
      }
    });

    socket.on("disconnect", (reason) => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Socket] Disconnected:", reason);
      }
    });

    socket.on("connect_error", (error) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[Socket] Connection error:",
          error.message
        );
      }
    });
  }

  return socket;
}