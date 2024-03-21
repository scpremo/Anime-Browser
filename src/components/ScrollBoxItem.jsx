import styled from "@emotion/styled";
import {
    NavLink,
    Outlet,
    useRouteError
} from 'react-router-dom'

export default function ScrollBoxItem({mal_id,title,title_english,images}) {
    const AnimeItem = styled.div`
        width:100%;
    `
    const AnimeImage = styled.img`
        width: 160px;
        aspect-ratio: auto 160 / 220;
        height: 220px;
    `
    const AnimeText = styled.span`
    background-image: url(/image_box_shadow_bottom.png?v=1634263200);
    background-position: left bottom;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    bottom: 3px;
    color: #fff;
    display: inline-block;
    font-family: Avenir, lucida grande, tahoma, verdana, arial, sans-serif;
    font-size: 11px;
    left: 0;
    line-height: 1.2em;
    padding: 15px 5px 5px;
    position: absolute;
    text-shadow: rgba(0,0,0,.8) 1px 1px 0;
    width:150px
    `
    const TextBox = styled.h3`
    display: inline;
    font-size: 11px;
    font-weight: 400;
    line-height: 1.5em;`
    const AnotherBox = styled.div`
    background-repeat: no-repeat;
    background-size: cover;
    display: block;
    opacity: 1;
    position: relative;
    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    -webkit-transition-property: opacity;
    transition-property: opacity;
    -webkit-transition-timing-function: ease-in-out;
    transition-timing-function: ease-in-out;
    margin: 6px`
    return(
        <AnotherBox>
            <NavLink to={`/search/${mal_id}`}>
                <TextBox>
                    <AnimeText>
                        {title_english ? title_english : title}
                    </AnimeText>
                </TextBox>
                
                <div>
                    <AnimeImage src={images.jpg.image_url} alt ={title}/>
                </div>
            </NavLink>
        </AnotherBox>
    )
}