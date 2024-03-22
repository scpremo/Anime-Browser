import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";

const searchStyles = css`

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
        <div className="searchContainer" css={searchStyles}>
            <input
                type="text"
                placeholder="Search for anime..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button onClick={() => goToPage(1)}>Search</button>
            <div className="advancedSearch">
                <button onClick={() => setAdvanced(!advanced)}>Advanced Search Options</button>
                {advanced && (
                    <div className="advancedOptions">
                        <h3>Genres</h3>
                        {genres.map(genre => (
                            <label key={genre.name}>
                                <input
                                    type="checkbox"
                                    checked={genre.selected}
                                    onChange={() => handleCheckboxChange(genre.mal_id)}
                                />
                                {genre.name}
                            </label>
                        ))}
                    </div>
                )}
            </div>
            <ul className="searchResults">
                {printable && results && results.data.map((anime) => (
                    <li key={anime.mal_id}>
                        <img src={anime.images.jpg.small_image_url} alt={anime.title}></img>
                        <Link to={`/search/${anime.mal_id}`}>
                            {anime.title_english != null ? anime.title_english : anime.title}
                        </Link>
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
    );
}