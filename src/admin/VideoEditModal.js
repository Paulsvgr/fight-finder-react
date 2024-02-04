import React, { useState, useEffect } from 'react';
import client from '../utils/axiosConfig';

const VideoEditModal = ({ video, onSave, onClose }) => {
    const [name, setName] = useState(video.name || '');
    const [link, setLink] = useState(video.link || '');
    const [eventId, setEventId] = useState(video.eventId || 1);
    const [textfield, setTextfield] = useState(video.textfield || '');
    const [sourceId, setSourceId] = useState([]);
    const [sources, setSources] = useState([]);
    const [percentage, setPercentage] = useState(video.percentage || 0);
    const videoId = video.id || 'new';
    const [events, setEvents] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await client.post(
            `/api/events_search/`,
            { page_size: 100 },
            { headers: { 'Content-Type': 'application/json' } }
          );
          setEvents(response.data);
          const sourceResponse = await client.get('/api/sources');
          setSources(sourceResponse.data);

        } catch (error) {
          console.error('Error fetching Events:', error);
        }
      };
    
      fetchData();
    }, []);

    const handleSave = () => {
        var videoData = {
            name: name,
            link: link,
            source_id: sourceId,
            textfield: textfield || ' ',
            percentage: percentage,
            event_id: eventId
        };
        if (videoId === 'new') {
            videoData = {
                link: link,
                source_id: sourceId,
                event_id: eventId
            };
        }
        onSave(videoId, videoData);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this name?')) {
          onSave(videoId, null);
        }
      };

    const handleModalClick = (e) => {
        // Prvideo click inside the modal from closing it
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            onClick={onClose}>
            <div className="relative flex justify-center items-center h-full">
                <div className='p-5 border mx-auto shadow-lg rounded-md bg-white'
                    onClick={handleModalClick}>
                    <h3 className="text-lg font-semibold">{videoId === 'new' ? 'Add' : 'Edit'} Video</h3>
                    <div className='flex flex-wrap'>
                        <h3 className="w-full">Link</h3>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                        />
                        <h3 className="w-full">Source</h3>
                        <select
                            value={sourceId}
                            onChange={(e) => setSourceId(parseFloat(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                        >
                            {sources.map(src => (
                                <option key={src.id} value={src.id}>
                                    {src.name}
                                </option>
                            ))}
                        </select>
                        {videoId !== 'new' &&
                            <>
                                <h3 className="w-full">Name</h3>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded mt-2"
                                />                        
                                <h3 className="w-full mt-4">Textfield</h3>
                                <textarea
                                    value={textfield}
                                    onChange={(e) => setTextfield(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded mt-2"
                                    rows="3"
                                />                  
                                <div className="w-full mt-4">
                                    <label>Percentage</label>
                                    <input
                                        type="number"
                                        value={percentage}
                                        onChange={(e) => setPercentage(parseFloat(e.target.value))}
                                        className="w-full p-2 border border-gray-300 rounded mt-2"
                                    />
                                </div>
                            </>
                        }
                        <div className="w-full mt-4">
                            <label>Event</label>
                            <select
                                value={eventId}
                                onChange={(e) => setEventId(parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                            >
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>
                                        {event.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                            {videoId === 'new' ? 'Add' : 'Save'}
                        </button>
                        {videoId !== 'new' &&
                            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
                                Delete
                            </button>
                        }
                        <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoEditModal;