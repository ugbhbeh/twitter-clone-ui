import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import AuthContext from "../services/AuthContext";

export default function Sidebar({ onSelectUser, currentUserId, isOpen }) {
  const { socket } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactsRes = await api.get("/chats/contacts");
        const chatsRes = await api.get("/chats/");

        setContacts(contactsRes.data.contacts || []);
        setChats(chatsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch sidebar data:", err);
      }
    };

    fetchData();
  }, [currentUserId]);

  const getFiltered = (list) =>
    list.filter((item) =>
      (item.username || "").toLowerCase().includes(search.toLowerCase())
    );

  const handleOpenChat = async (chatId) => {
    try {
      const chatRes = await api.get(`/chats/${chatId}`);

      const chat = chats.find((c) => c.id === chatId);

      onSelectUser({
        groupId: chatId,
        selectedUser: chat,
        messages: chatRes.data.messages,
      });

      socket.emit("join_group", chatId);
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };

  const handleCreateOrFindDM = async (otherUserId) => {
    try {
      const dmRes = await api.post(`/chats/${otherUserId}`);
      const dm = dmRes.data;

      const msgRes = await api.get(`/chats/${dm.id}`);

      onSelectUser({
        groupId: dm.id,
        selectedUser: contacts.find((c) => c.id === otherUserId),
        messages: msgRes.data.messages,
      });

      socket.emit("join_group", dm.id);
    } catch (err) {
      console.error("DM creation error:", err);
    }
  };

  const renderChats = () => (
    <div className="flex-1 overflow-y-auto">
      {chats.length ? (
        chats.map((chat) => {
          const other =
            chat.participantA.id === currentUserId
              ? chat.participantB
              : chat.participantA;

          return (
            <div
              key={chat.id}
              className="flex items-center p-1 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => handleOpenChat(chat.id)}
            >
              <img
                src={other.profileImage || "/images/default-avatar.png"}
                className="w-8 h-8 rounded-full object-cover mx-2"
              />
              <span className="truncate max-w-[140px]">{other.username}</span>
            </div>
          );
        })
      ) : (
        <div className="text-gray-500 p-2">No chats</div>
      )}
    </div>
  );

  const renderContactsOverlay = () => {
    const filtered = getFiltered(contacts);

    return (
      <div className="absolute top-0 left-0 w-full h-full bg-white z-20 border-l shadow-xl flex flex-col">
        <div className="flex justify-between items-center p-2 border-b">
          <span className="font-bold">Contacts</span>
          <button className="px-3 py-1" onClick={() => setOverlayOpen(false)}>
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length ? (
            filtered.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-1 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handleCreateOrFindDM(user.id)}
              >
                <img
                  src={user.profileImage || "/images/default-avatar.png"}
                  className="w-8 h-8 rounded-full object-cover mx-2"
                />
                <span className="truncate max-w-[140px]">{user.username}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 p-2">No contacts found</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`sidebar flex flex-col h-full border-r transition-all duration-300 ${
        isOpen ? "w-64" : "w-12 overflow-hidden"
      }`}
    >
      {isOpen && (
        <>
          <button
            className="m-2 p-1 bg-blue-500 text-white rounded w-[calc(100%-1rem)]"
            onClick={() => setOverlayOpen(true)}
          >
            New Chat
          </button>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded px-2 py-1 m-2"
          />
        </>
      )}

      <div className="flex flex-col flex-1 relative">
        {renderChats()}
        {overlayOpen && renderContactsOverlay()}
      </div>
    </div>
  );
}
