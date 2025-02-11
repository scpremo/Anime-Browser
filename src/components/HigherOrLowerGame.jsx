import React, { useState, useEffect } from "react";
import { css } from '@emotion/react';


const pageCSS = css`
    display: flex;
    flex-direction: row;
    align-self: stretch;
    flex-grow: 1;
    max-width: 50%;
    height: 100%;
`

const sideCSS = css`
    display: flex;
    min-width: 0;
    flex-grow: 1; 
    flex-direction: column;
    align-items: center;
    justify-content: start;
    min-width: 100%;
    min-height: 100%;
    text-align: center;

    img {
        width: 320px;
        height: 450px;
        outline: 3px solid white;
    }

    p{
        margin-top: 10px;
        margin-bottom: 0px;
        min-height:10%;
        max-height: 10%;
    }

    .truncate {
        text-overflow: ellipsis;  
        width: 350px;
        height: 100px;
        margin-bottom: 12px;
        cursor: pointer;          
        overflow:hidden;
        white-space: normal;

        &:hover{
            overflow: visible;
            white-space: normal;
            height:auto;
        }
    }


    .buttonDiv {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        gap: 5px;
    }
    
`

const endStyles = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    text-align: center;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;


    p {
        color: red;
        font-size: 50px;
        margin: 10px 0;
    }

    .startButton {
        height: 40px;
        border-radius: 10px;
        font-size: 28px;
        background: linear-gradient(to bottom right, #29cdff, #9d00fd);
        color: white;
        width: 35%;
        outline: 2px solid black;
        outline-offset: -6px;
        border: 1px solid black;
        margin-top: 20px;
    }
`;

const higherOrLowerStyles = css`
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    align-self: center;
    justify-content: center;
    min-height: 100%;


    .internalContainer{
        color: white;
        background-color: black;
        border-radius: 10px;
        width: 70%;
        height: 590px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;        
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        padding: 20px;
        position: relative;
    }

    .score {
        margin:0px;
        font-size: 25px;
        font-weight: bold
    }

`


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function HigherOrLowerGame() {
    const [searchResults, setSearchResults] = useState([])
    const [loadingData, setLoadingData] = useState(false)
    const [loseState, setloseState] = useState(false)
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const badGenres = [
        "Ecchi",
        "Erotica",
        "Hentai",
        "Magical Sex Shift",
        "Crossdressing",
        "Boys Love",
        "Girls Love"
      ];

    // get first 3 random animes
    const getInitialAnimeSearchResults = async () => {
        const controller = new AbortController();
        try {
            //Hard coded query parameters
            const queryParams = new URLSearchParams({
                sfw: true,
                page: Math.floor(Math.random() * (1569 - 1) + 1),
                limit: 3,
                type: "tv",
                min_score: 1,
                genres_exclude: badGenres
            });
            // Make the API call
            console.log(`https://api.jikan.moe/v4/anime?${queryParams}`)
            const response = await fetch(`https://api.jikan.moe/v4/anime?${queryParams}`, { signal: controller.signal });
            const data = await response.json();
            console.log(data);
            setSearchResults([...searchResults, data.data[0], data.data[2], data.data[1]]);
        } catch (error) {
            console.error('Error fetching anime search results:', error);
        }
        return () => controller.abort();
    };

    // Get a single random anime
    const getAnimeSearchResult = async () => {
        const controller = new AbortController();
        try {
            //Hard coded query parameters
            const queryParams = new URLSearchParams({
                sfw: true,
                page: Math.floor(Math.random() * (4707 - 1) + 1),
                limit: 1,
                type: "tv",
                min_score: 1,
                genres_exclude: badGenres
            });

            // Make the API call
            console.log(`https://api.jikan.moe/v4/anime?${queryParams}`)
            const response = await fetch(`https://api.jikan.moe/v4/anime?${queryParams}`, { signal: controller.signal });
            const data = await response.json();
            setSearchResults([...searchResults, data.data[0]]);
        } catch (error) {
            console.error('Error fetching anime search results:', error);
        }
        return () => controller.abort();
    };



    // get new anime when needed
    useEffect(() => {
        if (searchResults.length == 0) {
            getInitialAnimeSearchResults()
        }
        else if (searchResults.length < 3) {
            const getSearch = async () => {
                await delay(1000)
                getAnimeSearchResult()
            }
            getSearch()
        }
    }, [searchResults]);

    // shift images from right box to left
    function shiftImages() {
        if (!loadingData) {
            setLoadingData(true)
            if (searchResults.length > 2) {
                setSearchResults(searchResults.filter(item => item.mal_id !== searchResults[0].mal_id))
                setScore(prevScore => prevScore + 1)
            }
            setLoadingData(false)

            console.log("after higher: ", searchResults)
        }
    }

    function higherSelected() {
        console.log("higher")
        if (searchResults[0].score <= searchResults[1].score) {
            shiftImages()
        }
        else
        {
            
            var savedScore = localStorage.getItem("score")
            console.log(savedScore)
            if(savedScore && (score > savedScore ) )  
            {
                localStorage.setItem("score",score);
                setHighScore(score);
            }
            else if (!savedScore){
                localStorage.setItem("score",score);
                setHighScore(savedScore)
            }
            else{
                setHighScore(savedScore)
            }
            setloseState(true)
        }
    }

    function lowerSelected() {
        console.log("lower")
        if (searchResults[0].score >= searchResults[1].score) {
            shiftImages()
        }
        else
        {
            
            var savedScore = localStorage.getItem("score")
            console.log(savedScore)
            if(savedScore && (score >= savedScore ) )  
            {
                localStorage.setItem("score",score);
                setHighScore(score);
            }
            else if (!savedScore){
                localStorage.setItem("score",score);
                setHighScore(score)
            }
            else{
                setHighScore(savedScore)
            }
            setloseState(true)
        }
    }

    const reset = () => {
        setScore(0)
        setSearchResults([])
        setloseState(false)
    }

    return (
        <div css={higherOrLowerStyles}>
            <div className="internalContainer">
                <p className="score">Score: {score}</p>
                <div css={pageCSS}>
                    <div css={sideCSS}>
                        <p>"{searchResults.length == 0 ? null : (searchResults[0].title_english != null ? searchResults[0].title_english : searchResults[0].title)}"</p>
                        <img src={searchResults.length == 0 ? null : searchResults[0].images.jpg.large_image_url} />

                        {/* <p className="truncate">{searchResults.length == 0 ? null : searchResults[0].synopsis}</p> */}
                        <p>Rating: {searchResults.length == 0 ? null : searchResults[0].score}</p>
                    </div>
                    <div css={sideCSS}>
                        <p>"{searchResults.length == 0 ? null : (searchResults[1].title_english != null ? searchResults[1].title_english : searchResults[1].title)}"</p>
                        <img src={searchResults.length == 0 ? null : searchResults[1].images.jpg.large_image_url} />

                        {/* <p className="truncate">{searchResults.length == 0 ? null : searchResults[1].synopsis}</p> */}
                        {loseState ? <p>Rating: {searchResults.length == 0 ? null : searchResults[1].score}</p> :
                            <div className="buttonDiv">
                                <button onClick={higherSelected}>Higher</button>
                                <button onClick={lowerSelected}>Lower</button>
                            </div>
                        }
                    </div>
                </div>
                {loseState &&
                    <div css={endStyles}>
                        <p>You Lose</p>
                        <p>Score: {score}</p>
                        <p>High Score: {highScore}</p>
                        <button className="startButton" onClick={reset}>Play Again?</button>
                    </div>
                }
            </div>
        </div>
    )
}

// Api key: AIzaSyC3ptuT1nygeYoBkc_Ad_CL1fSejKQSszk