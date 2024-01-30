import './App.css';
import React, { useState, useEffect } from 'react';
import Header from './components/Header'
import Footer from './components/footer'
import { Route, Routes, Navigate } from "react-router-dom";
import { HomePage } from './pages/HomePage';
import AdminPage from './admin/AdminPage';
import Message from './components/Message';
import SearchEventPage from './pages/SearchEventPage'
import SearchVideoPage from './pages/SearchVideoPage'
import StripeRedirect from './pages/StripeRedirect';
import LoginPage from './pages/LoginPage';
import { v4 as uuidv4 } from "uuid";

function App() {
  const [messages, setMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);

  let userUUID = localStorage.getItem("userUUID");

  if (!userUUID) {
    userUUID = uuidv4();
    localStorage.setItem("userUUID", userUUID);
  }

  const [auth, setAuth] = useState(false);

  useEffect(() => {
  }, [auth]);

  const addMessage = (() => {
    let lastExecutionTime = 0;
  
    return (message, code) => {
      const currentTime = Date.now();
      const timeSinceLastExecution = currentTime - lastExecutionTime;
  
      const threshold = 1000; // 1 second
  
      if (timeSinceLastExecution >= threshold) {
        setMessages((prevMessages) => {
          setMessageIndex((prevMessageIndex) => prevMessageIndex + 1);
          return [...prevMessages, [message, code, messageIndex]];
        });
  
        lastExecutionTime = currentTime;
      }
    };
  })();
  
  return (
    <div className="flex flex-col min-h-screen">
    <Header addMessage={addMessage} />
      <Routes>
        <Route path="/:lang/login" element={<LoginPage setAuth={setAuth} />} />
        <Route path="/:lang/home" element={<HomePage addMessage={addMessage} userUUID={userUUID} />} />
        <Route
          path="/:lang/admin"
          element={auth ? <AdminPage addMessage={addMessage}/> : <Navigate to="/en/login" />}
        />
        <Route path="/:lang?/" exact element={<HomePage addMessage={addMessage} />} />
        <Route path="/:lang/search_event/:eventId?" element={<SearchEventPage addMessage={addMessage} userUUID={userUUID} />} />
        <Route path="/:lang/search_video/:videoId?" element={<SearchVideoPage addMessage={addMessage} userUUID={userUUID} />} />
        <Route path="/:lang/stripe/:success?/:page?/:product?" element={<StripeRedirect addMessage={addMessage} />} />
      </Routes>
    <Footer />
      <div className="fixed top-20 left-0 flex flex-col justify-center items-center w-full z-50">
        {messages.map((message, code) => (
            <Message
            key={message[2]}
            message={message}
            code={code}
          />
        ))}
      </div>
    </div>
  );
}

export default App;