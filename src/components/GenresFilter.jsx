 /** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useEffect } from "react";



export default function GenresDropDown() {
    const genresDropDownStyles = css`
  .dropdown-check-list {
    display: inline-block;
  }
`;
const anchorCss = css`
  position: relative;
  cursor: pointer;
  display: inline-block;
  padding: 5px 50px 5px 10px;
  border: 1px solid #ccc;
  color: #0094ff;

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
`;

const listCss = css`
    color: black;
    padding: 2px;
    margin: 0;
    border: 1px solid #ccc;
    border-top: none;
    background-color: white;
    position: absolute;
    z-index: 1000;  
`
const itemCss = css`
    list-style: none;
    text-align: left;
    display: block;

`
  const [genres, setGenres] = useState();
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
      setGenres(data);
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
      getDropDown();
      setSetUp(false);
    }
  }, [setUp]);

  return (
    <div id="list1" css={genresDropDownStyles} tabIndex="100">
      <span css={anchorCss} className="anchor" onClick={() => setCheckList(!checkList)}>
        Genres
      </span>
      {checkList && (
        <ul css={listCss} className="items">
          {genres.data.map((genre) => (
            <li key={genre.id} css={itemCss}>
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
    </div>
  );
}
