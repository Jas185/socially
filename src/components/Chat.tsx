"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  path: "/api/socket",
});

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Chat en Direct 💬</h2>

      <div className="border p-2 h-40 overflow-auto mb-2">
        {messages.map((msg, index) => (
          <p key={index} className="text-sm">{msg}</p>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-grow"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écris un message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={sendMessage}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
