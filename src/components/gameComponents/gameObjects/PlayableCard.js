import React, {useEffect, useState} from "react";

import classes from "./Card.module.css";
import colorPicker from "../canvas/ColorPicker";


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
        let colorPicker = false;
        if (offsetY > 200) {
            if (props.card.type === "DRAW4" || props.card.type === "WILD") {
                props.showColorPicker({show:true, element:el, card:props.card});
                colorPicker = true;
            } else {
                playCard(null, "NONE");
            }
        }
        if (!colorPicker) {
            el.style.left = `${x}px`
            el.style.top = `${y}px`;
        }
    }

    useEffect(() => {
        if(props.chosenColor === null || props.card.id !== props.chosenColor.selected.card.id) return;
        console.log(props.chosenColor)
        const chosenColor = props.chosenColor.color.color;
        if (chosenColor === "CANCEL") {
            props.chosenColor.selected.element.style.left = `${x}px`
            props.chosenColor.selected.element.style.top = `${y}px`
        } else if (chosenColor !== "NONE") {
            playCard(props.chosenColor.selected.card, chosenColor);
        }
    }, [props.chosenColor])

    const playCard = (card, chosenColor) => {
        props.onPlayed({
            playerId: playerId,
            card: card === null ? props.card : card,
            chosenColor: chosenColor
        })
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