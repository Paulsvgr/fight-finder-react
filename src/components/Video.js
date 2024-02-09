import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const VideoComponent = ({ Video }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isValidVideo = Video && Video.percentage > 0;

  const videoYoutubeId = Video.link?.match(/[?&]v=([^&]+)/)[1];

  const YouTubeThumbnail = `https://img.youtube.com/vi/${videoYoutubeId}/0.jpg`;

  const handleClick = () => {
    if (isValidVideo) {
      navigate(`/${i18n.language}/search_video/${Video.id}`);
    }
  };

  return (
<div
  key={Video?.id}
  className={`video-id-${Video.id} w-[90vw] md:w-[50vw] lg:w-[33vw] xl:w-[25vw] mx-4 my-8 transition-opacity duration-300 ease-in-out shadow-lg hover:shadow-xl ${isValidVideo ? 'opacity-100 hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
  onClick={isValidVideo ? handleClick : null}
>
  <div className="w-full bg-white p-4 rounded-lg overflow-hidden border border-gray-200"
      style={{
          backgroundImage: `linear-gradient(to right, #f0f0f0 ${Video.percentage}%, #e0e0e0 ${Video.percentage}%)`,
      }}>
      <div className='text-center space-y-4'>
          {/* Thumbnail Image */}
          {isValidVideo && 
              <img 
                src={YouTubeThumbnail}
                alt={`${Video.name} thumbnail`} 
                className="w-full h-auto rounded-md transition-transform duration-300 ease-in-out"
              />
          }

          <p className="text-lg md:text-xl font-semibold text-gray-800 border-[1px] shadow-xl rounded-lg p-2">{Video.name}</p>
      </div>
      {!isValidVideo && 
          <div className='text-center mt-4'>
              <p className="text-md font-medium text-gray-500">{t('Not analyzed yet')}</p>
          </div>
      }
  </div>
</div>
  );
};

export default VideoComponent;
