import { useState, useContext } from "react";
import Sidebar from "../components/ChatSideBar";
import Chat from "../components/ChatBox";
import AuthContext from "../services/AuthContext";

export default function DMPage() {
  const { socket } = useContext(AuthContext);
  const [activeChat, setActiveChat] = useState(null);

  const handleSelect = (chat) => {
    setActiveChat(chat);
    if (chat?.dmId) {
      socket.emit("join_dm", chat.dmId);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar onSelectUser={handleSelect} />

      <div className="flex-1">
        {activeChat ? (
          <Chat
            dmId={activeChat.dmId}
            user={activeChat.user}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
