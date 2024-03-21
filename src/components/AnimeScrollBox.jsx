import ScrollBoxItem from "./ScrollBoxItem";
import React, { useEffect, useState } from "react";
import { css } from '@emotion/react';
import styled from "@emotion/styled";


export default function TopAnimeSeason({api, boxText, pageLimit}) {
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
        const time = new Date().getTime()
        const hourInMilliseconds = 3600000 * 24; // 1 hour in milliseconds
        const fetchData = async () => {
            try {
                const response = await fetch(`${api}&limit=5&page=${currentPage}`);
                const data = await response.json();
                setTopAnime(data.data);
                var pageCount = data.pagination.last_visible_page;
                if (pageLimit && pageCount > pageLimit)
                    pageCount = pageLimit;
                setPages(pageCount);
                // Cache the fetched data
                localStorage.setItem(`${api}&${currentPage}`, JSON.stringify(data.data));
                localStorage.setItem(`${api}&cachedPages`, pageCount);
                localStorage.setItem('cachedTime' ,time)
            } catch (error) {
                console.error('Error fetching top anime:', error);
            }
        };

        // Check if data is cached, if not, fetch it
        const cachedTopAnime = JSON.parse(localStorage.getItem(`${api}&${currentPage}`));
        const cachedPages = localStorage.getItem(`${api}&cachedPages`);
        const cachedTime = localStorage.getItem('cachedTime');

        if (cachedTopAnime && cachedPages && cachedTime && time - cachedTime <= hourInMilliseconds) {
            setTopAnime(cachedTopAnime);
            setPages(cachedPages);
        } else 
            fetchData();
        
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
        if (!locked) {
            setLocked(true);
            var nextPageNumber = currentPage + 1;
            if (nextPageNumber > pages)
                nextPageNumber = 1;
            fetch(`${api}&limit=5&page=${nextPageNumber}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.status === '429')
                        setTimeout(() => nextPage(), 1000);
                    else
                    {
                        setTopAnime(data.data);
                        setCurrentPage(nextPageNumber);
                        // console.log(data.data)
                        setTimeout(() => setLocked(false), 333); // Unlock after timeout
                    }
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
            fetch(`${api}&limit=5&page=${prevPageNumber}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === '429')
                        setTimeout(() => prevPage(), 1000);
                    else
                    {
                        setTopAnime(data.data);
                        setCurrentPage(prevPageNumber);
                        // console.log(data.data)
                        setTimeout(() => setLocked(false), 333); // Unlock after timeout
                    }
                })
                .catch(error => {
                    console.error('Error fetching top anime:', error);
                    setLocked(false);
                });
        }
    }
    
    return (
      <>
        {boxText}
        {topAnime.length>0 && (
          <TopAnimeBox 
            onMouseEnter={() => {setIsHoveredLeft(true); setIsHoveredRight(true)}}
            onMouseLeave={() => {setIsHoveredLeft(false); setIsHoveredRight(false)}}
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
              {topAnime.map((item,index) => <ScrollBoxItem key={index} {...item}></ScrollBoxItem>)}
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
      </>
    );
}
