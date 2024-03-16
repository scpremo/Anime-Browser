import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { Global, css } from '@emotion/react'
import 'leaflet/dist/leaflet.css';


import App from './App'
const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
  html {
    font-family: "Montserrat", sans-serif;
  }
  body {
    margin: 0;
    background: white;
    ;
  }
`

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <Global styles={globalStyles} />
        <App />
    </Router>,
)
