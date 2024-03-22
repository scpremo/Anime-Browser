import React, { useState } from "react";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";

const searchStyles = css`

`

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [printable, setPrintable] = useState(false);

    const handleSearch = (event) => {
        const searchText = event.target.value;
        setSearchTerm(searchText);
        console.log(searchText);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        if (searchText.trim() == "") {
            setResults(null);
            setPrintable(false);
            return;
        }

        setTypingTimeout(setTimeout(async () => {
            try {
                const response = await fetch(`https://api.jikan.moe/v4/anime?q=${searchText}`);
                const data = await response.json();
                setResults(data);
                console.log(data);
                setPrintable(true);
            } catch (error) {
                console.error('Error fetching data:', error);
                setResults(null);
                setPrintable(false);
            }
        }, 333));
    };

    return (
        <div className="searchContainer" css={searchStyles}>
            <input
                type="text"
                placeholder="Search for anime..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <ul className="searchResults">
                {printable && results.data.map((anime) => (
                    <li key={anime.mal_id}>
                        <Link to={`/search/${anime.mal_id}`}>
                            {anime.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}