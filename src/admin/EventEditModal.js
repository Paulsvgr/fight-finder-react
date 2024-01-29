import React, { useState } from 'react';

const EventEditModal = ({ event, onSave, onClose }) => {
    const [name, setName] = useState(event.name || '');
    const [textfield, setTextfield] = useState(event.textfield || '');
    const [date, setDate] = useState(event.date || '');
    const [analyzed, setAnalyzed] = useState(event.analyzed || false);
    const [percentage, setPercentage] = useState(event.percentage || 0);
    const eventId = event.id || 'new';

    const handleSave = () => {
        const eventData = {
            name: name,
            date: date,
            textfield: textfield,
            analyzed: analyzed,
            percentage: percentage
        };
        onSave(eventId, eventData);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this name?')) {
          onSave(eventId, null);
        }
      };

    const handleModalClick = (e) => {
        // Prevent click inside the modal from closing it
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            onClick={onClose}>
            <div className="relative flex justify-center items-center h-full">
                <div className='p-5 border mx-auto shadow-lg rounded-md bg-white'
                    onClick={handleModalClick}>
                    <h3 className="text-lg font-semibold">{eventId === 'new' ? 'Add' : 'Edit'} Event</h3>
                    <div className='flex flex-wrap'>
                        <h3 className="w-full">Name</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                        />
                        <div className="w-full mt-4">
                            <label>Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                            />
                        </div>
                        <h3 className="w-full mt-4">Textfield</h3>
                        <textarea
                            value={textfield}
                            onChange={(e) => setTextfield(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                            rows="3"
                        />
                        <div className="w-full mt-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={analyzed}
                                    onChange={(e) => setAnalyzed(e.target.checked)}
                                    className="mr-2"
                                />
                                Analyzed
                            </label>
                        </div>
                        <div className="w-full mt-4">
                            <label>Percentage</label>
                            <input
                                type="number"
                                value={percentage}
                                onChange={(e) => setPercentage(parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                            {eventId === 'new' ? 'Add' : 'Save'}
                        </button>
                        {eventId !== 'new' &&
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

export default EventEditModal;
