import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

const socket = io("http://192.168.35.122:5000");

const HomePage = () => {
  const navigate = useNavigate();
  const [receiverEmail, setReceiverEmail] = useState("");
  const [connectedEmails, setConnectedEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("messages");
    return stored ? JSON.parse(stored) : {};
  });
  const [newMessage, setNewMessage] = useState("");
  const [myEmail, setMyEmail] = useState(""); // Replace with actual login
  const chatEndRef = useRef();
const location = useLocation();
useEffect(() => {
  if (location.state?.email) {
    setMyEmail(location.state.email);
  }
}, [location.state]);

  useEffect(() => {
    socket.emit("register", myEmail);
  }, [myEmail]);

  // Handle incoming messages
  useEffect(() => {
    const handleReceive = (msg) => {
      const { sender_email, message } = msg;

      setMessages((prev) => {
        const updated = {
          ...prev,
          [sender_email]: [...(prev[sender_email] || []), { text: message, sender: "other" }],
        };
        localStorage.setItem("messages", JSON.stringify(updated));
        return updated;
      });

      // Add sender to connected list if not already there
      setConnectedEmails((prev) => {
        if (!prev.includes(sender_email)) return [...prev, sender_email];
        return prev;
      });
    };

    socket.on("receive_message", handleReceive);

    return () => socket.off("receive_message", handleReceive);
  }, []);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedEmail) return;

    socket.emit("send_message", {
      sender: myEmail,
      receiver: selectedEmail,
      message: newMessage,
    });

    setMessages((prev) => {
      const updated = {
        ...prev,
        [selectedEmail]: [...(prev[selectedEmail] || []), { text: newMessage, sender: "me" }],
      };
      localStorage.setItem("messages", JSON.stringify(updated));
      return updated;
    });

    setNewMessage("");
  };

  const handleStartChat = () => {
    const email = receiverEmail.trim();
    if (!email) return;

    if (!connectedEmails.includes(email)) {
      setConnectedEmails((prev) => [...prev, email]);
    }

    setSelectedEmail(email);
    setReceiverEmail("");
  };

  const selectedMessages = selectedEmail ? messages[selectedEmail] || [] : [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessages]);

 return (
  <div style={styles.container}>
    {/* Sidebar */}
    <div style={styles.sidebar}>
      <h3 style={styles.sidebarTitle}>Connected People</h3>

      {/* Input to start new chat */}
      <input
        type="text"
        placeholder="Receiver Email"
        value={receiverEmail}
        onChange={(e) => setReceiverEmail(e.target.value)}
        style={styles.searchInput}
      />
      <button onClick={handleStartChat} style={{ ...styles.sendButton, width: "100%", marginBottom: 20 }}>
        Start Chat
      </button>

      {connectedEmails.map((email, index) => (
        <div
          key={index}
          onClick={() => setSelectedEmail(email)}
          style={{
            ...styles.userItem,
            backgroundColor: selectedEmail === email ? "#dfe9ff" : "#fff",
          }}
        >
          {email}
        </div>
      ))}
    </div>

    {/* Chat Window */}
    <div style={styles.chatWindow}>
      {selectedEmail ? (
        <>
          <div style={styles.chatHeader}>Chat with {selectedEmail}</div>

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
            <div ref={chatEndRef} />
          </div>

          <div style={styles.inputArea}>
            <input
              type="text"
              placeholder="Type a message…"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleSend} style={styles.sendButton}>
              Send
            </button>
          </div>
        </>
      ) : (
        <div style={styles.placeholder}>Select a user or start a chat to begin messaging</div>
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
  placeholder: {
    margin: "auto",
    fontSize: "18px",
    color: "#888",
  },
};

export default HomePage;
