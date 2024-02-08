import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ElementsImg from '../static/img/background.png';
import client from '../utils/axiosConfig';
import VideoComponent from '../components/Video';
import MatchComponent from '../components/Match';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPopup from '../components/videoPopup';
import LeftSvg from '../static/svg/arrow_left.svg';

const SearchEventPage = ({ addMessage, userUUID }) => {
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
        if (selectedChoice !== choice) {
            setSelectedChoice(choice);
            setPage(1);
            setElements([]);
        }
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
            <div className="flex items-center justify-center text-white text-center lg:text-4xl text-2xl font-bold px-4 mt-4 mb-2">
                <button
                    onClick={goBack}
                    className="flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-full p-2 lg:p-3 mr-4 transition-colors duration-300 ease-in-out cursor-pointer">
                    <img src={LeftSvg} alt="go-back" className="w-4 h-4 lg:w-6 lg:h-6" />
                </button>
                <div className='flex flex-col'>
                    <span className='md:text-4xl text-xl'>{event && <h1>{event.name}</h1>}</span>
                    <span className='md:text-4xl text-xl'>{t('Search for')}:</span>
                </div>
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
        <form onSubmit={handleSubmit} className="flex flex-col justify-center mt-4 items-center w-full">
            <div className="p-2 rounded-xl flex justify-center w-full lg:w-auto">
                <div className="border border-neutral-700 bg-white w-full md:w-[400px] md:mx-0 mx-[10vw] rounded-lg">
                    <input
                        className='p-2 w-full rounded-lg'
                        type="text"
                        placeholder={t("Enter your search query")}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>
            <input
                className="bg-neutral-200 text-neutral-800 hover:bg-neutral-600 hover:text-white cursor-pointer rounded-lg px-6 py-3 mt-4 font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-50"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:p-8 p-4 min-h-[50vh]">
                        {Elements?.map((Element) => (
                            <MatchComponent 
                                key={Element?.id}
                                Match={Element}
                                onMatchClick={onMatchClick}
                                MatchTitle={Element.video.name}
                                userUUID={userUUID}
                            />
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