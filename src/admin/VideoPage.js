import React, { useState, useEffect } from 'react';
import client from '../utils/axiosConfig';
import VideoEditModal from './VideoEditModal'; // Import a modal component for editing Videos

function ListNoDuplicates(existingList, newList, key = 'id') {
  const uniqueIds = new Set(existingList.map(element => element[key]));
  const filteredNewList = newList.filter(newElement => !uniqueIds.has(newElement[key]));
  return [...existingList, ...filteredNewList];
}

function VideoPage({ addMessage }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.post(
          `/api/videos_search/`,
          { query: '', page: page },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setVideos((prevList) => ListNoDuplicates(prevList, response.data));
      } catch (error) {
        console.error('Error fetching Videos:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [refreshKey, page]);

  const handleEdit = (video) => {
    setEditingVideo(video);
  };

  const handleSaveVideo = async (videoId, about) => {
    try {
      let response;
  
      if (about === null) {
        // Delete Video
        response = await client.delete(`/api/video/${videoId}`);
        addMessage("Video deleted successfully", "green");
      } else {
        // Update or create new Video
        if (videoId === 'new') {
          response = await client.post(`/api/video`, about);
          addMessage("Video created successfully", "green");
        } else {
          response = await client.put(`/api/video/${videoId}`, about);
          addMessage("Video updated successfully", "green");
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
    setEditingVideo(null); // Close the modal after saving
    setRefreshKey(oldKey => oldKey + 1);
    setVideos([]) // Trigger a refresh of the Video list
    setPage(1)
  };
  

  const handleAddVideo = () => {
    setEditingVideo({ question: '', answer: '' }); // Empty Video for adding a new one
  };

  const Video = ({ video }) => {  
    return (
      <div className="flex justify-between w-full border-b border-gray-200 p-4">
        <div>
          <h3 className="text-lg font-semibold">{video.name}</h3>
        </div>
        <div className='flex items-center'>
          <button 
            onClick={() => handleEdit(video)}
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
        <h1 className="text-2xl font-bold mb-4">Video</h1>
        <button 
          onClick={handleAddVideo}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 ml-6"
        >
          Add Video
        </button>
      </div>
      <div className='flex flex-col items-start h-[50vh] overflow-y-scroll w-full'>
        {loading ? (
          <p>Loading Videos...</p>
        ) : videos.length > 0 ? (
          <>
            {videos.map(video => (
              <Video
                key={video.id}
                video={video}
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
          <p>No Video found.</p>
        )}
      </div>
      {editingVideo && (
        <VideoEditModal
          video={editingVideo}
          onSave={handleSaveVideo}
          onClose={() => setEditingVideo(null)}
        />
      )}
    </div>
  );  
};
  
export default VideoPage;
