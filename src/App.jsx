import React, { useEffect, useState } from "react"
import {
    NavLink,
    Outlet,
    useRouteError
} from 'react-router-dom'
import { css } from '@emotion/react';
import TopAnimeSeason from "./components/TopAnimeSeason";
import TopAnime from "./components/TopAnime"
import AnimeToday from "./components/AnimeToday"
import MyFavorites from "./components/MyFavorites";

const navStyle = css`
    .navbar{
        height: 70px;
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: black;
        color: white;
        justify-content: flex-start;
        align-items: center;
        display: flex;
        flex-direction: row;
    }

    li {
        float: left;
        display: block;
        color: white;
        text-align: center;
        text-decoration: none;
    }

    li:hover {
        background-color: #222;
    }

    ul li a{
        height: 70px;
        min-height: 100%;
        display: flex;
        flex: 1;
        box-sizing: border-box;
        padding: 20px 0px 20px 0px;
        text-decoration: none;
        padding: 14px 16px;
        color: white;
        display: flex;
        align-items: center;
      }
    
`

const homeStyles = css`
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100%;


    .internalContainer{
        color: white;
        background-color: black;
        border-radius: 10px;
        max-width: 70%;
        width: 70%;
        min-height: 60%;
        display: grid;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        padding: 20px;
    }

    .item{
        margin-bottom: 10px;
    }
`

export function Home() {
  return(
  <>
    
        <div css={homeStyles}>
            <div className="internalContainer">
                <div className="item"><MyFavorites/></div>
                <div className="item"><TopAnimeSeason/></div>
                <div className="item"><TopAnime/></div>
                <div className="item"><AnimeToday/></div>
            </div>
        </div>
    
  </>)
}

export function Root(props) {
    const { children } = props
    return (
        <>
            <nav css={navStyle}>
                <ul className="navbar" >
                    <li className='homeButton'><NavLink to="/Anime-Browser/">Home</NavLink></li>
                    <li><NavLink to="/Anime-Browser/guessSong" style={({ isActive }) => {
                        return {
                            backgroundColor: isActive ? "#111" : ""
                        }
                    }}>Guess the Opening!</NavLink></li>
                    <li><NavLink to="/Anime-Browser/higherOrLower" style={({ isActive }) => {
                        return {
                            backgroundColor: isActive ? "#111" : ""
                        }
                    }}>Higher or Lower?</NavLink></li>
                    <li><NavLink to="/Anime-Browser/search" style={({ isActive }) => {
                        return {
                            backgroundColor: isActive ? "#111" : ""
                        }
                    }}>Search Animes</NavLink></li>
                </ul>
            </nav>
            <main>{children || <Outlet />}</main>
        </>
    )
}

export function ErrorPage() {
    const error = useRouteError()
    if (error) {
        console.error(error)
        return (
            <>
                <h1>Error</h1>
                <p>{error.statusText || error.message}</p>
            </>
        )
    }
    //otherwise assume sent here for 404
    else {
        return (
            <h1>404 - Page Not Found!</h1>
        )
    }
}