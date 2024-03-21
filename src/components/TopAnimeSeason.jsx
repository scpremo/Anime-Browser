import ScrollBoxItem from "./ScrollBoxItem";
import React, { useEffect, useState } from "react";
import { css } from '@emotion/react';
import styled from "@emotion/styled";

export default function TopAnimeSeason() {
    const [topAnime, setTopAnime] = useState([]);
    const [setup, setSetup] = useState(false); 
    const [isHoveredLeft, setIsHoveredLeft] = useState(false);
    const [isHoveredRight, setIsHoveredRight] = useState(false);
    const [pages, setPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [locked, setLocked] = useState(false)


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
        console.log("Data fetching useEffect called");
        fetch(`https://api.jikan.moe/v4/anime?status=airing&type=tv&order_by=score&sort=desc&limit=5`)
          .then(response => response.json())
          .then(data => {
            setTopAnime(data.data);
            setPages(data.pagination.last_visible_page)
            console.log(data);
          })
          .catch(error => {
            console.error('Error fetching top anime:', error);
          });
      }
    }, [topAnime, setup]); 

    const TopAnimeBox= styled.div`
      display: flex;
      margin: 0;
      overflow: hidden;
      padding: 0;
      position: relative;
    `;

    const Right = styled.div`
      background-image: url(/btn_handle.png);
      -webkit-background-position: 0 0;
      background-position: 0 0;
      background-repeat: no-repeat;
      -webkit-background-size: 80px auto;
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
      -webkit-transition-duration: .3s;
      transition-duration: .3s;
      -webkit-transition-property: all;
      transition-property: all;
      -webkit-transition-timing-function: ease-in-out;
      transition-timing-function: ease-in-out;
      width: 40px;
      opacity: ${isHoveredRight ? 1 : 0}; /* Change opacity based on hover state */
      right: ${isHoveredRight ? '5px' : '-40'}; /* Change right position based on hover state */
      z-index: 10;
    `;

    const Left = styled.div`
    background-image: url(/btn_handle.png);
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
    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    -webkit-transition-property: all;
    transition-property: all;
    -webkit-transition-timing-function: ease-in-out;
    transition-timing-function: ease-in-out;
    width: 40px;
    z-index: 10;
    opacity: ${isHoveredLeft ? 1 : 0}; /* Change opacity based on hover state */
    left: ${isHoveredLeft ? '5px' : '40px'}; /* Change right position based on hover state */`

    const ButtonInner = styled.span`
      cursor: pointer;
      display: inline-block;
    `;
    const nextPage = async () => {
        if (!locked) {
            setLocked(true);
            var nextPageNumber = currentPage + 1;
            if (nextPageNumber > pages)
                nextPageNumber = 1;
            fetch(`https://api.jikan.moe/v4/anime?status=airing&type=tv&order_by=score&sort=desc&limit=5&page=${nextPageNumber}`)
                .then(response => response.json())
                .then(data => {
                    setTopAnime(data.data);
                    setCurrentPage(nextPageNumber);
                    console.log(data.data)
                    setTimeout(() => setLocked(false), 333); // Unlock after timeout
                })
                .catch(error => {
                    console.error('Error fetching top anime:', error);
                    setLocked(false);
                });
        }
    }
    
    const prevPage = async () => {
        if (!locked) {
            setLocked(true);
            var prevPageNumber = currentPage - 1;
            if (prevPageNumber < 1)
                prevPageNumber = pages;
            fetch(`https://api.jikan.moe/v4/anime?status=airing&type=tv&order_by=score&sort=desc&limit=5&page=${prevPageNumber}`)
                .then(response => response.json())
                .then(data => {
                    setTopAnime(data.data);
                    setCurrentPage(prevPageNumber);
                    setTimeout(() => setLocked(false), 333); // Unlock after timeout
                })
                .catch(error => {
                    console.error('Error fetching top anime:', error);
                    setLocked(false);
                });
        }
    }
    
    return (
      <>
        Anime this season
        {topAnime.length>0 && (
          <TopAnimeBox 
            onMouseEnter={() => {setIsHoveredLeft(true); setIsHoveredRight(true)}}
            onMouseLeave={() => {setIsHoveredLeft(false); setIsHoveredRight(false)}}
          >
            <Left
                onMouseEnter={() => {setIsHoveredLeft(true); setIsHoveredRight(false)}}
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
              {topAnime.map(item => <ScrollBoxItem key={item.mal_id} {...item}></ScrollBoxItem>)}
            </div>                      
            <Right
                onMouseEnter={() => {setIsHoveredLeft(false); setIsHoveredRight(true)}}
                onClick={nextPage}
            >
              <ButtonInner></ButtonInner>
            </Right>
          </TopAnimeBox>
        )}
      </>
    );
}
