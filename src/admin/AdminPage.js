import React, { useState } from 'react';
import EventsPage from './EventsPage';
import VideoPage from './VideoPage';
import ProcessPage from './ProcessPage';
import SourcePage from './SourcePage';

const AdminPage = ({ addMessage }) => {
  const [activeSection, setActiveSection] = useState('process');

  return (
    <div className="container mx-auto mt-32 flex flex-1 flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setActiveSection('event')}
          className={`${activeSection === 'event'? 'bg-blue-700' : 'bg-blue-500'} hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-1 px-4 rounded`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveSection('video')}
          className={`${activeSection === 'video'? 'bg-blue-700' : 'bg-blue-500'} hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-1 px-4 rounded`}
        >
          Videos
        </button>
        <button
          onClick={() => setActiveSection('process')}
          className={`${activeSection === 'process'? 'bg-blue-700' : 'bg-blue-500'} hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-1 px-4 rounded`}
        >
          Process
        </button>
        <button
          onClick={() => setActiveSection('source')}
          className={`${activeSection === 'source'? 'bg-blue-700' : 'bg-blue-500'} hover:cursor-pointer hover:bg-blue-700 text-white font-bold py-1 px-4 rounded`}
        >
          Source
        </button>
      </div>
      {activeSection === 'event' && <EventsPage addMessage={addMessage} />}
      {activeSection === 'video' && <VideoPage addMessage={addMessage} />}
      {activeSection === 'process' && <ProcessPage addMessage={addMessage} />}
      {activeSection === 'source' && <SourcePage addMessage={addMessage} />}
    </div>  );
};

export default AdminPage;
