import React, { useEffect, useState } from "react";
import AnimeScrollBox from "./AnimeScrollBox";

export default function TopAnimeSeason() {
    
    const call ={
      "api": "https://api.jikan.moe/v4/anime?status=airing&type=tv&order_by=score&sort=desc&type=tv",
      "boxText": "Anime This Season"
    }
    return (
      <>
        <AnimeScrollBox {...call}/>
      </>
    );
}
