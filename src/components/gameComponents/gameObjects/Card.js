import React, {useState, useRef, useEffect} from "react";

import classes from "./Card.module.css";


const Card = (props) => {
    const [x, setX] = useState(props.x + (props.cardNumber * 50))
    const [y, setY] = useState(props.y)
    const [m, setM] = useState(false);

    useEffect(() => {
        setX(props.x + (props.cardNumber * 50));
    }, [props.cardNumber])

    /*if(!m && props.move !== undefined && playerNumber.toString() === props.move.playerId.toString()) {
        console.log("moved")
        setX(700)
        setY(400)
        setM(true);
    }*/

    return (
        <div className={classes.card} style={{
            top: y + "px",
            left: x + "px",
            backgroundColor: props.data.color,
            color: props.data.color === "BLACK" ? "WHITE" : "BLACK",
        }}>{props.data.value}</div>
    );
};

export default Card;