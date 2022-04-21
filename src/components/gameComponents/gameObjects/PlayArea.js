import React, {useEffect, useState} from "react";

import classes from "./PlayArea.module.css";
import Card from "./Card";

const PlayArea = (props) => {
    const [card, setCard] = useState(null);
    useEffect(() => {
        console.log("data", props.data)
        if (props.data !== undefined && props.data.type === "MOVE") {
            setCard(props.data.card);
        }
    }, [props.data])

    const deckClickHandler = event => {
        if(props.playerId !== props.playerTurn) return;
        console.log("deck click")
        props.onSendGameState({playerId: props.playerId, action: "DRAW"})
    }

    return (
        <div className={classes.area}>
            {card !== null && <Card x={125} y={50} cardNumber={0} data={card}></Card>}
            <div onClick={deckClickHandler}>
                <Card x={400} y={50} cardNumber={0}
                      data={{color: "gray", value: "D"}}></Card>
            </div>
        </div>
    )

}

export default PlayArea;