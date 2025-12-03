import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import AuthContext from "../services/AuthContext";

export default function Sidebar({ onSelectUser, selectedUserId, currentUserId, isOpen }) {
  const { socket } = useContext(AuthContext);
  const [activeTab] = useState("chats");
  const [overlayTab, setOverlayTab] = useState("contacts");
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([])
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatsRes, contactsRes, usersRes] = await Promise.all([
          api.get("/chats/"),
          api.get("/chats/contacts"),
          api.get("/chats/users")
        ]);
        setChats(chatsRes.data || []);
        setContacts(contactsRes.data || [])
        setUsers(usersRes.data || [])
        setOverlayOpen(false);
  
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [currentUserId]);

  const getFilteredList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.filter(item =>
      (item.username || item.name)?.toLowerCase().includes(search.toLowerCase())
    );
  };

  useEffect(() => {
  if (!selectedUserId) return;
  handleCreateOrFindDM(selectedUserId);
}, [selectedUserId]);


  const handleOpenChat = async (chatId) => {
  try {
    const messagesResponse = await api.get(`/chats/${chatId}`);
    const chat = chats.find(c => c.id === chatId);

    onSelectUser({
      chatId,
      selectedUser: chat.otherUser,  
      messages: messagesResponse.data.messages,
    });

    socket.emit("join_group", chatId);
  } catch (error) {
    console.error("Failed to open chat:", error);
  }
};

const handleCreateOrFindDM = async (userId) => {
  try {
    if (!userId) return;

    const dmResponse = await api.post(`/chats/${userId}`);
    const dm = dmResponse.data;

    const messagesResponse = await api.get(`/chats/${dm.id}`);

    const otherUser =
      dm.participantA.id === currentUserId ? dm.participantB : dm.participantA;

    setChats((prevChats) => {
      const exists = prevChats.find(c => c.id === dm.id);
      if (exists) {
        return prevChats.map(c =>
          c.id === dm.id ? { ...c, otherUser, lastMessage: dm.lastMessage } : c
        );
      }
      return [{ ...dm, otherUser }, ...prevChats];
    });

    onSelectUser({
      chatId: dm.id,
      selectedUser: otherUser,
      messages: messagesResponse.data.messages,
    });

    socket.emit("join_group", dm.id);
  } catch (error) {
    console.error("Failed to initialize DM:", error);
  }
};

const handleDeleteChat = async (chatId) => {
    try {
      await api.delete(`/chats/${chatId}`);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  }; 

  const renderUserRow = (user) => {
    const isSelected = selectedUserId === user.id;
    return (
      <div
        key={user.id}
        className={`flex items-center justify-between p-1 border-b cursor-pointer relative ${
          isSelected ? "bg-gray-200" : "hover:bg-gray-100"
        }`}
        onClick={() => handleCreateOrFindDM(user.id)}
      >
        <div className="flex items-center gap-2 px-2">
          {user.profileImage && !user.hasBlockedMe ? (
            <img
              src={user.profileImage}
              alt={user.username}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300" />
          )}
          <span className="truncate max-w-[120px]">{user.username}</span>
          {user.hasBlockedMe && <span className="ml-2 text-sm text-red-500">Blocked you</span>}
        </div>
      </div>
    ); 
  };

  const renderChats = () => (
  <div className="flex-1 overflow-y-auto">
    {chats.length ? (
      chats.map(chat => {
        const isSelected = selectedUserId === chat.id;

        return (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-1 border-b cursor-pointer ${
              isSelected ? "bg-gray-200" : "hover:bg-gray-100"
            }`}
            onClick={() => handleOpenChat(chat.id)}
          >
            <div className="flex items-center gap-2 px-2">

              <img
                src={chat.otherUser.profileImage || "/default-avatar.png"}
                className="w-8 h-8 rounded-full object-cover"
                alt={chat.otherUser.username}
              />

              <div className="flex flex-col max-w-[140px]">
                <span className="truncate font-semibold">
                  {chat.otherUser.username}
                </span>

                <span className="truncate text-sm text-gray-500">
                  {chat.lastMessage?.content || "No messages yet"}
                </span>
              </div>
            </div>

            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() =>
                  setDropdownOpen(dropdownOpen === chat.id ? null : chat.id)
                }
                className="px-2 py-1 text-gray-600 hover:text-black"
              >
                ⋮
              </button>

              {dropdownOpen === chat.id && (
                <div className="absolute right-0 top-6 bg-white border rounded shadow-md text-sm z-10">
                  <button
                    className="block w-full text-left px-3 py-1 hover:bg-gray-100 text-red-600"
                    onClick={() => {
                      setDropdownOpen(null);
                      handleDeleteChat(chat.id);
                    }}
                  >
                    Delete Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })
    ) : (
      <div className="text-gray-500 py-2 px-2">No chats yet</div>
    )}
  </div>
);

  const renderOverlay = () => {
  const list = overlayTab === "contacts" ? contacts : users;
    const filteredList = getFilteredList(list);
    return (
      <div  key={contacts.length} className="absolute left-0 right-0 top-[110%] bg-white border shadow-lg rounded max-h-[70vh] overflow-y-auto z-20">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex gap-2">
            <button
              className={`px-2 py-1 rounded ${
                overlayTab === "contacts" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setOverlayTab("contacts")}
            >
              Contacts
            </button>

            <button
              className={`px-2 py-1 rounded ${
                overlayTab === "allUsers" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setOverlayTab("allUsers")}
            >
              All Users
            </button>
          </div>
          <button
            className="px-2 py-1"
            onClick={() => {
              setOverlayOpen(false);
            }}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 ">
          {filteredList.length ? (
            filteredList.map(renderUserRow)
          ) : (
            <div className="text-gray-500 py-2 px-2">No users found</div>
          )}
        </div>
      </div>
    );
  };

return (
  <div
    className={`sidebar relative flex flex-col h-full border-r transition-all duration-300 ${
      isOpen ? "w-64" : "w-12"
    }`}
  >

    {isOpen && (
      <button
        className="m-2 p-1 bg-blue-500 text-white rounded w-[calc(100%-1rem)]"
        onClick={() => setOverlayOpen(!overlayOpen)}
      >
        New Chat
      </button>
    )}
    
    {isOpen && (
      <div className="m-2 relative">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-2 py-1 bg-slate-100"
        />
      </div>
    )}


    <div className="flex-1 min-h-0 overflow-y-auto">
      {activeTab === "chats" && renderChats()}
    </div>

    {overlayOpen && (
      <div className="absolute left-0 right-0 top-12 z-50">
        {renderOverlay()}
      </div>
    )}
  </div>
);
}