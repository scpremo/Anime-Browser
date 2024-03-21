import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { css } from '@emotion/react';
import Timer from './Timer'
import GenresDropDown from './GenresFilter';
import timer from './Timer';

const overlayStyle = css`
    display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0);
    z-index: 2;
    
    &.active {
        display: block;
    }
`
const genresDropDownStyles = css`
    .dropdown-check-list {
        display: inline-block;
    }
`
const anchorCss = css`
    position: relative;
    cursor: pointer;
    display: inline-block;
    padding: 5px 50px 5px 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
    color: black;
    background-color: white;

    &:after {
        content: "";
        position: absolute;
        border-left: 2px solid black;
        border-top: 2px solid black;
        padding: 5px;
        right: 10px;
        top: 20%;
        transform: rotate(-135deg);
    }
`
const listCss = css`
    color: black;
    padding: 2px;
    margin: 0;
    border: 1px solid #ccc;
    border-top: none;
    background-color: white;
    position: absolute;
    z-index: 1000;  
    display: flex;
    width: 40%;
    height: fit-content;
    flex-direction: row;
    flex-wrap: wrap;
`
const itemCss = css`
    list-style: none;
    text-align: left;
    display: block;
    width:50%;
`

const containerStyles = css`
    .externalContainer{
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100%;
    }

    .setupAndButton {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    .startButton{
        margin-top: 20px;
        height: 40px;
        border-radius: 10px;
        font-size: 28px;
        align-self: center;
        background: linear-gradient(to bottom right, #29cdff, #9d00fd);
        color: white;
        width: 35%;
        outline: 2px solid black;
        outline-offset: -6px;
        border: 1px solid black;
        margin-bottom: 20px;
    }

    .setupContainer{
        color: white;
        background-color: black;
        border-radius: 10px;
        min-width: 70%;
        min-height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        padding: 20px;
        gap: 5px;

    }

    .title{
        text-align: center;
        font-size: 32px;
        margin: 12px 0px 24px 0px
    }

    .difficultyContainer{
        display: flex;
        justify-content: center;
        gap: 5px;
    }
    .difficultyContainer button {
        border-radius: 7px;
    }

    .detailsContainer{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .detailsTextCombo {
        display: flex;
        align-items: center;
    }
    
    .detailsTextCombo input[type='date'] {
        margin-left: 5px; /* Adjust as needed */
    }

    .detailsTextCombo select {
        margin-left: 5px; /* Adjust as needed */
    }

    .playingContainer{
        color: white;
        background-color: black;
        border-radius: 10px;
        min-width: 70%;
        min-height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        padding: 20px;
        gap: 5px;

    }

    .youtubeContainer {
        position: relative;
        align-items: center;
        display: flex;
        justify-content: center;
    }

    .replayButtons {
        display: flex;
        justify-content: center;
        gap: 5px;
    }

    .guessContainer {
        display: flex;
        gap: 5px;
    }

    .playingAndButton {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .resultsContainer{
        color: white;
        background-color: black;
        border-radius: 10px;
        min-width: 70%;
        min-height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        padding: 20px;
        gap: 5px;

    }

    .image-container {
        position: relative;
        display: inline-block;
        max-width: 100%; 
    }
      
    .image-container img {
        width: 100%; /* Makes the image fill the container width */
        height: auto; /* Maintains aspect ratio */
    }

    .overlayText {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: red;
        font-size: 42px;
        font-weight: bold;
        padding: 10px;
      }

    .resultsAndButton {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
`

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function AnimeGuessGame(){
    // State variables for query parameters
    const [sfw, setSfw] = useState(true);
    const [unapproved, setUnapproved] = useState(false);
    const [minScore, setMinScore] = useState(4);
    const [status, setStatus] = useState('complete');
    const [genres, setGenres] = useState('');
    const [genresExclude, setGenresExclude] = useState('');
    const [type, setTpe] = useState('tv')
    const [pages, setPages] = useState(15)
    const [startDate, setStartDate] = useState("2000-01-01")
    const [enough, setEnough] = useState(false)

    // State variable for anime search results
    const [searchResults, setSearchResults] = useState(null);

    // State variable for opening found
    const [openingFound, setOpeningFound] = useState(false);
    const [youtubeVideoId, setYoutubeVideoId] = useState("5PAbRpzoEX8")//useState(null);
    const [randomAnime, setRandomAnime] = useState(null)

    //youtube variables 
    const [videoPlaying, setVideoPlaying] = useState(false);
    const playerRef = useRef(null);
    const [playButton, setPlayButton] = useState(true)
    const halo3Rat = "x_t4KLfNHOg"
    const fancyHalo3rat = "sCYs-ufyqYY"

    //game variables
    const [score, setScore] = useState(0)
    const [showOverlay, setShowOverlay] = useState(true);
    const [guessing, setGuessing] = useState(true)
    const [timerUp, setTimerUp] = useState(false)
    const [userGuess, setUserGuess] = useState("")
    const [gameSetup, setGameSetup] = useState(true)
    const [customDropDown, setCustomDropDown] = useState(false)
    const [gameLength, setGameLength] = useState(3)
    const [scoreScreen,setScoreScreen] = useState(false)
    const[nextRound, setnextRound] = useState(false)
    const [ratChance,setRatChance] = useState(4)//set both for 1 for always rat
    const ratChanceReset = 1000000//set for 1 for always rat
    const [correct, setCorrect] = useState(false)

    //custom dificulty vars
    const [selectedStatus, setSelectedStatus] = useState('Completed');
    const [selectedRating, setSelectedRating] = useState('4');
    const [selectedStartDate, setSelectedStartDate] = useState("2000-01-01")
    const [selectedGameLength, setSelectedGameLength] = useState('15')

    const onPlay = (event) => {
        // Set a timeout to pause the video after 15 seconds
        setVideoPlaying(true)
        if (guessing) {
            setTimeout(() => {
                if (guessing) {
                    event.target.pauseVideo();
                    console.log("pausing video")
                    setVideoPlaying(false)
                }
                setTimerUp(true)
            }, 15000);
        }
    };
    const onPause = (event) => {
        setVideoPlaying(false)
    };
    const onReady = (event) => {
        playerRef.current = event.target;
        event.target.playVideo()
        console.log("play video")
        console.log("waiting to then play video")
    };
    const startVideo = () => {
        // Check if the player reference is available
        if (playerRef.current) {
            // Play the video
            playerRef.current.seekTo(0);
            playerRef.current.playVideo();
            setVideoPlaying(true);
            // setPlayButton(false)
        }
    };
    const newRound = () => {
        setSearchResults(null)
        setOpeningFound(false)
        setYoutubeVideoId(null)
        setRandomAnime(null)
        setVideoPlaying(false)
        playerRef.current = null
        setPlayButton(true)
        setShowOverlay(true)
        setGuessing(true)
        setTimerUp(false)
        setCorrect(false)
        setnextRound(true)
    }
    useEffect(() => {    
        if(!gameSetup && nextRound) {
            console.log("new round useEffect called")
            if(gameLength <= 0) {
                setScoreScreen(true)
            } else
                getAnimeSearchResults()
        }
        setnextRound(false)
    }, [gameLength, playButton, randomAnime,openingFound,searchResults,videoPlaying,showOverlay,guessing,timerUp,nextRound]);
    const setEasy = () =>{
        setMinScore(7);
        setStatus('complete');
        setStartDate("2010-01-01");

        // Set the dropdown menu's selected values for hard mode
        setSelectedStatus('complete');
        setSelectedRating(7);
        setSelectedStartDate("2010-01-01")
        setSelectedGameLength(5)
    }
    const setMedium = () =>{
        setMinScore(4);
        setStatus('complete');
        setStartDate("2000-01-01");

        // Set the dropdown menu's selected values for hard mode
        setSelectedStatus('complete');
        setSelectedRating(4);
        setSelectedStartDate("2000-01-01")
        setSelectedGameLength(15)
    }
    const setHard = () =>{
        setMinScore(1);
        setStatus('complete');
        setStartDate("1980-01-01");

        // Set the dropdown menu's selected values for hard mode
        setSelectedStatus('complete');
        setSelectedRating(1);
        setSelectedStartDate("1980-01-01")
        setSelectedGameLength(25)
    }
    const setCustom = () =>{
        setCustomDropDown(!customDropDown)
        setSelectedStatus('Complete');
        setSelectedRating(minScore);
        setSelectedStartDate(startDate)
    }
    const startGame = () =>{
        setGameLength(selectedGameLength);
        setScore(0)
        console.log(checkQuery())
        checkQuery()
    }

    const checkQuery = async() =>{
        const controller = new AbortController();
        try {
            const queryParams = new URLSearchParams({
                    sfw,
                    unapproved,
                    page: 1,
                    limit: 25,
                    type: type,
                    min_score: minScore,
                    status: status,
                    genres: Object.keys(selectedGenres).filter(genreId => selectedGenres[genreId]),
                    genres_exclude: genresExclude,
                    start_date: startDate
            });

            // Make the API call
            console.log(`https://api.jikan.moe/v4/anime?${queryParams}`)
            const response = await fetch(`https://api.jikan.moe/v4/anime?${queryParams}`, { signal: controller.signal });
            const data = await response.json();
            console.log(data);
            setSearchResults(data);
            if (data && data.pagination) {
                // Extract the id from a random entry in the search results
                const maxPages= data.pagination.last_visible_page
                if (maxPages<3) {
                    // alert("Not Enough possible results, Pleas broden the search parameters")
                    setEnough(true)
                    setPages(maxPages)
                } else {
                    setEnough(false)
                    await delay(1000)
                    setPages(maxPages)
                    console.log("Setting pages:", maxPages);
                    console.log("pages:", pages);
                    setGameSetup(false);   
                }
            }           
            // Update the search results state
        } catch (error) {
            console.error('Error fetching anime search results:', error);
        }
        return () => controller.abort();
    }
    useEffect(() => {    
        if(!gameSetup)
        {
            console.log("useEffect called")
            
            getAnimeSearchResults();
        }

    }, [pages, gameSetup]);
    const reset = () =>{
        setScoreScreen(false)
        setGameSetup(true)
    }
    const submitGuess = () => {
        // Get the user's input
        setGameLength(gameLength-1)
        setUserGuess(document.getElementById('guessInput').value)
        const userInput = document.getElementById('guessInput').value;
        console.log(randomAnime)
        setShowOverlay(false);
        // Check if there's an opening found and a valid user input
        if (randomAnime && userInput.trim() !== '') {
            // Get the title of the anime (you may need to adjust this based on your data structure)
            const animeTitle = randomAnime.title;
            var animeTitleEnglish = ""
            if (randomAnime.title_english)
                var animeTitleEnglish = randomAnime.title_english
            // Convert both strings to lowercase for case-insensitive comparison
            const userInputLower = userInput.toLowerCase();
            const animeTitleLower = animeTitle.toLowerCase();
            const animeEnglishTitleLower = animeTitleEnglish.toLowerCase();
            const longer = (animeTitleLower.length + animeEnglishTitleLower.length)/2;

            // Use a similarity comparison algorithm, for example, Levenshtein distance
            var similarity = levenshteinDistance(userInputLower, animeTitleLower);
            const similarityEnglish = levenshteinDistance(userInputLower, animeEnglishTitleLower);
            if (similarityEnglish < similarity)
                similarity = similarityEnglish

            // Set a threshold for similarity (adjust as needed)
            const similarityThreshold = Math.floor(longer/6);
            console.log("guess ==" + userInput)
            console.log("answer1 ==" + animeTitle)
            console.log("answer2 ==" + animeTitleEnglish)
            // Check if the similarity is below the threshold
            if (similarity <= similarityThreshold) {
                // User's guess is close enough to the anime title
                // alert('Correct guess! You are close to the title.');
                setCorrect(true)
                setScore(score + 1); // Update the score
            } else {
                // User's guess is not close to the anime title
                // alert('Incorrect guess.');
                setCorrect(false)
            }
        }
        setGuessing(false)
        playerRef.current.playVideo();
    };
    const levenshteinDistance = (s, t) => {
        if (!s.length) return t.length;
        if (!t.length) return s.length;
        const arr = [];
        for (let i = 0; i <= t.length; i++) {
            arr[i] = [i];
            for (let j = 1; j <= s.length; j++) {
                arr[i][j] =
                    i === 0
                        ? j
                        : Math.min(
                            arr[i - 1][j] + 1,
                            arr[i][j - 1] + 1,
                            arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                        );
            }
        }
        return arr[t.length][s.length];
    };
    const getAnimeSearchResults = async () => {
        if (Math.random() < 1 / ratChance)
        {
            setOpeningFound(true);
            setRatChance(ratChanceReset)
            setRandomAnime({synopsis :"Halo 3 Rat",title:"Halo 3 Rat"})
            //if (Math.random() < 1 / 2)
                setYoutubeVideoId(halo3Rat);
            //else
              //  setYoutubeVideoId(fancyHalo3rat)
        } else {
            setRatChance(ratChance-1)
            const controller = new AbortController();
            try {
                // Build the query parameters
                if (!openingFound) {
                    const queryParams = new URLSearchParams({
                        sfw,
                        unapproved,
                        page: Math.floor(Math.random() * (pages-1)+1) ,
                        limit: 25,
                        type: type,
                        min_score: minScore,
                        status: status,
                        genres :Object.keys(selectedGenres).filter(genreId => selectedGenres[genreId]),
                        genres_exclude: genresExclude,
                        start_date: startDate
                    });

                    // Make the API call
                    console.log(`   ${queryParams}`)
                    const response = await fetch(`https://api.jikan.moe/v4/anime?${queryParams}`, { signal: controller.signal });
                    const data = await response.json();
                    console.log(data);
                    setSearchResults(data);
                    if (data && data.data) {
                        // Extract the id from a random entry in the search results
                        const rand = Math.floor(Math.random() * data.data.length);
                        const id = data.data[rand].mal_id;
                        console.log('id ==' + id);

                        try {
                            // Make the second API call using the extracted id
                            const animeResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
                            const animeBody = await animeResponse.json();
                            console.log(animeBody);

                            if (animeBody.data.theme && animeBody.data.theme.openings.length > 0) {
                                console.log("Anime with opening found   ");
                                setOpeningFound(true);
                                setRandomAnime(animeBody.data)
                                var openingSongName
                                // if (animeBody.data.title_english)
                                //     openingSongName = animeBody.data.title_english + " (anime opening) " //+ animeBody.data.theme.openings[0];
                                // else
                                    openingSongName = animeBody.data.title + " (anime opening) " //+ animeBody.data.theme.openings[0];
                                // const openingSongName = animeBody.data.theme.openings[Math.floor(Math.random() * animeBody.data.theme.openings.length)];
                                console.log(openingSongName)
                                // Use YouTube API to search for the opening song on YouTube
                                const youtubeApiKey = 'AIzaSyCd9GeZYszVU342h5Z0xnwFUoFV5slu4Jk'; // Replace with your YouTube API key
                                const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${openingSongName}&type=video&videoSyndicated=true&videoEmbeddable=true&key=${youtubeApiKey}`;
                                const youtubeResponse = await fetch(youtubeSearchUrl);
                                const youtubeData = await youtubeResponse.json();

                                if (youtubeData.items && youtubeData.items.length > 0) {
                                    // Extract the video ID of the first result
                                    const videoId = youtubeData.items[0].id.videoId;
                                    setYoutubeVideoId(videoId);
                                    console.log(youtubeData.items)
                                }
                            }
                            else if (animeBody) {
                                await delay(1000)
                                getAnimeSearchResults();
                                console.log("opening not found")
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }

                // Update the search results state
            } catch (error) {
                console.error('Error fetching anime search results:', error);
            }
        }
        return () => controller.abort();
    };

  const [setUp, setSetUp] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState({});
  const [checkList, setCheckList] = useState(false);

  const getDropDown = async () => {
    const controller = new AbortController();
    try {
      console.log(`https://api.jikan.moe/v4/genres/anime`);
      const response = await fetch(`https://api.jikan.moe/v4/genres/anime`, {
        signal: controller.signal,
      });
      const data = await response.json();
  
      // Filter out unwanted genres
      const filteredData = data.data.filter(
        (genre) =>
          ![
            "Ecchi",
            "Erotica",
            "Hentai",
            "Magical Sex Shift",
            "Crossdressing",
            "Avant Garde",
            "Award Winning",
            "Boys Love",
            "Girls Love",
            "Childcare",
            "Delinquents",
            "Educational",
            "High Stakes Game",
            "Idols (Male)",
            "Medical",
            "Organized Crime",
            "Performing Arts",
            "Pets",
            "Reverse Harem",
            "Romantic Subtext",
            "Showbiz",
            "Survival",
            "Time Travel",
            "Video Game",
            "Visual Arts",
          ].includes(genre.name)
      );
  
      // Sort the filteredData alphabetically by genre
      filteredData.sort((a, b) => a.name.localeCompare(b.name));
      localStorage.setItem(`genres`, (filteredData));
      setGenres({ data: filteredData });
    } catch (error) {
      console.error('Error fetching anime search results:', error);
    }
    return () => controller.abort();
  };

  const handleCheckboxChange = (genreID) => {
    setSelectedGenres((prevState) => ({
      ...prevState,
      [genreID]: !prevState[genreID],
    }));
  };

  useEffect(() => {
    if (setUp) {
      console.log("useEffect called");
      const cahcedGenres = localStorage.getItem("genres")
      if(cahcedGenres)
        setGenres({ data: cahcedGenres });
      else
        getDropDown();  
      setSetUp(false);
    }
  }, [setUp]);
    
    return (
        <div css={containerStyles}>
        <div className="externalContainer">
            {gameSetup && (
                <div className="setupAndButton">
                <div className="setupContainer">
                    <p className="title">Setup Game</p>
                    <div className="difficultyContainer">
                        
                        <button onClick={setEasy}>Easy</button>
                        <button onClick={setMedium}>Medium</button>
                        <button onClick={setHard}>Hard</button>
                        {/* <button onClick={setCustom}>🔽Custom</button> */}
                        Game Length:
                            <input
                                type="range"
                                min="1"
                                max="25"
                                value={selectedGameLength}
                                onChange={(e) => setSelectedGameLength(parseInt(e.target.value))}
                            />
                            {selectedGameLength}
                    </div>
                    <div className="detailsContainer">
                        {genres &&(
                            <span id="list1" css={genresDropDownStyles} tabIndex="100">
                            <span css={anchorCss} className="anchor" onClick={() => setCheckList(!checkList)}>
                                Genres
                            </span>
                            {checkList && (
                                <ul css={listCss} className="items">
                                {genres.data.map((genre) => (
                                    <li key={genre.mal_id} css={itemCss}>
                                    <input
                                        id={genre.id}
                                        value={genre.id}
                                        type="checkbox"
                                        checked={selectedGenres[genre.mal_id] || false}
                                        onChange={() => handleCheckboxChange(genre.mal_id)}
                                    />
                                    {genre.name}
                                    </li>
                                ))}
                                </ul>
                            )}
                        </span>
                        )}
                        <div className='detailsTextCombo'>
                            Status:
                            <select id='status' value={selectedStatus} onChange={(e) => {setSelectedStatus(e.target.value)
                                                                                            setStatus(e.target.value)}}>
                                <option value={"complete"}>Completed</option>
                                <option value={"airing"}>Airing</option>
                                <option value={""}>Either</option>
                            </select>
                        </div>
                        <div className='detailsTextCombo'>
                            Minimum Rating:
                            <select id='rating' value={selectedRating} onChange={(e) => {setSelectedRating(e.target.value)
                                                                                            setMinScore(e.target.value)}}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>     
                                {/* <option value={9}>9</option>   */}
                            </select>
                        </div>
                        <div className='detailsTextCombo'>
                            Start Date:
                                <input type='date' id='date' value={selectedStartDate} onChange={(e) => {setSelectedStartDate(e.target.value)
                                                                                                        setStartDate(e.target.value)}} />
                        </div>
                    </div>
                    {enough && (
                        <div>Parameters are too narrow, your search prduced: {pages} pages, the game requires a minimum of 3 pages to play,</div>
                    )}
                </div>
                <button className="startButton" onClick={startGame}>START GAME</button>
                </div>
            )}
            {!gameSetup && !scoreScreen &&(
                <div className="playingAndButton">
                <div className='playingContainer'>
                    <div>Score: {score}</div> <div>Questions Left: {gameLength}</div>
                    {openingFound && youtubeVideoId && (
                        <div>
                            <p className="title">Guess the Opening!</p>
                            <div className="youtubeContainer">
                                <div css={overlayStyle} className={`overlay${showOverlay ? ' active' : ''}`}></div>
                                <YouTube
                                    videoId={youtubeVideoId}
                                    opts={{ playerVars: { autoplay: 1 , controls: 0, disablekb: 1} }}
                                    onPlay={onPlay}
                                    onPause={onPause}
                                    onReady={onReady}
                                />
                                {!timerUp && videoPlaying &&(
                                <div css = {css`
                                    position: relative;
                                    width: 0;
                                    height: 0;
                                    top: -6em;
                                    left: -64%;
                                    z-index: 3;
                                `}>
                                    <Timer/>
                                </div>
                                 )}
                            </div>
                            {playButton && guessing && (
                                <div className="replayButtons">
                                    {/* <button onClick={startVideo}>
                                        Replay
                                    </button> */}
                                    <button onClick={newRound}>
                                        Video Not Playing?
                                    </button>
                                    
                                </div>
                            )}
                            
                            {guessing && timerUp && (
                                <div>
                                    <h5>
                                        Guess the name of the anime, or song name
                                    </h5>
                                    <div className="guessContainer">
                                        <input id='guessInput'/>
                                        <button onClick={submitGuess}>
                                            submit
                                        </button>
                                    </div>
                                </div>
                            )}
                            {!guessing && (
                                <div>
                                    {correct &&(
                                        <div>You got the correct Answer</div>
                                    )}
                                    {!correct &&(
                                        <div>You got the question wrong</div>
                                    )}
                                    <div>
                                        Correct Answer = {randomAnime.title}
                                    </div>
                                    {randomAnime.title_english && (
                                        <div>
                                            Correct Answer (English Title) = {randomAnime.title_english}
                                        </div>)}
                                    <div>
                                        Your guess = {userGuess}
                                    </div>
                                </div>
                            )}
                        </div>

                    )}
                    {/* Your JSX for displaying search results goes here */}
                    {searchResults && !guessing && (
                        <div>
                            <h2>Anime Search Results</h2>
                            <div>
                                {randomAnime.synopsis}
                            </div>
                            
                        </div>
                    )}
                </div>
                {!guessing && (
                    <>                    
                        <button className="startButton" onClick={newRound}>
                            NEXT ROUND
                        </button>
                        
                    </>
                )}
                </div>
            )}
            {scoreScreen &&(            
                <div className="resultsAndButton">
                <div className='resultsContainer'>
                    You got {score}/{selectedGameLength}!
                    {score==selectedGameLength  &&(
                        <div className="imageContainer">
                            <img src="/grass.gif" alt="GIF of Swaying Grass"></img>
                            <div className="overlayText">Touch Grass</div>
                        </div>
                    )}
                </div>
                <button className="startButton" onClick={reset}>Play Again?</button>
                </div>
            )}
        </div>
        </div>
    );
};