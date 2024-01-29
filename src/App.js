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
import LoadingSvg from './static/svg/loading.svg';

function App() {
  const [messages, setMessages] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    console.log("AUTH", auth)
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

  const setLoading = (showLoader) => {
    setIsLoading(showLoader);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
    <Header addMessage={addMessage} />
      <Routes>
        <Route path="/:lang/login" element={<LoginPage setAuth={setAuth} />} />
        <Route path="/:lang/home" element={<HomePage addMessage={addMessage} />} />
        <Route
          path="/:lang/admin"
          element={auth ? <AdminPage addMessage={addMessage}/> : <Navigate to="/en/login" />}
        />
        <Route path="/:lang?/" exact element={<HomePage addMessage={addMessage} />} />
        <Route path="/:lang/search_event/:eventId?" element={<SearchEventPage addMessage={addMessage} setLoading={setLoading} />} />
        <Route path="/:lang/search_video/:videoId?" element={<SearchVideoPage addMessage={addMessage} setLoading={setLoading} />} />
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
      {isLoading && 
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 opacity-0 transition-opacity duration-1000">
                <div className="w-full h-full bg-black opacity-50"></div>
            </div>
            <div className="fixed w-full h-full flex items-center justify-center opacity-0 transition-opacity duration-1000 w-[150px]">
                <img src={LoadingSvg} alt="Loading"/>
            </div>
        </div>
      }
    </div>
  );
}

export default App;