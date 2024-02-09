import React, { useState } from 'react';
import client from '../utils/axiosConfig';

const MatchComponent = ({ Match, onMatchClick, MatchTitle, userUUID }) => {
    const isValidMatch = Match && (Match.startframe != null);
    const [hasClicked, setHasClicked] = useState(false);

    const videoYoutubeId = Match.video?.link.match(/[?&]v=([^&]+)/)[1]

    const videoEmbedLink = `https://www.youtube.com/embed/${videoYoutubeId}?enablejsapi=1`

    const vidLink = `https://www.youtube.com/v/${videoYoutubeId}?t=${Match.startframe}s`;

    const recordMatchClick = async (matchId) => {
      if (!hasClicked) {
        try {
          await client.post('/api/clicks/', {
            match_id: matchId,
            source: String(userUUID),
          });
        } catch (error) {
          console.error('Error recording match click:', error);
        }
        setHasClicked(true);
      }
    };

    const handleClick = () => {
      if (isValidMatch) {
        recordMatchClick(Match.id);
        window.open(vidLink, '_blank');
      }
    };

    const handleSeeMatchClick = () => {
      if (isValidMatch) {
        recordMatchClick(Match.id); // Record the click
        onMatchClick(Match.startframe, videoEmbedLink);
      }
    };
  
    return isValidMatch ? (
<div
  key={Match?.id}
  className="max-w-xl mx-auto p-6 bg-white rounded-lg transition-opacity duration-300 ease-in-out"
>
  <div className="space-y-4">
    {MatchTitle && (
      <h3 className="text-2xl font-semibold text-center text-gray-900">{MatchTitle}</h3>
    )}
    {Match.match_type && (
      <div className="text-center">
        <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-2 text-sm font-semibold shadow">
          {Match.match_type}
        </span>
      </div>
    )}
    <div className="flex flex-col items-center space-y-2">
      <span className="block bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-800 shadow">
        {Match.oponent1 ? Match.oponent1.toUpperCase() : "Opponent 1 Undefined"}
      </span>
      <span className="block bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-800 shadow">
        {Match.oponent2 ? Match.oponent2.toUpperCase() : "Opponent 2 Undefined"}
      </span>
    </div>
    <div className="flex justify-center items-end h-full gap-4 mt-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
        onClick={handleSeeMatchClick}
      >
        See Match
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center"
        onClick={handleClick}
      >
        YouTube
      </button>
    </div>
  </div>
</div>

    ) : null;
  };
  
  export default MatchComponent;