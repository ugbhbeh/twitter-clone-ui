
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatSidebar from "../components/ChatSideBar";
import Chat from "../components/ChatBox";
import AuthContext from "../services/AuthContext";
import io from "socket.io-client";

export default function DMPage() {
  const { userId, isLoggedIn } = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatId, setChatId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io("http://localhost:8080", {
      auth: { token },
    });

    newSocket.on("receive_message", (message) => {
      setMessages((prev) => {
        if (message.chatId === chatId) {
          return [...prev, message];
        }
        return prev;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [chatId]); 

  const handleSelectUser = ({ chatId, selectedUser, messages }) => {
    setSelectedUser(selectedUser);
    setChatId(chatId);
    setMessages(messages || []);
  };

  if (!isLoggedIn) return null;
  
 return (
    <div className="home-container flex flex-col h-screen">
      <div className="main-content flex flex-1 overflow-hidden">
        <div className="relative flex h-full">
          <div
            className={`transition-all duration-200 h-full ${
              sidebarOpen ? "w-64" : "w-0"
            } overflow-hidden`}
          >
            <ChatSidebar
              currentUserId={userId}
              selectedUserId={selectedUser?.id || null}
              onSelectUser={handleSelectUser}
              isOpen={sidebarOpen}
            />
          </div>
          <div
            className="w-8 h-full bg-gray-200 flex items-center justify-center cursor-pointer"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <span className="text-gray-600 rotate-90">⋮</span>
          </div>
        </div>

        <Chat
          selectedUser={selectedUser}
          messages={messages}
          groupId={chatId}
          socket={socket}
          currentUser={{ id: userId }}
        />
      </div>
    </div>
  );
}


