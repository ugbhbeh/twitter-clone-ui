import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import AuthContext from "../services/AuthContext";

export default function Chat({ dmId }) {
  const { user, socket } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Load message history
  useEffect(() => {
    if (!dmId) return;

    api
      .get(`/chats/${dmId}`)
      .then((res) => setMessages(res.data.messages || []))
      .catch((err) => console.error("Failed to load messages", err));
  }, [dmId]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handler = (msg) => {
      if (msg.dmId === dmId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handler);

    return () => socket.off("receive_message", handler);
  }, [socket, dmId]);

  const sendMessage = async () => {
    if (!input.trim() || !dmId) return;

    try {
      // Save message through backend
      const res = await api.post(`/chats/${dmId}/messages`, {
        content: input,
      });

      const saved = res.data;

      // Emit through socket
      socket.emit("send_message", {
        dmId,
        content: saved.content,
      });

      setMessages((prev) => [...prev, saved]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (!dmId) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center text-gray-500 text-lg">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white border-l border-gray-300">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.sender_id === user.userId
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-200"
            }`}
          >
            {msg.content}
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
