import React, { useState, useEffect, useCallback } from 'react';
import client from '../utils/axiosConfig';

function ProcessPage({ addMessage }) {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const sortProcesses = (processes) => {
    const statusOrder = { 'Unsupported':1, 'Processing': 2, 'Pending': 3, 'Completed': 4 };
    return processes.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await client.get(`/api/tasks/`);
      const sortedData = sortProcesses(response.data);
      setProcesses(sortedData);
    } catch (error) {
      console.error('Error fetching Processes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

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
    </div>
  );  
};
  
export default ProcessPage;