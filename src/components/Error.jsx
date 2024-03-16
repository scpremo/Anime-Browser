import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { css } from '@emotion/react'
export default function ErrorContainer({children}){
    console.log("children== " + children)
    return <div css = {css`
        padding: 10px;
        background-color: #ff7c7c;
        color: #fff;
    `}>{children}</div>
}