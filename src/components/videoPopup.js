const VideoPopup = ({ playerRef, videoEmbedLink, closeVid, loadingShow }) => {

  // Function to handle the backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closeVid();
    }
  };

  return (
<div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50"
      onClick={handleBackdropClick} aria-modal="true" role="dialog">
  <div className={`${loadingShow ? "" : "hidden"} absolute top-0 right-0 left-0 flex justify-center items-center h-full z-10`}>
    <div className='w-[100px] h-[100px] animate-spin rounded-full border-t-4 border-blue-500'></div> {/* Example for a CSS spinner */}
  </div>
  <div className={`${loadingShow ? "hidden" : ""} relative bg-blue-700 rounded-lg overflow-hidden shadow-xl transform transition-all 
        h-[56vw] w-full max-w-[95vw] lg:max-h-[90vh] max-h-[100vh] lg:h-[44vw]`}
        onClick={(e) => e.stopPropagation()}
    >
    <button
      className="absolute top-0 right-0 m-2 text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-center text-lg px-2"
      onClick={closeVid}
      aria-label="Close video"
    >
      &times;
    </button>
    <div className="w-full h-full border-2 border-blue-700">
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