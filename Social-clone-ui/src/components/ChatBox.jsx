import { useEffect, useState, useRef } from "react";

export default function Chat({ selectedUser, messages, chatId, socket, currentUser}) {
  const [localMessages, setLocalMessages] = useState(messages || []);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  useEffect(() => {
    setLocalMessages(messages || []);
  }, [messages, chatId]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
     if (message.dmId === chatId){
        setLocalMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [socket, chatId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    socket.emit("send_message", { content: newMessage, dmId: chatId });
    setNewMessage("");
  };

  if (!selectedUser)
    return (
      <div className="flex flex-1 items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );

 return (
    <div className="flex flex-col flex-1 h-full bg-gray-50">

      <div className="flex items-center gap-3 p-4 border-b bg-white shadow-sm">
        <img
          src={selectedUser.profileImage || "/default-avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="font-semibold">{selectedUser.username}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
        {localMessages.map((msg) => {
          const senderId = msg.sender_id
          const isOwn = String(senderId) === String(currentUser.id);

          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              {!isOwn && (
                <img
                  src={msg.sender?.profileImage || "/default-avatar.png"}
                  alt={msg.sender?.username || "User"}
                  className="w-6 h-6 rounded-full mr-2"
                />
              )}

              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                  isOwn
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-300 bg-slate-200"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>

    </div>
  );
}