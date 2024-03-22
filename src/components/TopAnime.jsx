import React, { useEffect, useState } from "react";
import AnimeScrollBox from "./AnimeScrollBox";

export default function TopAnime() {
    
    const call ={
      "api": "https://api.jikan.moe/v4/anime?type=tv&order_by=score&sort=desc",
      "boxText": "Top Anime of All Time",
      "pageLimit": 10
    }
    return (
      <>
        <AnimeScrollBox {...call}/>
      </>
    );
}