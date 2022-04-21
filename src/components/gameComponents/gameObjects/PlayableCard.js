import React, {useEffect, useState} from "react";

import classes from "./Card.module.css";


const PlayableCard = (props) => {
    const playerId = localStorage.getItem("playerId");
    const [x, setX] = useState(700 + props.cardNumber * 50)
    const [y, setY] = useState(900)

    useEffect(() => {
        setX(700 + props.cardNumber * 50);
    }, [props.cardNumber])

    let offsetX, offsetY
    const move = e => {
        const el = e.target
        el.style.left = `${e.pageX - offsetX}px`
        el.style.top = `${e.pageY - offsetY}px`
    }
    const cardMouseDownHandler = event => {
        console.log(props.playerTurn, playerId)
        if (props.playerTurn !== +playerId) return;
        const el = event.target
        offsetX = event.clientX - el.getBoundingClientRect().left
        offsetY = event.clientY - el.getBoundingClientRect().top
        el.addEventListener('mousemove', move)
    }
    const cardMouseUpHandler = event => {
        const el = event.target
        el.removeEventListener('mousemove', move)
        offsetY = Math.abs(event.clientY - y);
        if (offsetY > 200)
            props.onPlayed({playerId: playerId, card: props.card})
        el.style.left = `${x}px`
        el.style.top = `${y}px`;
    }
    return (
        <div className={`${classes.card} ${classes.playable}`} style={{
            backgroundColor: props.card.color,
            color: props.card.color === "BLACK" ? "WHITE" : "BLACK",
            left: x,
            top: y
        }}
             onMouseDown={cardMouseDownHandler} onMouseUp={cardMouseUpHandler}>
            {props.card.value}
        </div>
    );
};

export default PlayableCard;