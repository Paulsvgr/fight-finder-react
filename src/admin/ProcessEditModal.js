import React, { useState } from 'react';

const ProcessEditModal = ({ process, onSave, onClose }) => {
    const [status, setStatus] = useState(process.status || 'pending');
    const [date, setDate] = useState(process.date ? process.date.split('T')[0] : '');
    const processId = process.id || '';

    const handleSave = () => {
        const processData = {
            date: date,
            status: status,
        };
        onSave(processId, processData);
    };

    const handleModalClick = (e) => {
        // Prprocess click inside the modal from closing it
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            onClick={onClose}>
            <div className="relative flex justify-center items-center h-full">
                <div className='p-5 border mx-auto shadow-lg rounded-md bg-white'
                    onClick={handleModalClick}>
                    <h3 className="text-lg font-semibold">Edit Event</h3>
                    <div className='flex flex-wrap'>
                        <h3 className="w-full">Name</h3>
                        <p className="w-full p-2 border border-gray-300 rounded mt-2">
                            {process.video_name}
                        </p>
                        <div className="w-full mt-4">
                            <label>Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                            />
                        </div>
                        <h3 className="w-full mt-4">Status</h3>
                        <div className="w-full mt-4">
                        <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                            >
                                <option value='Pending'>
                                    Pending
                                </option>
                                <option value='Completed'>
                                    Completed
                                </option>
                                <option value='Processing'>
                                    Processing
                                </option>
                                <option value='Unsupported'>
                                    Unsupported
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                            Save
                        </button>
                        <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessEditModal;
