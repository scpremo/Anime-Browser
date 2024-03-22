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
    justify-content: center;
    min-width: 100%;
    min-height: 100%;
    text-align: center;

    img {
        max-width: 100%;
        max-height: 100%;
        height: 68%;
        outline: 3px solid white;
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
        margin-top: 30px;
    }
    
`

const endStyles = css`
    display: flex;
    position: absolute;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);;
    height: 100%;    
    width: 100%;
    bottom: 0;

    p {
        color: red;
        font-size: 50px;
    }
    .startButton {
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
`

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
        max-width: 70%;
        min-width: 70%;
        min-height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;        
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        padding: 20px;
    }

    .score {
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
            setloseState(true)
    }

    function lowerSelected() {
        console.log("lower")
        if (searchResults[0].score >= searchResults[1].score) {
            shiftImages()
        }
        else
            setloseState(true)
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
            </div>

            {loseState &&
                <div css={endStyles}>
                    <p>You Lose</p>
                    <p>Score: {score}</p>
                    <button className="startButton" onClick={reset}>Play Again?</button>
                </div>
            }
        </div>
    )
}

// Api key: AIzaSyC3ptuT1nygeYoBkc_Ad_CL1fSejKQSszk