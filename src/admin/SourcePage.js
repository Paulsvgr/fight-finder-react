import React, { useState, useEffect } from 'react';
import client from '../utils/axiosConfig';
// import SourceEditModal from './SourceEditModal';

function ListNoDuplicates(existingList, newList, key = 'id') {
  const uniqueIds = new Set(existingList.map(element => element[key]));
  const filteredNewList = newList.filter(newElement => !uniqueIds.has(newElement[key]));
  return [...existingList, ...filteredNewList];
}

function SourcePage({ addMessage }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [refreshKey, setRefreshKey] = useState(0);
  // const [editingSource, setEditingSource] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`/api/sources/`);
        setSources((prevList) => ListNoDuplicates(prevList, response.data));
      } catch (error) {
        console.error('Error fetching Sources:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  // }, [refreshKey]);
  }, []);

  // const handleEdit = (source) => {
  //   setEditingSource(source);
  // };

  // const handleSaveSource = async (sourceId, about) => {
  //   try {
  //     let response;
  
  //     if (about === null) {
  //       // Delete Source
  //       response = await client.delete(`/api/source/${sourceId}`);
  //       addMessage("Source deleted successfully", "green");
  //     } else {
  //       // Update or create new Source
  //       if (sourceId === 'new') {
  //         response = await client.post(`/api/source`, about);
  //         addMessage("Source created successfully", "green");
  //       } else {
  //         response = await client.put(`/api/source/${sourceId}`, about);
  //         addMessage("Source updated successfully", "green");
  //       }
  //     }
  //     // Check if the response was successful
  //     if (!(response && response.status >= 200 && response.status < 300)) {
  //       addMessage("Something went wrong", "red");
  //     }
  //   } catch (error) {
  //     // Handle errors (e.g., network issues, server errors)
  //     console.error('Error:', error);
  //     addMessage("An error occurred: " + error.message, "red");
  //   }
  //   setEditingSource(null); // Close the modal after saving
  //   setRefreshKey(oldKey => oldKey + 1);
  //   setSources([])
  // };

  // const handleAddSource = () => {
  //   setEditingSource(true); // Empty Source for adding a new one
  // };

  const Source = ({ source }) => {  
    return (
      <div className="flex justify-between w-full border-b border-gray-200 p-4">
        <div className='flex w-wull justify-between'>
          <h3 className="text-lg mr-2">{source.id} -</h3>
          <h3 className="text-lg font-semibold">{source.name}</h3>
        </div>
        {/* <div className='flex items-center'>
          <button 
            onClick={() => handleEdit(source)}
            className="bg-blue-500 hover:bg-blue-700 text-white h-fit font-bold py-1 px-2 rounded mx-2"
          >
            Edit
          </button>
        </div> */}
      </div>
    );
  };
  
  return (
    <div className="mt-20 mx-4 flex flex-1 flex-col items-center">
      <div className='flex flex-wrap justify-between'>
        <h1 className="text-2xl font-bold mb-4">Source</h1>
        {/* <button 
          onClick={handleAddSource}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 ml-6"
        >
          Add Source
        </button> */}
      </div>
      <div className='flex flex-col items-start h-[50vh] overflow-y-scroll w-full'>
        {loading ? (
          <p>Loading Sources...</p>
        ) : sources.length > 0 ? (
          <>
            {sources.map(source => (
              <Source
                key={source.id}
                source={source}
              />
            ))}
          </>
        ) : (
          <p>No Source found.</p>
        )}
      </div>
      {/* {editingSource && (
        <SourceEditModal
          event={editingSource}
          onSave={handleSaveSource}
          onClose={() => setEditingSource(null)}
        />
      )} */}
    </div>
  );  
};
  
export default SourcePage;
