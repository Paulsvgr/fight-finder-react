import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ElementsImg from '../static/img/background.png';
import client from '../utils/axiosConfig';
import VideoComponent from '../components/Video';
import MatchComponent from '../components/Match';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPopup from '../components/videoPopup';
import LeftSvg from '../static/svg/arrow_left.svg';

const SearchEventPage = ({ addMessage }) => {
    const playerRef = useRef(null);
    const [VideoShow, setVideoShow] = useState(false);
    const [Elements, setElements] = useState([]);
    const [ElementsLength, setElementsLength] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState('video');
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [moreToCome, setMoreToCome] = useState(true);
    const [loadingShow, setloadingShow] = useState(false);

    const { eventId } = useParams();

    const { t } = useTranslation();

    const [event, setEvent] = useState("");
    const [videoEmbedLink, setvideoEmbedLink]  = useState(null);
    const [StartSec, setStartSec]  = useState(0);

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
            `${process.env.REACT_APP_BASE_URL}/api/get_event/${eventId}`
            ).then(function(res) {
            setEvent(res.data);
        }).catch(function() {
            addMessage(t('The event was not found, reload the page and try again'), 'red');
        })
    }, [t, addMessage, eventId]);

    const fetchData = useCallback(async () => {
        if (!eventId) {
            return null;
        }
        try {
            const response = await client.post(
                `${process.env.REACT_APP_BASE_URL}/api/event_search_${selectedChoice}/`,
                {
                event_id: parseInt(eventId),
                query: query,
                page: page,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }, [eventId, selectedChoice, query, page]);

    const handleSubmit = useCallback(async (e) => {
        if (e) {
            e.preventDefault();    
        }      
        try {
            const response = await fetchData();
            if (page===1) {
                setElements(response.data);
                setElementsLength(response.data.length);
            } else {
                setElementsLength((prevLenght) => prevLenght + response.data.length);
                setElements((prevList) => ListNoDuplicates(prevList, response.data));
            }
            setMoreToCome(response.data.length === 10);
        } catch (error) {
            console.error(error);
        }
    }, [fetchData, page]);
      
    const handleChoiceChange = (choice) => {
        setSelectedChoice(choice);
        setPage(1);
        setElements([]);
    };

    const handleClickMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        handleSubmit()
    }, [eventId, page, selectedChoice, handleSubmit])

    const navigate = useNavigate();

    const goBack = () => {
      navigate(-1);
    };

    return (
    <div className="w-full flex-1 flex flex-col bg-black">
        <div className="w-full h-[96px] relative">
            <img className="w-full h-full object-cover object-center" src={ElementsImg} alt="comps-img" />
        </div>
        <div className="flex flex justify-center items-center text-white text-center lg:text-4xl text-2xl font-bold mt-4 mb-2">
            <img className="bg-white border-gray-600 rounded-md mr-6 text-black font-bold text-lg py-1 pr-1 hover:cursor-pointer"
                 src={LeftSvg} alt="go-back"
                 onClick={goBack}
                />
            <div className='flex flex-col'>
                <span className='whitespace-nowrap'>{event && <h1>{event.name}</h1>}</span>
                <span className='whitespace-nowrap'>{t('Search for')}:</span>
            </div>
            <span className='bg-black mr-6 text-black font-bold text-lg px-2'>
                &lt;
            </span>
        </div>
        <div className='w-full flex justify-center items-center'>
            <button
                className={`${selectedChoice === 'video' ? 'bg-neutral-500' : 'bg-neutral-800'} border-r-0 rounded-l-lg font-semibold text-white px-2 py-2 lg:text-2xl border-[1px] border-neutral-500`}
                onClick={() => handleChoiceChange('video')}
            >
                Videos
            </button>
            <button
                className={`${selectedChoice === 'match' ? 'bg-neutral-500' : 'bg-neutral-800'} border-l-0 rounded-r-lg font-semibold text-white px-2 py-2 lg:text-2xl border-[1px] border-neutral-500`}
                onClick={() => handleChoiceChange('match')}
            >
                Matches
            </button>
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
            {ElementsLength > 0 ? (
                <div className='flex flex-col justify-top items-center w-fit min-h-[50vh]'>

                    {selectedChoice === 'video' && (
                    <>
                        <div className="text-white text-center text-2xl font-bold mt-4 mb-10">
                        {t('Available Videos')}:
                        </div>
                        <div className="flex flex-wrap justify-center items-center mb-6 w-full">
                        {Elements?.map((Element) => (
                            <VideoComponent key={Element?.id} Video={Element} addMessage={addMessage} />
                        ))}
                        </div>
                    </>
                    )}

                    {selectedChoice === 'match' && (
                    <>
                        <div className="text-white text-center text-2xl font-bold mt-4 mb-10">
                        {t('Available Matches')}:
                        </div>
                        <div className="flex flex-wrap justify-center items-center mb-6 w-full">
                        {Elements?.map((Element) => (
                            <MatchComponent key={Element?.id} Match={Element} onMatchClick={onMatchClick} MatchTitle={Element.video.name} />
                        ))}
                        </div>
                    </>
                    )}
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
                    {t(`No ${selectedChoice} where found`)}
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

export default SearchEventPage;