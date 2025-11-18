import { useState, useEffect } from "react";
import api from "../services/api";
import socket from "../services/socket";

export default function ChatComponent({ selectedChatId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!selectedChatId) return;

    api
      .get(`/chats/${selectedChatId}`)
      .then((res) => setMessages(res.data.messages || []))
      .catch((err) => console.error("Failed to load chat messages", err));
  }, [selectedChatId]);

  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (msg.chatId === selectedChatId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("newMessage");
  }, [selectedChatId]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedChatId) return;

    try {
      const res = await api.post(`/chats/${selectedChatId}/messages`, {
        text: input,
      });

      socket.emit("sendMessage", {
        chatId: selectedChatId,
        message: res.data,
      });

      setMessages((prev) => [...prev, res.data]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (!selectedChatId) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center text-gray-500 text-lg">
        Select a chat or contact to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white border-l border-gray-300">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[70%] ${msg.senderId === currentUserId ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-200"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-300 flex gap-3">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}