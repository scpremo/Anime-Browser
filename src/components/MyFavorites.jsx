import ScrollBoxItem from "./ScrollBoxItem";
import React, { useEffect, useState } from "react";
import { css } from '@emotion/react';
import styled from "@emotion/styled";


export default function MyFavorites({ api, boxText, pageLimit }) {
  const [topAnime, setTopAnime] = useState([]);
  const [setup, setSetup] = useState(false);
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredRight, setIsHoveredRight] = useState(false);
  const [length, setLength] = useState()
  const [pages, setPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const[favorites, setAllFavorites] = useState()
//   const [locked, setLocked] = useState(false)l


  // This useEffect runs only once during setup
  useEffect(() => {
    console.log("Setup useEffect called");
    if (!setup) {
      // Perform setup actions here
      setSetup(true);
    }
  }, []);

  // This useEffect fetches data when topAnime is empty
  useEffect(() => {
    if (topAnime.length === 0 && setup) {
      
    const cachedTopAnime = JSON.parse(localStorage.getItem(`Favorites`));
    console.log("cahced",cachedTopAnime)
      var cahcedLength = 0
      if(cachedTopAnime && cachedTopAnime.data && cachedTopAnime.data.length && cachedTopAnime.data.length>0)
      {
        cahcedLength = cachedTopAnime.data.length
        var firstFiveItems = cachedTopAnime.data.slice(0, 5);  
        setAllFavorites(cachedTopAnime.data)   
        setTopAnime(firstFiveItems);
        console.log(firstFiveItems)
      }
      else{
        localStorage.setItem("Favorites",JSON.stringify({"data": []}))
        
      }
      setPages(Math.floor((cahcedLength-1)/5+1))
      setLength(cahcedLength);     

    }
  }, [topAnime,setup]);

  const TopAnimeBox = styled.div`
      display: flex;
      margin: 0;
      overflow: hidden;
      padding: 0;
      position: relative;
    `;

  const Right = styled.div`
      background-image: url(/Anime-Browser/btn_handle.png);
      background-position: 0 0;
      background-repeat: no-repeat;
      background-size: 80px auto;
      cursor: pointer;
      display: inline-block;
      height: 80px;
      margin-top: -40px;
      opacity: 1;
      overflow: hidden;
      position: absolute;
      right: -92px; /* Adjust positioning */
      top: 50%;
      transition-duration: .3s;
      transition-property: all;
      transition-timing-function: ease-in-out;
      width: 40px;
      opacity: ${isHoveredRight ? 1 : 0}; /* Change opacity based on hover state */
      right: ${isHoveredRight ? '5px' : '-40'}; /* Change right position based on hover state */
      z-index: 10;
    `;

  const Left = styled.div`
    background-image: url(/Anime-Browser/btn_handle.png);
    background-position: -40px 0;
    background-repeat: no-repeat;
    background-size: 80px auto;
    cursor: pointer;
    display: inline-block;
    height: 80px;
    margin-top: -40px;
    opacity: 1;
    overflow: hidden;
    position: absolute;
    top: 50%;
    transition-duration: .3s;
    transition-property: all;;
    transition-timing-function: ease-in-out;
    width: 40px;
    z-index: 10;
    opacity: ${isHoveredLeft ? 1 : 0}; /* Change opacity based on hover state */
    left: ${isHoveredLeft ? '5px' : '-40px'}; /* Change right position based on hover state */`

  const ButtonInner = styled.span`
      cursor: pointer;
      display: inline-block;
    `;

  const nextPage = async () => {
    // if (!locked) {
      var nextPageNumber = currentPage + 1;
        if (nextPageNumber > pages)
            nextPageNumber = 1;
        var firstFiveItems = favorites.slice((nextPageNumber-1)*5, 5*nextPageNumber);  
        setTopAnime(firstFiveItems);
        setCurrentPage(nextPageNumber);    

      
    // }
  }


  const prevPage = async () => {
    // if (!locked) {
    //   setLocked(true);
      var prevPageNumber = currentPage - 1;
      if (prevPageNumber < 1)
        prevPageNumber = pages;
    console.log(pages)
        var firstFiveItems = favorites.slice((prevPageNumber-1)*5, 5*prevPageNumber);  
        setTopAnime(firstFiveItems);
        setCurrentPage(prevPageNumber); 
    // }
  }


  return (
    <>
      <h3>My Favorites</h3>
      {topAnime.length > 0 && (
        <TopAnimeBox
          onMouseEnter={() => { setIsHoveredLeft(true); setIsHoveredRight(true) }}
          onMouseLeave={() => { setIsHoveredLeft(false); setIsHoveredRight(false) }}
        >
          <Left
            // onMouseEnter={() => {setIsHoveredLeft(true); setIsHoveredRight(false)}}
            // onMouseLeave={() => {setIsHoveredLeft(false); setIsHoveredRight(false)}}
            onClick={prevPage}
          >
            <ButtonInner></ButtonInner>
          </Left>
          <div
            css={css`    
                display: flex;    
                unicode-bidi: isolate;
              `}
          >
           
            {topAnime.length && topAnime.length>0 && topAnime.map((item, index) => <ScrollBoxItem key={index} {...item}></ScrollBoxItem>)}
          </div>
          <Right
            // onMouseEnter={() => {setIsHoveredLeft(false); setIsHoveredRight(true)}}
            // onMouseLeave={() => {setIsHoveredLeft(false); setIsHoveredRight(false)}}
            onClick={nextPage}
          >
            <ButtonInner></ButtonInner>
          </Right>
        </TopAnimeBox>
      )}
    {topAnime.length< 1&&(
                <div>
                    Add favorites and they will apear here
                </div>
    )}
    </>
  );
}
