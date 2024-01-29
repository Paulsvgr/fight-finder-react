const MatchComponent = ({ Match, onMatchClick, MatchTitle }) => {
    const isValidMatch = Match && Match.startframe;

    const videoYoutubeId = Match.video.link.match(/[?&]v=([^&]+)/)[1]

    const videoEmbedLink = `https://www.youtube.com/embed/${videoYoutubeId}?enablejsapi=1`

    const vidLink = `https://www.youtube.com/v/${videoYoutubeId}?t=${Match.startframe}s`;

    const handleClick = () => {
      if (isValidMatch) {
          window.open(vidLink, '_blank');
      }
    };
  
    return isValidMatch ? (
      <div
        key={Match?.id}
        className={`w-[90vw] md:w-[50vw] lg:w-[33vw] xl:w-[25vw] p-4 transition-opacity duration-300 ease-in-out ${isValidMatch ? 'opacity-100 transition-all' : 'opacity-50'}`}
      >
        <div className="w-full bg-white p-4 border border-gray-300 rounded-md">
          <div>
            <div className="flex w-full flex-wrap justify-between">
              {MatchTitle && 
                <span className="text-lg font-bold bg-gray-500 rounded-md p-1 w-fit">{MatchTitle}</span>
              }
              {Match.match_type && 
                <span className="text-lg font-bold bg-gray-400 rounded-md p-1 w-fit">{Match.match_type}</span>
              }
            </div>
            <div className="flex w-full flex-wrap justify-between items-center p-4 bg-white">
              <div className="flex flex-col justify-start items-start">
                <span className="text-sm lg:text-md font-medium p-2 mb-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg">
                    {Match.oponent1 ? Match.oponent1 : "Oponent1 undefined"}
                </span>
                <span className="text-sm lg:text-md font-medium p-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg">
                    {Match.oponent2 ? Match.oponent2 : "Oponent2 undefined"}
                </span>
              </div>
              <div className='flex justify-around items-center mt-1'>
                <button 
                    className='flex items-center justify-center font-medium whitespace-nowrap w-fit mx-2 px-4 py-2 hover:cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md transition duration-300 ease-in-out'
                    onClick={() => onMatchClick(Match.startframe, videoEmbedLink)}>
                        <i className="fas fa-play-circle"></i> See Match
                </button>
                <button 
                    className='flex items-center justify-center font-medium w-fit mx-2 px-4 py-2 hover:cursor-pointer rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md transition duration-300 ease-in-out'
                    onClick={handleClick}>
                        <i className="fab fa-youtube"></i> YouTube
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  };
  
  export default MatchComponent;