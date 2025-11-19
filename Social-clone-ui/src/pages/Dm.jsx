import { useState, useContext } from "react";
import Sidebar from "../components/ChatSideBar";
import Chat from "../components/ChatBox";
import AuthContext from "../services/AuthContext";

export default function DMPage() {
  const { user, socket } = useContext(AuthContext);
  const [active, setActive] = useState(null);

  const handleSelect = (data) => {
    setActive(data);
    if (data?.groupId) {
      socket.emit("join_group", data.groupId);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar
        onSelectUser={handleSelect}
        isOpen={true}
      />
      
      <div className="flex-1">
        {active ? (
          <Chat
            userData={active.selectedUser}
            initialMessages={active.messages}
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
