import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Global, css } from '@emotion/react'
import 'leaflet/dist/leaflet.css';

import {
  Home,
  Root,
  ErrorPage
} from "./App"

import Search from './components/Search';
import HigherOrLowerGame from './components/HigherOrLowerGame';
import AnimeGuessGame from './components/AnimeGuessGame';

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
  html {
    font-family: "Montserrat", sans-serif;
  }
  body {
    margin: 0;
    background: linear-gradient(to left, #0e182e, #264284);
    min-height: 100%;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }
`

const router = createBrowserRouter([
  {
      path: "/",
      element: <Root />,
      errorElement: <Root><ErrorPage /></Root>,
      children: [
          { index: true, element: <Home /> },
          { path: "guessSong", element: <AnimeGuessGame />},
          { path: "higherOrLower", element: <HigherOrLowerGame />},
          { path: "search", element: <Search /> },
          { path: "*", element: <ErrorPage />}
      ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Global styles={globalStyles} />
        <RouterProvider router={router} />    
    </React.StrictMode>,
)
