import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const CharacterImage = styled.img`
    aspect-ratio: auto 9 / 14;
`
const CharacterText = styled.span`
    background-image: url(/image_box_shadow_bottom.png?v=1634263200);
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    bottom: 3px;
    display: inline-block;
    font-family: Avenir, lucida grande, tahoma, verdana, arial, sans-serif;
    font-size: 11px;
    left: 0;
    line-height: 1.2em;
    padding: 15px 5px 5px;
    position: absolute;
    text-shadow: rgba(0,0,0,.8) 1px 1px 0;
`
const TextBox = styled.h3`
    display: inline;
    font-size: 11px;
    font-weight: 400;
    line-height: 1.5em;
`
const AnotherBox = styled.div`
    background-repeat: no-repeat;
    background-size: cover;
    display: block;
    opacity: 1;
    position: relative;
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
        aspect-ratio: auto 160 / 220;

    }

    .generalDetails{
        display: flex;
        flex-direction: column;
        gap: 3px;

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
`
export default function SearchDetail() {
    const { animeId } = useParams();
    const [animeDetails, setAnimeDetails] = useState(null);
    const [characters, setCharacters] = useState(null);
    const [streaming, setStreaming] = useState(null);
    const navigate = useNavigate();


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
                // console.log(data.data);

                const characterResponse = await fetch(
                    `https://api.jikan.moe/v4/anime/${animeId}/characters`
                );
                const detailsData = await characterResponse.json();
                setCharacters(detailsData.data);
                // console.log(detailsData);

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

    return (
        <div css={containerStyles}>
        <div className="animeContainer">
            {animeDetails && (
                <div>
                    <h2>{animeDetails.title}</h2>
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
                    </div>
                    <p>{animeDetails.synopsis.replace("[Written by MAL Rewrite]", "")}</p>

                    {characters && (
                        <div>
                            <h3>Main Characters</h3>
                            <ul className="characterContainer">
                                {characters
                                .filter((character) => character.role === "Main")
                                .map((character) => (
                                    <li key={character.character.name} className="individualCharacter">
                                        <AnotherBox>
                                            <CharacterImage src={character.character.images.jpg.image_url} alt={character.character.name}/>
                                            <TextBox>
                                                <CharacterText className="name">{character.character.name.split(", ").reverse().join(" ")}</CharacterText>
                                            </TextBox>
                                        </AnotherBox>
                                        <p>VAs:</p>
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
        </div>
    );
}