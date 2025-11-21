import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import AuthContext from "../services/AuthContext";

export default function Sidebar({ onSelectChat }) {
  const { socket, user } = useContext(AuthContext);

  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);

  // Fetch initial sidebar data
  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      try {
        const [contactsRes, chatRes] = await Promise.all([
          api.get("/chats/contacts"),
          api.get("/chats")
        ]);

        setContacts(contactsRes.data.contacts || []);
        console.log(contacts, contactsRes)
        setChats(chatRes.data || []);

      } catch (err) {
        console.error("Sidebar load failed:", err);
      }
    };

    load();
  });



  const getOtherUser = (chat) => {
    if (!chat) return null;
    return chat.participantA.id === user.id
      ? chat.participantB
      : chat.participantA;
  };

  const filteredContacts = contacts.filter(c =>
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenChat = async (chatId) => {
    try {
      const chatRes = await api.get(`/chats/${chatId}`);
      const chat = chats.find((c) => c.id === chatId);
      const otherUser = getOtherUser(chat);
      onSelectChat({
        dmId: chatId,
        otherUser,
        messages: chatRes.data.messages || []
      });

      socket.emit("join", { room: `dm:${chatId}` });

    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };


  const handleStartDM = async (otherUserId) => {
    try {
      const dm = (await api.post(`/chats/${otherUserId}`)).data;

      const msgRes = await api.get(`/chats/${dm.id}`);
      const otherUser = contacts.find(c => c.id === otherUserId);

      onSelectChat({
        dmId: dm.id,
        otherUser,
        messages: msgRes.data.messages || []
      });

      socket.emit("join", { room: `dm:${dm.id}` });

    } catch (err) {
      console.error("DM creation error:", err);
    }
  };

  return (
    <div className="w-64 border-r flex flex-col h-full bg-white">
      <button
        className="m-2 p-2 bg-blue-500 text-white rounded"
        onClick={() => setOverlayOpen(true)}
      >
        New Chat
      </button>

      <input
        type="text"
        placeholder="Search contacts…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="m-2 px-2 py-1 border rounded bg-slate-100"
      />
   
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-2 text-gray-500">No chats</div>
        ) : (
          chats.map((chat) => {
            const other = getOtherUser(chat);
            return (
              <div
                key={chat.id}
                onClick={() => handleOpenChat(chat.id)}
                className="p-2 flex items-center cursor-pointer hover:bg-gray-100 border-b"
              >
                <img
                  src={other.profileImage || "/images/default-avatar.png"}
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
                <span className="truncate">{other.username}</span>
              </div>
            );
          })
        )}
      </div>

      {overlayOpen && (
        <div className="absolute inset-0 bg-white shadow-lg z-20 flex flex-col">

          <div className="flex justify-between items-center p-2 border-b">
            <span className="font-bold">Contacts</span>
            <button
              className="text-xl px-2"
              onClick={() => setOverlayOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="absolute top-0 left-0 w-full h-full bg-white border-l shadow-lg z-20 flex flex-col">
            { 
            (
              filteredContacts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleStartDM(c.id)}
                  className="p-2 flex items-center cursor-pointer hover:bg-gray-100 border-b"
                >
                  <img
                    src={c.profileImage || "/images/default-avatar.png"}
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <span className="truncate">{c.username}</span>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
