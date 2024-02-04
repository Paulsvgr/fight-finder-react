import React, { useState, useEffect } from 'react';
import client from '../utils/axiosConfig';

function ListNoDuplicates(existingList, newList, key = 'id') {
  const uniqueIds = new Set(existingList.map(element => element[key]));
  const filteredNewList = newList.filter(newElement => !uniqueIds.has(newElement[key]));
  return [...existingList, ...filteredNewList];
}

function SourcePage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
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
  }, [page]);

  const Source = ({ source }) => {  
    return (
      <div className="flex justify-between w-full border-b border-gray-200 p-4">
        <div>
          <h3 className="text-lg font-semibold">{source.name}</h3>
        </div>
      </div>
    );
  };
  
  return (
    <div className="mt-20 mx-4 flex flex-1 flex-col items-center">
      <div className='flex flex-wrap justify-between'>
        <h1 className="text-2xl font-bold mb-4">Source</h1>
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
            <button 
              onClick={() => setPage(prevPage => prevPage + 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 ml-auto mr-auto px-4 rounded mt-4"
            >
              More
            </button>
          </>
        ) : (
          <p>No Source found.</p>
        )}
      </div>
    </div>
  );  
};
  
export default SourcePage;
