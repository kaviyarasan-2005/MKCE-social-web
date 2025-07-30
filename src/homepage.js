import React, { useState, useEffect } from "react";

/* ========== MOCK DATA ========== */
const mockUsers = [
  { id: 1, name: "Aishwarya" },
  { id: 2, name: "Ravi" },
  { id: 3, name: "Sanjay" },
  { id: 4, name: "Meena" },
];

const initialMessages = {
  1: [
    { text: "Hey there!", sender: "other" },
    { text: "How are you?", sender: "other" },
  ],
  2: [
    { text: "Hello!", sender: "other" },
    { text: "Wanna join our study group?", sender: "other" },
  ],
  3: [
    { text: "Hi!", sender: "other" },
    { text: "Did you complete the project?", sender: "other" },
  ],
  4: [
    { text: "Morning!", sender: "other" },
    { text: "Today’s class at 10 AM", sender: "other" },
  ],
};

/* ========== MAIN COMPONENT ========== */
const HomePage = () => {
  /* ---------- state ---------- */
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState(() => {
    // pull chat history from localStorage (if any)
    const stored = localStorage.getItem("messages");
    return stored ? JSON.parse(stored) : initialMessages;
  });
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------- persist to localStorage whenever messages change ---------- */
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  /* ---------- send a message ---------- */
  const handleSend = () => {
    if (!newMessage.trim() || selectedUserId === null) return;

    setMessages((prev) => {
      const updatedUserMsgs = [...(prev[selectedUserId] || []), { text: newMessage, sender: "me" }];
      return { ...prev, [selectedUserId]: updatedUserMsgs };
    });
    setNewMessage("");
  };

  /* ---------- convenience ---------- */
  const selectedMessages = selectedUserId ? messages[selectedUserId] : [];

  /* ---------- render ---------- */
  return (
    <div style={styles.container}>
      {/* ===== Sidebar ===== */}
      <div style={styles.sidebar}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contacts..."
          style={styles.searchInput}
        />
        <h3 style={styles.sidebarTitle}>Connected People</h3>

        {mockUsers
          .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              style={{
                ...styles.userItem,
                backgroundColor: user.id === selectedUserId ? "#dfe9ff" : "#fff",
              }}
            >
              {user.name}
            </div>
          ))}
      </div>

      {/* ===== Chat window ===== */}
      <div style={styles.chatWindow}>
        {selectedUserId ? (
          <>
            <div style={styles.chatHeader}>
              Chat&nbsp;with&nbsp;
              {mockUsers.find((u) => u.id === selectedUserId)?.name}
            </div>

            <div style={styles.messageList}>
              {selectedMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.message,
                    alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
                    backgroundColor: msg.sender === "me" ? "#cfe9ff" : "#e6f0ff",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div style={styles.inputArea}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message…"
                style={styles.input}
              />
              <button onClick={handleSend} style={styles.sendButton}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={styles.placeholder}>Select a person to start chatting</div>
        )}
      </div>
    </div>
  );
};

/* ========== STYLES ========== */
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },

  /* -- sidebar -- */
  sidebar: {
    width: "250px",
    backgroundColor: "#f0f4ff",
    borderRight: "1px solid #ddd",
    padding: "20px",
    boxSizing: "border-box",
  },
  sidebarTitle: { marginBottom: "20px" },
  searchInput: {
    width: "100%",
    padding: "8px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  userItem: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },

  /* -- chat pane -- */
  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    padding: "20px",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
    backgroundColor: "#f9f9f9",
  },
  messageList: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    backgroundColor: "#fff",
  },
  message: {
    padding: "10px 15px",
    margin: "5px 0",
    borderRadius: "15px",
    maxWidth: "60%",
  },

  /* -- input area -- */
  inputArea: {
    display: "flex",
    borderTop: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginRight: "10px",
    fontSize: "14px",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#2575fc",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  /* -- placeholder -- */
  placeholder: {
    margin: "auto",
    fontSize: "18px",
    color: "#888",
  },
};

export default HomePage;
