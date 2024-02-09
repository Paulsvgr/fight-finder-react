const MessageEditModal = ({ message, onSave, onClose }) => {
    const messageId = message.id || '';
    console.log(message)

    const handleSave = () => {
        var messageData = {
            seen: true,
        };
        onSave(messageId, messageData);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this message?')) {
          onSave(messageId, null);
        }
      };

    const handleModalClick = (e) => {
        // Prmessage click inside the modal from closing it
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            onClick={onClose}>
            <div className="relative flex justify-center items-center h-full">
                <div className='p-5 border mx-auto shadow-lg rounded-md bg-white'
                    onClick={handleModalClick}>
                    <h3 className="text-lg font-semibold">See Message</h3>
                    <div className='flex flex-col'>
                        <div className='flex flex-wrap justify-between w-full'>
                            <div className='flex flex-wrap'>
                                <h3 className="w-full mt-2 font-semibold">Name</h3>
                                <span>{message.name}</span>
                                <h3 className="w-full mt-2 font-semibold">Email</h3>
                            </div>
                            <div className='flex flex-wrap'>
                                <h3 className="w-full font-semibold">Date</h3>
                                <p>{message.date}</p>
                                <h3 className="w-full font-semibold">UserUUID</h3>
                                <p>{message.useruuid}</p>                        
                            </div>
                        </div>
                        <span>{message.email}</span>
                        <h3 className="w-full font-semibold">Message</h3>
                        <p>{message.message}</p>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                            Save as seen
                        </button>
                        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
                            Delete
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

export default MessageEditModal;