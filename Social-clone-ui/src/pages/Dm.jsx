import { useState, useContext, useEffect } from "react";
import Sidebar from "../components/ChatSideBar";
import Chat from "../components/ChatBox";
import AuthContext from "../services/AuthContext";

export default function DMPage() {
  const { userId, isLoggedIn } = useContext(AuthContext);
   const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate, rehydrated]);









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
