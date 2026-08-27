"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const socket = getSocket();
    
    // Explicitly connect the socket
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to WebSocket Server:", socket.id);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return <>{children}</>;
}