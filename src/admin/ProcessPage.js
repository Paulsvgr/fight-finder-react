import React, { useState, useEffect, useCallback } from 'react';
import client from '../utils/axiosConfig';
import ProcessEditModal from './ProcessEditModal';

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

function ProcessPage({ addMessage }) {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProcess, setEditingProcess] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);

  const sortProcesses = (processes) => {
    const statusOrder = { 'Processing': 1, 'Pending': 2, 'Unsupported':3, 'Completed': 4 };
    return processes.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`/api/tasks/?page=${page}`);
        setProcesses(prevProcesses => sortProcesses(ListNoDuplicates(prevProcesses, response.data)));
      } catch (error) {
        console.error('Error fetching Process:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

  }, [refreshKey, page]);

  const handleEdit = (process) => {
    setEditingProcess(process);
  };

  const handleUpdateProcess = async (processId, about) => {
    try {
      // Update or create new Process
      await client.put(`/api/process/${processId}`, about);
      addMessage("Process updated successfully", "green");  
    } catch (error) {
      // Handle errors (e.g., network issues, server errors)
      console.error('Error:', error);
      addMessage("An error occurred: " + error.message, "red");
    }
    setEditingProcess(null); // Close the modal after saving
    setRefreshKey(oldKey => oldKey + 1);
    setPage(1)
  };

  const updateSetrefreshKey = useCallback(() => {
    setRefreshKey(oldKey => oldKey + 1);
  }, []);

  useEffect(() => {
    updateSetrefreshKey();
    const interval = setInterval(updateSetrefreshKey, 10000);
    return () => clearInterval(interval);
  }, [updateSetrefreshKey]);

  const Process = ({ process }) => {
    const getStatusClass = (status) => {
      switch (status) {
        case 'Processing':
          return 'text-yellow-500';
        case 'Pending':
          return 'text-grey-700';
        case 'Completed':
          return 'text-green-600';
        case 'Unsupported':
          return 'text-red-600';
        default:
          return '';
      }
    };

    const formattedPercentage = process.video_percentage.toFixed(0);

    return (
      <div 
        className="flex justify-between shadow-xl w-full border-b border-gray-200 p-4">
        <div className='flex w-full justify-between'>
          <h3 className={`text-lg mr-2 font-semibold ${getStatusClass(process.status)}`}>
            {formattedPercentage}% {process.status}
          </h3> 
          <h3 className="text-lg font-semibold"> - {process.video_name}</h3>
          <p className='text-lg ml-4'>{new Date(process.date).toLocaleDateString()}</p>
        </div>
        <div className='flex items-center'>
          <button 
            onClick={() => handleEdit(process)}
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
        <h1 className="text-2xl font-bold mb-4">Processes</h1>
      </div>
      <div className='flex justify-center flex-col items-start w-full'>
        {loading && processes.length === 0 ? (
          <p>Loading Processes...</p>
        ) : processes.length > 0 ? (
          <>
            {processes.map(process => (
              <Process
                key={process.id}
                process={process}
              />
            ))}
          </>
        ) : (
          <p>No Processes found.</p>
        )}
      </div>
      {editingProcess && (
        <ProcessEditModal
          process={editingProcess}
          onSave={handleUpdateProcess}
          onClose={() => setEditingProcess(null)}
        />
      )}
    </div>
  );  
};
  
export default ProcessPage;
