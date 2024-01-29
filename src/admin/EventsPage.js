import React, { useState, useEffect } from 'react';
import client from '../utils/axiosConfig';
import EventEditModal from './EventEditModal'; // Import a modal component for editing Events

function ListNoDuplicates(existingList, newList, key = 'id') {
  const uniqueIds = new Set(existingList.map(element => element[key]));
  const filteredNewList = newList.filter(newElement => !uniqueIds.has(newElement[key]));
  return [...existingList, ...filteredNewList];
}

function EventPage({ addMessage }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.post(
          `/api/events_search/`,
          { query: '', page: page },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setEvents((prevList) => ListNoDuplicates(prevList, response.data));
      } catch (error) {
        console.error('Error fetching Events:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [refreshKey, page]);

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  const handleSaveEvent = async (eventId, about) => {
    try {
      let response;
  
      if (about === null) {
        // Delete Event
        response = await client.delete(`/api/event/${eventId}`);
        addMessage("Event deleted successfully", "green");
      } else {
        // Update or create new Event
        if (eventId === 'new') {
          response = await client.post(`/api/event`, about);
          addMessage("Event created successfully", "green");
        } else {
          response = await client.put(`/api/event/${eventId}`, about);
          addMessage("Event updated successfully", "green");
        }
      }
  
      // Check if the response was successful
      if (!(response && response.status >= 200 && response.status < 300)) {
        addMessage("Something went wrong", "red");
      }
    } catch (error) {
      // Handle errors (e.g., network issues, server errors)
      console.error('Error:', error);
      addMessage("An error occurred: " + error.message, "red");
    }
    setEditingEvent(null); // Close the modal after saving
    setRefreshKey(oldKey => oldKey + 1);
    setEvents([]) // Trigger a refresh of the Event list
    setPage(1)
  };
  

  const handleAddEvent = () => {
    setEditingEvent({ question: '', answer: '' }); // Empty Event for adding a new one
  };

  const Event = ({ event }) => {  
    return (
      <div className="flex justify-between w-full border-b border-gray-200 p-4">
        <div className='flex w-wull justify-between'>
          <h3 className="text-lg mr-2">{event.id} -</h3>
          <h3 className="text-lg font-semibold">{event.name}</h3>
        </div>
        <div className='flex items-center'>
          <button 
            onClick={() => handleEdit(event)}
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
        <h1 className="text-2xl font-bold mb-4">Event</h1>
        <button 
          onClick={handleAddEvent}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 ml-6"
        >
          Add Event
        </button>
      </div>
      <div className='flex justify-center flex-col items-start w-full'>
        {loading ? (
          <p>Loading Events...</p>
        ) : events.length > 0 ? (
          <>
            {events.map(event => (
              <Event
                key={event.id}
                event={event}
              />
            ))}
            <button 
              onClick={() => setPage(prevPage => prevPage + 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 ml-auto mr-auto px-4 rounded mt-4"
            >
              More
            </button>
          </>
        ) : (
          <p>No Event found.</p>
        )}
      </div>
      {editingEvent && (
        <EventEditModal
          event={editingEvent}
          onSave={handleSaveEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );  
};
  
export default EventPage;
