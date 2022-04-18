import React, {useState, useRef, useEffect} from "react";

import classes from "./Card.module.css";


const Card = (props) => {
    console.log("move", props.move)
    const playerNumber = props.playerNumber;
    const [x, setX] = useState(300)
    const [y, setY] = useState(500)
    const [m, setM] = useState(props.move);



    if(props.move !== undefined && playerNumber.toString() === props.move.playerId.toString()) {
        console.log("moved")
        setX(700)
        setY(400)
        setM(true)
    }

    return (
        <div className={classes.card}  style={{top: y, left: x}}></div>
    );
};

export default Card;