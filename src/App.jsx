import React, { useEffect, useState } from "react"
import {
    NavLink,
    Outlet,
    useRouteError
} from 'react-router-dom'
import { css } from '@emotion/react';
import TopAnimeSeason from "./components/TopAnimeSeason";
import TopAnime from "./components/TopAnime"

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

export function Home() {
  return(
  <>
    
        <div css={css`
        display:grid;
        justify-content: center;`}>
            <TopAnimeSeason/>   
            <TopAnime/>        
        </div>
    
  </>)
}

export function Root(props) {
    const { children } = props
    return (
        <>
            <nav css={navStyle}>
                <ul className="navbar" >
                    <li className='homeButton'><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/guessSong" style={({isActive}) => {
                        return {
                            backgroundColor: isActive ? "#111" : ""
                        }
                    }}>Guess the Opening!</NavLink></li>
                    <li><NavLink to="/higherOrLower" style={({isActive}) => {
                        return {
                            backgroundColor: isActive ? "#111" : ""
                        }
                    }}>Higher or Lower?</NavLink></li>
                    <li><NavLink to="/search" style={({isActive}) => {
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
    if(error){
        console.error(error)
        return (
            <>
                <h1>Error</h1>
                <p>{error.statusText || error.message}</p>
            </>
        )
    }
    //otherwise assume sent here for 404
    else{
        return (
            <h1>404 - Page Not Found!</h1>
        )
    }
}