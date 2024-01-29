import loadingSvg from '../static/svg/loading.svg';

const VideoPopup = ({ playerRef, videoEmbedLink, closeVid, loadingShow }) => {

  // Function to handle the backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeVid();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
      onClick={handleBackdropClick}
      >
      <div className={`${ loadingShow || "hidden" } absolute top-0 right-0 left-0 flex justify-center items-center h-full z-10`}>
        <img className='w-[100px] h-[100px]' src={loadingSvg} alt="Loading" />
      </div>
      <div className={`${ loadingShow && "hidden" } relative bg-blue-700 rounded-lg overflow-hidden shadow-xl transform transition-all 
            h-[56vw] w-full lg:w-[80vw] lg:h-[44vw]`}
            onClick={(e) => e.stopPropagation()}
        >
        <button
        className="absolute right-0 font-semibold text-center bg-blue-700 pl-1 mr-1 w-fit text-white hover:text-gray-900"
        onClick={closeVid}
        >
        x
        </button>
        <div className="w-full h-full border-4 border-blue-700">
            <iframe
              ref={playerRef}
              title="YouTube Video"
              className="w-full h-full rounded-md"
              src={videoEmbedLink}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoPopup;