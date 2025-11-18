import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatComponent from "./ChatComponent";
import api from "../services/api";

export default function DMPage() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Fetch contacts + chats once
  useEffect(() => {
    fetchAllContacts();
    fetchAllChats();
  }, []);

  const fetchAllContacts = async () => {
    try {
      const res = await api.get("/chats/contacts");
      setContacts(res.data.contacts);
    } catch (err) {
      console.error("Contacts fetch failed:", err);
    }
  };

  const fetchAllChats = async () => {
    try {
      const res = await api.get("/chats");
      setChats(res.data);
    } catch (err) {
      console.error("Chats fetch failed:", err);
    }
  };

  // When a contact is clicked → create/get DM → open chat
  const handleSelectContact = async (contactId) => {
    try {
      const res = await api.post(`/chats/${contactId}`);
      const dm = res.data;
      
      setSelectedChatId(dm.id);
      setSelectedUser(
        dm.participantAId === contactId ? dm.participantA : dm.participantB
      );

      // refresh chats list so this DM appears
      fetchAllChats();

    } catch (err) {
      console.error("Failed to create/select DM:", err);
    }
  };

  // When clicking an existing chat in Sidebar
  const handleSelectChat = (chat) => {
    setSelectedChatId(chat.id);

    // find the OTHER person in the DM
    const otherUser =
      chat.participantA.id === chat.currentUserId
        ? chat.participantB
        : chat.participantA;

    setSelectedUser(otherUser);
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar
        chats={chats}
        contacts={contacts}
        onSelectContact={handleSelectContact}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
      />

      {/* Chat Area */}
      <div className="flex-1">
        {selectedChatId ? (
          <ChatComponent dmId={selectedChatId} otherUser={selectedUser} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a chat or contact to start messaging.
          </div>
        )}
      </div>

    </div>
  );
}
