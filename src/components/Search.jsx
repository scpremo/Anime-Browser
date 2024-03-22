import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";

const searchStyles = css`
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100%;


    .searchContainer{
        color: white;
        background-color: black;
        border-radius: 10px;
        max-width: 70%;
        width: 70%;
        min-height: 60%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        padding: 20px;
    }

    .searchBarAndButtons{
        display: flex;
        flex-direction: column;
        align-self: center;
        width: 30%;
    }

    .searchButtons{        
        align-self: center;
        display: flex;  
        justify-content: center;
        align-items: center;        
        width: 100%;
    }

    .advancedContainer{
        margin-left: 40px;
        margin-right: 40px;

    }

    .advancedOptions{
        padding: 10px;
        color: white;
        border-top: none;
        display: block;
        columns: 4;
        font-size: 12px;
    }

    .genre{
        list-style: none;
        text-align: left;
        display: block;
        width:100%;
    }

    .searchResults{
        list-style: none;
        padding: 0px;
        margin-left: 40px;
        margin-right: 40px;
    }

    .anime{
        border-top: 1px solid gray;
        border-bottom: 1px solid gray;
        display: flex;
        flex-direction: row;
        padding: 10px;
    }

    .anime img{
        border: 1px solid white;
        max-height: 100%;
        width: auto;
    }

    .animeDetails{
        margin-left: 10px;
    }

    .animeDetails a{
        color: white;
    }

    .animeDetails a:hover{
        color: gray;
    }

    .animeDetails p{
        margin: 0px;
        font-size: 12px;
    }

    .paginationButtons{
        align-self: center;
        display: flex;
    }

    .paginationButtons span{
        margin-left: 10px;
        margin-right: 10px;
    }
`

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [printable, setPrintable] = useState(false);
    const [genres, setGenres] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [advanced, setAdvanced] = useState(false);

    useEffect(() => {
        async function fetchGenres() {
            try {
                const response = await fetch("https://api.jikan.moe/v4/genres/anime");
                const data = await response.json();
                const filteredData = data.data.filter(
                    (genre) =>
                      ![
                        "Ecchi",
                        "Erotica",
                        "Hentai",
                        "Magical Sex Shift",
                        "Crossdressing",
                        "Boys Love",
                        "Girls Love"
                      ].includes(genre.name)
                  );
                setGenres(filteredData.map(genre => ({ ...genre, selected: false })));
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        }
        fetchGenres();
    }, []);


    const handleSearch = async (page) => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
    
        setTypingTimeout(setTimeout(async () => {
            try {
                const selectedGenres = genres.filter(genre => genre.selected).map(genre => genre.mal_id).join(",");
                console.log(page);
                const response = await fetch(`https://api.jikan.moe/v4/anime?q=${searchTerm}&genres=${selectedGenres}&page=${page}`);
                const data = await response.json();
                const uniqueResults = data.data.reduce((unique, anime) => {
                    if (!unique.some(item => item.mal_id === anime.mal_id)) {
                        unique.push(anime);
                    }
                    return unique;
                }, []);
                setResults({ ...data, data: uniqueResults });
                setPrintable(true);
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setResults(null);
                setPrintable(false);
            }
        }, 333));
    };

    const handleCheckboxChange = (id) => {
        const updatedGenres = genres.map(genre =>
            genre.mal_id === id ? { ...genre, selected: !genre.selected } : genre
        );
        setGenres(updatedGenres);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
        handleSearch(page);
    };

    return (
        <div css={searchStyles}>
        <div className="searchContainer">
            <div className="searchBarAndButtons">
                <input
                    type="text"
                    placeholder="Search for anime..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <div className="searchButtons">
                    <button onClick={() => goToPage(1)}>Search</button>
                    <button onClick={() => setAdvanced(!advanced)}>Advanced Search</button>
                </div>
            </div>
            <div className="advancedSearch">
                {advanced && (
                    <div className="advancedContainer">
                        <h3>Genres/Themes</h3>
                        <div className="advancedOptions">
                            {genres.map(genre => (
                                <label key={genre.name} className="genre">
                                    <input
                                        type="checkbox"
                                        checked={genre.selected}
                                        onChange={() => handleCheckboxChange(genre.mal_id)}
                                    />
                                    {genre.name}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ul className="searchResults">
                {printable && <h3>Anime</h3>}
                {printable && results && results.data.map((anime) => (
                    <li key={anime.mal_id} className="anime">
                        <img src={anime.images.jpg.small_image_url} alt={anime.title}></img>
                        <div className="animeDetails">
                            <Link to={`/search/${anime.mal_id}`} target="_blank">
                                {anime.title_english != null ? anime.title_english : anime.title}
                            </Link>
                            <p>{anime.type} ({anime.episodes} eps)</p>
                            <p>{anime.rating}</p>
                            <p>Scored {anime.score}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="paginationButtons">
                {results && results.pagination && (
                    <div>
                        {currentPage !== 1 && (
                            <button onClick={() => goToPage(1)}>{"<<"}</button>
                        )}
                        {currentPage !== 1 && (
                            <button onClick={() => goToPage(currentPage - 1)}>{"<"}</button>
                        )}
                        <span>{currentPage} / {results.pagination.last_visible_page}</span>
                        {results.pagination.has_next_page && (
                            <button onClick={() => goToPage(currentPage + 1)}>{">"}</button>
                        )}
                        {currentPage !== results.pagination.last_visible_page && (
                            <button onClick={() => goToPage(results.pagination.last_visible_page)}>{">>"}</button>
                        )}
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}