import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import VideosImg from '../static/img/background.png';
import LeftSvg from '../static/svg/arrow_left.svg';
import client from '../utils/axiosConfig';
import MatchComponent from '../components/Match';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import VideoPopup from '../components/videoPopup';

const SearchVideoPage = ({ addMessage, userUUID }) => {
    const playerRef = useRef(null);
    const [VideoShow, setVideoShow] = useState(false);
    const [Videos, setVideos] = useState([]);
    const [VideosLength, setVideosLength] = useState(0);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [moreToCome, setMoreToCome] = useState(true);
    const { t } = useTranslation();
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [video, setVideo]  = useState("");
    const [StartSec, setStartSec]  = useState(0);
    const [videoEmbedLink, setvideoEmbedLink]  = useState(null);
    const [loadingShow, setloadingShow] = useState(false);

    const closeVid = () => {
        setVideoShow(false);
        // pause vid
    }
    
    const onMatchClick = (start_sec, videoEmbedLink) => {
        setvideoEmbedLink(videoEmbedLink);
        setVideoShow(true);
        setStartSec(start_sec);
        setloadingShow(true);
        setTimeout(() => {
            setloadingShow(false);
        }, 6000);
    };

    useEffect(() => {
        if (playerRef.current) {
            setTimeout(() => {
                if (playerRef.current) {
                    playerRef.current.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
                    playerRef.current.contentWindow.postMessage(`{"event":"command","func":"seekTo","args":[${StartSec}, true]}`, '*');
                }
                setTimeout(() => {
                    if (playerRef.current) {
                        playerRef.current.contentWindow.postMessage(`{"event":"command","func":"seekTo","args":[${StartSec}, true]}`, '*');
                        playerRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                    }
                }, 4000); // Wait for 2000 milliseconds (2 seconds)
            }, 2000); // Wait for 2000 milliseconds (2 seconds)
        }
      }, [playerRef, StartSec]);

    function ListNoDuplicates(existingList, newList, key = 'id') {
        const uniqueIds = new Set(existingList.map(element => element[key]));
        const filteredNewList = newList.filter(newElement => !uniqueIds.has(newElement[key]));
        return [...existingList, ...filteredNewList];
    }
    
    useEffect(() => {
        client.get(
            `${process.env.REACT_APP_BASE_URL}/api/get_video/${videoId}`
            ).then(function(res) {
            setVideo(res.data);
        }).catch(function() {
            addMessage(t('The video was not found, reload the page and try again'));
            navigate(-1)
        })
    }, [navigate, t, addMessage, videoId]);

    const fetchData = useCallback(async () => {
        if (!videoId) {
            return null;
        }
        try {
            const response = await client.post(
            `${process.env.REACT_APP_BASE_URL}/api/video_search_match/`,
            {
                video_id: parseInt(videoId),
                query: query,
                page: page,
            }
            );
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, [videoId, query, page]);

    const handleSubmit = useCallback(async (e) => {
        if (e) {
            e.preventDefault();    
        }      
        try {
            const response = await fetchData();
            setVideosLength((prevLenght) => prevLenght + response.data.length);
            if (page===1) {
                setVideos(response.data);
                setVideosLength(response.data.length);
            } else {
                setVideosLength((prevLenght) => prevLenght + response.data.length);
                setVideos((prevList) => ListNoDuplicates(prevList, response.data));
            }
            setMoreToCome(response.data.length === 10);
        } catch (error) {
            console.error(error);
        }
    }, [fetchData, page]);

    const handleClickMore = () => {
        setPage((prevPage) => prevPage + 1);
        handleSubmit()
    };

    useEffect(() => {
        handleSubmit()
    }, [videoId, page, handleSubmit])

    const goBack = () => {
        navigate(-1);
      };

    return (
    <div className="w-full flex-1 flex flex-col bg-black">
        <div className="w-full h-[96px] relative">
            <img className="w-full h-full object-cover object-center" src={VideosImg} alt="comps-img" />
        </div>
        <div className="flex flex-wrap justify-center items-center text-white text-center lg:text-4xl text-2xl font-bold mt-4 mb-2">
            <img className="bg-white border-gray-600 rounded-md mr-6 text-black font-bold text-lg py-1 pr-1 hover:cursor-pointer"
                 src={LeftSvg} alt="go-back"
                 onClick={goBack}
                />
            <div className='flex flex-col'>
                <span className='whitespace-nowrap md:text-4xl text-xl'>{video && video.name}</span>
                <span className='whitespace-nowrap md:text-4xl text-xl'>{t('Search for')}:</span>
            </div>
            <span className='bg-black mr-6 text-black font-bold text-lg px-2'>
                &lt;
            </span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col justify-cneter mt-4 items-center ml-auto mr-auto w-full">

            <div className="p-2 rounded-xl flex flex-wrap justify-start w-fit">

                <div className="border-solid border bg-white border-black">
                    <input
                        className='p-1'
                        type="text"
                        placeholder={t("Enter your search query")}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

            </div>

            <input
                className="bg-gray-200 mb-2 ml-auto mr-auto hover:bg-gray-600 hover:text-white hover:cursor-pointer rounded-lg w-fit px-2 py-1 mt-1 font-bold"
                type="submit"
                value={t('Search')} />
        </form>
        <div className='flex flex-col justify-center items-center'>
            {VideosLength >= 1 ? (
                <div className='flex flex-col justify-center items-center w-fit'>
                    <div className="text-white text-center text-2xl font-bold mt-4 mb-10">
                        {t('Available Matches')}:
                    </div>
                    <div className="flex flex-wrap justify-center items-center mb-6 w-full min-h-[50vh]">
                        {Videos?.map((Element) => (
                            <MatchComponent key={Element?.id} Match={Element} onMatchClick={onMatchClick} MatchTitle={null} userUUID={userUUID} />
                        ))}
                    </div>
                    {moreToCome && 
                        <button
                            className={`bg-neutral-100 w-fit rounded-lg mb-2 font-semibold text-black px-4`}
                            onClick={() => handleClickMore()}
                        >
                            more
                        </button>
                    }
                </div>
            ) : (
                <div className="text-white text-center text-2xl font-bold mt-4 mb-10">
                    {t(`No match where found`)}
                </div>
            )}
        </div>
        {
            VideoShow && videoEmbedLink &&
            <VideoPopup playerRef={playerRef} videoEmbedLink={videoEmbedLink} closeVid={closeVid} loadingShow={loadingShow} />
        }
    </div>
    );
};

export default SearchVideoPage;