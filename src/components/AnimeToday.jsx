import React, { useEffect, useState } from "react";
import AnimeScrollBox from "./AnimeScrollBox";

export default function TopAnimeSeason() {
  const today = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = today.getDay();
  const dayName = daysOfWeek[dayIndex];
    const call ={
      "api": `https://api.jikan.moe/v4/schedules?&sfw=true&filter=${dayName}`,
      "boxText": "Anime Today "
    }
    return (
      <>
        <AnimeScrollBox {...call}/>
      </>
    );
}
