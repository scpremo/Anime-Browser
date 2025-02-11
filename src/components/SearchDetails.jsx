import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import YouTube from 'react-youtube';

const CharacterImage = styled.img`
    aspect-ratio: auto 9 / 14;
    min-width: 100%;
`
const CharacterText = styled.span`
    background-image: url(/image_box_shadow_bottom.png?v=1634263200);
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    bottom: 0;
    display: inline-block;
    font-family: Avenir, lucida grande, tahoma, verdana, arial, sans-serif;
    font-size: 11px;
    left: 0;
    line-height: 1.2em;
    padding: 15px 5px 5px;
    position: absolute;
    text-shadow: rgba(0,0,0,.8) 1px 1px 0;
    width: 100%

`
const TextBox = styled.h3`
    display: inline;
    font-size: 11px;
    font-weight: 400;
    line-height: 1.5em;
    min-width: 100%
`
const AnotherBox = styled.div`
    background-repeat: no-repeat;
    background-size: cover;
    display: block;
    opacity: 1;
    position: relative;
    padding-right: 10px;
`

const containerStyles = css`
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100%;


    .animeContainer{
        color: white;
        background-color: black;
        border-radius: 10px;
        max-width: 70%;
        min-height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        padding: 20px;
    }

    .imageAndDetails{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10px;
    }

    .imageAndDetails img{
        max-width: 100%;
        max-height: 100%;
        height: 68%;
        outline: 3px solid white;
    }

    .generalDetails{
        display: flex;
        flex-direction: column;
        gap: 3px;
        width: 33%;
    }

    .generalDetails p{
        margin: 0px;
    }

    a{
        color: white;
    }

    a:hover{
        color: grey;
    }
    

    
    .characterContainer{
        display: flex;
        flex-direction: row;
        list-style-type: none;
        flex-wrap: wrap;
        padding: 0px;
    }

    .individualCharacter{
        display: flex;
        flex-direction: column;
        margin: 0px;
        font-size: 10px;
        max-width: 20%
    }

    .name{
        font-size: 14px;
    }

    .individualCharacter p{
        margin: 0px;
    }

    .individualCharacter img{
        display: block;
        max-width: 80%;
        height: auto;
    }

    .youtubeContainer{
    
    }

    .noImage{
        margin-left: 10px;
    }

    .nameAndFavorite{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .favoriteEmptyButton {
        border: none;
        cursor: pointer;
        color: white;
        background: none;
        background-image: url(/Anime-Browser/favorite.png);
        background-size: 100%, auto;
        background-position: center center;
        background-repeat: no-repeat;
        height: 25px;
        width: 25px;
        filter: invert(1)
    }

    .favoriteFilledButton {
        border: none;
        cursor: pointer;
        background: none;
        background-image: url(/Anime-Browser/favorite_filled.png);
        background-size: 100%, auto;
        background-position: center center;
        background-repeat: no-repeat;
        height: 25px;
        width: 25px;
    }

    .bottomLink{
        color: lightgray;
    }

`
export default function SearchDetail() {
    const { animeId } = useParams();
    const [animeDetails, setAnimeDetails] = useState(null);
    const [characters, setCharacters] = useState(null);
    const [streaming, setStreaming] = useState(null);
    const navigate = useNavigate();
    const[isFavorite, setIsFavortie] = useState(false)

    const opts = {
        height: 'auto',
        width: '100%'
      };

    useEffect(() => {
        const fetchAnimeDetails = async () => {
            try {
                
                const response = await fetch(
                    `https://api.jikan.moe/v4/anime/${animeId}`
                );
                if (!response.ok) {
                    if (response.status === 404) {
                        navigate('/404');
                        return;
                    }
                }
                const data = await response.json();
                setAnimeDetails(data.data);
                var favorites = JSON.parse(localStorage.getItem(`Favorites`));
                var index = -1;
                var filteredObj = favorites.data.find(function(item, i){
                if(item.mal_id === data.data.mal_id){
                    index = i;
                    return i;
                }
                });
                console.log(index , filteredObj)
                if(index !== -1)
                    setIsFavortie(true)


                 console.log(data.data);

                const characterResponse = await fetch(
                    `https://api.jikan.moe/v4/anime/${animeId}/characters`
                );
                const detailsData = await characterResponse.json();
                setCharacters(detailsData.data);
                 console.log(detailsData);

                const streamingResponse = await fetch(
                    `https://api.jikan.moe/v4/anime/${animeId}/streaming`
                );
                const streamingData = await streamingResponse.json();
                setStreaming(streamingData.data);
                // console.log(streamingData);

            } catch (error) {
                console.error("Error fetching anime details:", error);
            }
        };

        fetchAnimeDetails();
    }, [animeId]);

    const toggleFavorite = () => {
        if(!isFavorite)
        {
            console.log("toggle called")
            var favorites = JSON.parse(localStorage.getItem(`Favorites`));
            console.log(favorites)
            console.log(favorites.data)
            if(favorites && favorites.data && favorites.data.length >0)
            {
                favorites.data.push(animeDetails)
                favorites={"data": favorites.data}
                localStorage.setItem("Favorites", JSON.stringify(favorites))
            }
            else{   
                favorites={"data":[animeDetails]}
                localStorage.setItem("Favorites", JSON.stringify(favorites))
            }
            
            console.log(favorites)
            setIsFavortie(!isFavorite)
        }
        else{
            var favorites = JSON.parse(localStorage.getItem(`Favorites`));
                var index = -1;
                var filteredObj = favorites.data.find(function(item, i){
                if(item.mal_id === animeDetails.mal_id){
                    index = i;
                    return i;
                }
                });
                console.log(index , filteredObj)
                if(index !== -1)
                {
                    favorites.data.splice(index,1)
                    favorites={"data": favorites.data}
                    localStorage.setItem("Favorites", JSON.stringify(favorites))
                    setIsFavortie(!isFavorite)
                }
        }
    }


    return (
        <div css={containerStyles}>
        <div className="animeContainer">
            {animeDetails && (
                <div>
                    <div className="nameAndFavorite">
                        <h2>{animeDetails.title_english != null ? animeDetails.title_english : animeDetails.title}</h2>
                        <button className={isFavorite ? "favoriteFilledButton" : "favoriteEmptyButton"} onClick={() => toggleFavorite()}></button>                    </div>
                    <div className="imageAndDetails">
                        <img src={animeDetails.images.jpg.image_url} alt="Anime Poster" />
                        <div className="generalDetails">
                            <p>Producers: {animeDetails.producers.map(producer => producer.name).join(", ")}</p>
                            <p>Studios: {animeDetails.studios.map(studio => studio.name).join(", ")}</p>
                            <p>Rating: {animeDetails.rating}</p>
                            <p>Score: {animeDetails.score}</p>
                            <p>Genres: {animeDetails.genres.map(genre => genre.name).join(", ")}</p>
                            <p>Episode Count: {animeDetails.episodes}</p>
                            <p>Currently Airing: {animeDetails.airing ? "Yes" : "No"}</p>
                            {streaming && streaming.length != 0 && (
                                <div>
                                    <h3>Streaming Now At</h3>
                                    <ul>
                                        {streaming.map((service) =>
                                            <li key={service.name}>
                                                <a href={service.url} target="_blank">{service.name}</a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>                    
                        {animeDetails.trailer.url != null && 
                        <div className="youtubeContainer">
                            <p>Trailer:</p>
                            <YouTube opts={opts} videoId={animeDetails.trailer.youtube_id}/>
                        </div>}
                    </div>
                    <p>{animeDetails.synopsis != null && animeDetails.synopsis.replace("[Written by MAL Rewrite]", "")}</p>

                    {characters && (
                        <div>
                            <h3>Main Characters</h3>
                            <ul className="characterContainer">
                                {characters
                                .filter((character) => character.role === "Main")
                                .map((character) => (
                                    <li key={character.character.name} className="individualCharacter">
                                        {character.character.images.jpg.image_url !== "https://cdn.myanimelist.net/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c" && 
                                            <AnotherBox>
                                                <CharacterImage src={character.character.images.jpg.image_url} alt={character.character.name}/>
                                                <TextBox>
                                                    <CharacterText className="name">{character.character.name.split(", ").reverse().join(" ")}</CharacterText>
                                                </TextBox>
                                            </AnotherBox>
                                        }
                                        {character.character.images.jpg.image_url == "https://cdn.myanimelist.net/images/questionmark_23.gif?s=f7dcbc4a4603d18356d3dfef8abd655c" &&
                                            <div className="noImage">
                                                <p className="name">{character.character.name.split(", ").reverse().join(" ")}</p>
                                            </div>
                                        }
                                        {character.voice_actors.length !== 0 && (<p>VAs:</p>)}
                                        <div>{character.voice_actors
                                            .filter((va) => va.language === "Japanese" || va.language === "English")
                                            .map((va) => {
                                                const nameParts = va.person.name.split(", ");
                                                return (<div key={va.person.name}>
                                                    {nameParts[1]} {nameParts[0]}
                                                </div>);
                                            })}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
        <a className="bottomLink" href="https://www.flaticon.com/free-icons/star" title="star icons" target="_blank">Star icons created by Aldo Cervantes - Flaticon</a>
        </div>
    );
}