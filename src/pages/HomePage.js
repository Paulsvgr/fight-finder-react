import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../utils/axiosConfig';
import CompComponent from '../components/Comp'
import VideoComponent from '../components/Video'
import MatchComponent from '../components/Match'
import ElementsImg from '../static/img/background.png';
import { Link } from 'react-scroll';
import ContactForm from '../components/forms/ContactForm';
import VideoPopup from '../components/videoPopup';

const HomePage = ({ addMessage, userUUID }) => {
    const playerRef = useRef(null);
    const [VideoShow, setVideoShow] = useState(false);
    const [Elements, setElements] = useState([]);
    const [ElementsLength, setElementsLength] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState('event');
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [moreToCome, setMoreToCome] = useState(true);
    const [StartSec, setStartSec]  = useState(0);
    const [loadingShow, setloadingShow] = useState(false);
    const [matches, setMatches] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [moreMatchesToCome, setMoreMatchesToCome] = useState(true);

    const { t } = useTranslation();
    const [videoEmbedLink, setvideoEmbedLink]  = useState(null);

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
        const fetchMatches = async () => {
            try {
                const response = await client.get(`/api/matches/most-clicked?page=${currentPage}&page_size=${3}`);
                setMoreMatchesToCome(response.data.length === 3)
                setMatches((prevList) => ListNoDuplicates(prevList, response.data));
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };
    
        fetchMatches();
    }, [currentPage]);


    const fetchData = useCallback(async () => {
        try {
            const response = await client.post(
                `${process.env.REACT_APP_BASE_URL}/api/${selectedChoice}s_search/`,
                {
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
    }, [selectedChoice, query, page]);

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
        handleSubmit()
    };

    useEffect(() => {
        handleSubmit()
    }, [handleSubmit])

    return (
        <div className="w-full flex flex-col bg-neutral-900">
            <div className="w-full h-[50vh]">
                <div className="relative h-[50vh] w-full">
                    <div className="relative z-0 h-[50vh] w-full">
                        {/* <video className="absolute top-0 left-0 min-w-full min-h-full z-0 object-cover w-[1207px] h-[679px]" autoPlay="" muted="" playsInline="" loop="" src={vid}></video> */}
                        <img className="w-full h-full object-cover object-center" src={ElementsImg} alt="comps-img" />
                    </div> 
                    <div className="bg-black opacity-50 h-full w-full top-0 absolute"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white text-center">
                    <h1 className="text-5xl font-bold">Fight Finder</h1>
                        <p>{t("Found matches from big competition videos")}</p>
                        <Link activeClass="active" to="searchEl" spy={true} smooth={true} duration={600}>
                            <button className="bg-white text-black py-2 px-4 mt-4 rounded-md hover:bg-neutral-300">
                                {t("Search")}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-top items-center w-full mb-20'>
                {matches.length > 0 && (
                    <h2 className="text-white text-center lg:text-4xl text-2xl font-bold mt-8 mb-2">
                        {t('Most watch matches')}:
                    </h2>
                )}
                {matches.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:p-8 p-4'>
                        {matches.map(match => (
                            <MatchComponent 
                                key={match?.id}
                                Match={match}
                                onMatchClick={onMatchClick}
                                MatchTitle={match.video.name}
                                userUUID={userUUID}
                            />
                        ))}
                    </div>
                )}
                {(moreMatchesToCome && matches.length > 0) && (
                    <button id='searchEl'
                        onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                        className="bg-neutral-100 w-fit rounded-lg mb-2 font-semibold text-black px-4"
                    >
                        {t('More')}
                    </button>
                )}
            </div>
            <div  className="text-white text-center lg:text-4xl text-2xl font-bold mt-8 mb-2">
                {t('Search for')}:
            </div>
            <div className='w-full flex justify-center items-center'>
                <button
                    className={`${selectedChoice === 'event' ? 'bg-neutral-500' : 'bg-neutral-800'} rounded-l-lg font-semibold text-white px-4 py-2 lg:px-6 lg:py-3 lg:text-2xl border border-neutral-500 `}
                    onClick={() => handleChoiceChange('event')}
                >
                    Events
                </button>
                <button
                    className={`${selectedChoice === 'video' ? 'bg-neutral-500' : 'bg-neutral-800'} font-semibold text-white px-4 py-2 lg:px-6 lg:py-3 lg:text-2xl border-t border-b border-neutral-500 `}
                    onClick={() => handleChoiceChange('video')}
                >
                    Videos
                </button>
                <button
                    className={`${selectedChoice === 'match' ? 'bg-neutral-500' : 'bg-neutral-800'} rounded-r-lg font-semibold text-white px-4 py-2 lg:px-6 lg:py-3 lg:text-2xl border border-neutral-500 `}
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
                    <div className='flex flex-col justify-top items-center w-fit'>
                        {selectedChoice === 'event' && (
                        <>
                            <div className="text-white text-center text-2xl font-bold mb-10 mt-20 lg:text-4xl text-2xl">
                            {t('Available Events')}:
                            </div>
                            <div className="flex flex-wrap justify-center items-center mb-6 w-full">
                            {Elements?.map((Element) => (
                                <CompComponent key={Element?.id} Comp={Element} addMessage={addMessage} />
                            ))}
                            </div>
                        </>
                        )}

                        {selectedChoice === 'video' && (
                        <>
                            <div className="text-white text-center text-2xl font-bold mb-10 mt-20 lg:text-4xl text-2xl">
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
                            <div className="text-white text-center text-2xl font-bold mb-10 mt-20 lg:text-4xl text-2xl">
                            {t('Available Matches')}:
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:p-8 p-4">
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
            <div className="flex flex-col justify-center items-center lg:mx-10 mt-10 mx-4">
                <p className="font-semibold text-xl lg:text-3xl text-white text-center mb-4">
                    {t('Fight Finder hjälper dig hitta matcher i långa video.')}
                </p>
                <p className="lg:text-xl text-white text-center mb-6">
                    {t('Kontakta gärna oss för.')}
                </p>
                <div className="bg-neutral-800 bg-opacity-50 rounded-lg p-4 lg:p-6 shadow-lg">
                    <h2 className="font-semibold text-xl lg:text-3xl text-white text-center mb-4">
                        {t('Kontakta Fight Finder')}
                    </h2>
                    <ContactForm addMessage={addMessage} userUUID={userUUID}/>
                </div>
            </div>
            {
                VideoShow && videoEmbedLink &&
                <VideoPopup playerRef={playerRef} videoEmbedLink={videoEmbedLink} closeVid={closeVid} loadingShow={loadingShow} />
            }
        </div>
    );
};

export {HomePage};