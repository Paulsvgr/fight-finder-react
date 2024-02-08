import React, { useState, useEffect } from 'react';
import client from '../utils/axiosConfig';
import MessageEditModal from './MessageEditModal';

function ListNoDuplicates(existingList, newList, key = 'id') {
  const existingMap = new Map(existingList.map(element => [element[key], element]));

  const mergedList = newList.map(newElement => {
    const existingElement = existingMap.get(newElement[key]);
    if (existingElement) {
      return { ...existingElement, ...newElement };
    }
    return newElement;
  });

  return mergedList;
}

function MessagePage({ addMessage }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);

  const sortMessages = (messages) => {
    return messages.sort((a, b) => {
      if (a.seen !== b.seen) {
        return a.seen ? 1 : -1;
      }
      return a.status.localeCompare(b.status);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`/api/messages/?page=${page}`);
        setMessages(prevMessages => sortMessages(ListNoDuplicates(prevMessages, response.data)));
      } catch (error) {
        console.error('Error fetching Message:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, [refreshKey, page]);

  const handleEdit = (message) => {
    setEditingMessage(message);
  };

  const handleUpdateMessage = async (messageId, about) => {
    try {
      let response;
      if (about === null) {
        // Delete Video
        response = await client.delete(`/api/message/${messageId}`);
        addMessage("Video deleted successfully", "green");
      } else {
        // Update or create new Message
        response = await client.put(`/api/message/${messageId}`, about);
        addMessage("Message updated successfully", "green");
      }

      if (!(response && response.status >= 200 && response.status < 300)) {
        addMessage("Something went wrong", "red");
      }
    } catch (error) {
      // Handle errors (e.g., network issues, server errors)
      console.error('Error:', error);
      addMessage("An error occurred: " + error.message, "red");
    }
    setEditingMessage(null); // Close the modal after saving
    setRefreshKey(oldKey => oldKey + 1);
    setPage(1)
  };

  const Message = ({ message }) => {
    const getStatusClass = (status) => {
      return status ? 'text-gray-500' : 'text-green-700';
    };

    const formattedPercentage = message.video_percentage.toFixed(0);

    return (
      <div
        className="flex justify-between shadow-xl w-full border-b border-gray-200 p-4">
        <div className='flex w-full justify-between'>
          <h3 className={`text-lg mr-2 font-semibold ${getStatusClass(message.status)}`}>
            {formattedPercentage}% {message.status}
          </h3>
          <h3 className="text-lg font-semibold"> - {message.video_name}</h3>
          <p className='text-lg ml-4'>{new Date(message.date).toLocaleDateString()}</p>
        </div>
        <div className='flex items-center'>
          <button
            onClick={() => handleEdit(message)}
            className="bg-blue-500 hover:bg-blue-700 text-white h-fit font-bold py-1 px-2 rounded mx-2"
          >
            Edit
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-20 mx-4 flex flex-1 flex-col items-center">
      <div className='flex flex-wrap justify-between'>
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
      </div>
      <div className='flex justify-center flex-col items-start w-full'>
        {loading && messages.length === 0 ? (
          <p>Loading Messages...</p>
        ) : messages.length > 0 ? (
          <>
            {messages.map(message => (
              <Message
                key={message.id}
                message={message}
              />
            ))}
          </>
        ) : (
          <p>No Messages found.</p>
        )}
      </div>
      {editingMessage && (
        <MessageEditModal
          message={editingMessage}
          onSave={handleUpdateMessage}
          onClose={() => setEditingMessage(null)}
        />
      )}
    </div>
  );
};

export default MessagePage;