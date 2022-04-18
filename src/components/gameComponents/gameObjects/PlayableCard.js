import React, { useState } from "react";

import classes from "./Card.module.css";


const PlayableCard = (props) => {
    const playerId = localStorage.getItem("playerId");
    const [x, setX] = useState(900)
    const [y, setY] = useState(750)

    let offsetX, offsetY
    const move = e => {
        const el = e.target
        el.style.left = `${e.pageX - offsetX}px`
        el.style.top = `${e.pageY - offsetY}px`
    }
    const cardMouseDownHandler = event => {
        const el = event.target
        offsetX = event.clientX - el.getBoundingClientRect().left
        offsetY = event.clientY - el.getBoundingClientRect().top
        el.addEventListener('mousemove', move)
    }
    const cardMouseUpHandler = event => {
        const el = event.target
        el.removeEventListener('mousemove', move)
        offsetY = Math.abs(event.clientY - y);
        if(offsetY > 200) {
            console.log("Card played")
            props.onPlayed({playerId: playerId, card: "g4"});
            el.style.left = `${700}px`
            el.style.top = `${500}px`;
        }
        else {
            el.style.left = `${x}px`
            el.style.top = `${y}px`;
        }
    }
    return (
        <div className={`${classes.card} ${classes.playable}`} onMouseDown={cardMouseDownHandler} onMouseUp={cardMouseUpHandler}>
            5
        </div>
    );
};

export default PlayableCard;