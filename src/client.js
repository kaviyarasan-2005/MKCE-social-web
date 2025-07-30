import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Client() {
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });
  }, []);

  const handleLogin = () => {
    socket.emit("register", email);
    setLoggedIn(true);
  };

  const sendMessage = () => {
    socket.emit("send_message", {
      sender: email,
      receiver,
      message,
    });
    setChat((prev) => [...prev, { sender_email: email, message }]);
    setMessage("");
  };

  if (!loggedIn) {
    return (
      <div>
        <h2>Login with College Email</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Logged in as {email}</h2>
      <input
        placeholder="Receiver email"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
      />
      <input
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <div style={{ marginTop: "20px" }}>
        <h3>Messages:</h3>
        {chat.map((msg, i) => (
          <p key={i}>
            <strong>{msg.sender_email}:</strong> {msg.message}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Client;