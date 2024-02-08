import React, { useState } from 'react';
import ElementsImg from '../static/img/background.png';

const ChatBotComponent = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
  
    const sendMessageToBackend = async (message) => {
      const response = { id: messages.length + 1, text: message, sender: 'user' };
      setMessages([...messages, response]);
      setTimeout(() => {
        const backendResponse = { id: messages.length + 2, text: `Echo: ${message}`, sender: 'bot' };
        setMessages((currentMessages) => [...currentMessages, backendResponse]);
      }, 1000);
    };
  
    const handleSendMessage = () => {
      if (newMessage.trim()) {
        sendMessageToBackend(newMessage.trim());
        setNewMessage('');
      }
    };
  
    const handleInputChange = (event) => {
      setNewMessage(event.target.value);
    };
  
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleSendMessage();
      }
    };
  
    return (
      <div style={{ backgroundImage: `url(${ElementsImg})`, backgroundSize: 'cover' }} className="fixed md:rounded-xl bottom-0 md:bottom-4 md:right-4 top-0 md:top-auto right-0 left-0 md:left-auto w-full md:w-auto h-full md:h-auto z-0">
        <div className="chat-bot-component bg-gray-800 bg-opacity-95 text-white shadow-lg rounded-lg p-4 mx-auto md:min-h-[300px] h-full overflow-y-auto flex justify-center items-end" style={{ maxHeight: '100vh' }}>
          <div className="messages overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)', padding: '1rem' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className="inline-block bg-gray-700 rounded px-4 py-2 my-2">{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="message-input flex">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 border rounded p-2 mr-2 bg-gray-700 text-white"
            />
            <button onClick={handleSendMessage} className="bg-blue-500 text-white rounded px-4 py-2">
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ChatBotComponent;  
