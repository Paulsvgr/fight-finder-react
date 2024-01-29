import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const VideoComponent = ({ Video }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isValidVideo = Video && Video.percentage > 0;

  const videoYoutubeId = Video.link.match(/[?&]v=([^&]+)/)[1];

  const YouTubeThumbnail = `https://img.youtube.com/vi/${videoYoutubeId}/0.jpg`;

  const handleClick = () => {
    if (isValidVideo) {
      navigate(`/${i18n.language}/search_video/${Video.id}`);
    }
  };

  return (
    <div
        key={Video?.id}
        className={`video-id-${Video.id} w-[90vw] md:w-[50vw] lg:w-[33vw] xl:w-[25vw] m-4 transition-opacity duration-300 ease-in-out ${isValidVideo ? 'opacity-100 hover:opacity-90 hover:cursor-pointer' : 'opacity-70'}`}
        onClick={isValidVideo ? handleClick : null}
    >
        <div className="w-full bg-white p-2 py-6 border border-gray-300 rounded-md"
            style={{
                backgroundImage:`linear-gradient(90deg, white ${Video.percentage}%,  grey ${Video.percentage}%)`,
            }}>
            <div className='text-center'>
                {/* Thumbnail Image */}
                {isValidVideo && 
                    <img 
                      src={YouTubeThumbnail}
                      alt={`${Video.name} thumbnail`} 
                      className="w-full h-auto"
                    />
                }

                <p className="md:text-xl text-lg font-bold">{Video.name}</p>
            </div>
            {!isValidVideo && 
                <div className='text-center'>
                    <p className="text">{t('Not analyzed yet')}</p>
                </div>
            }
        </div>
    </div>
  );
};

export default VideoComponent;
