import React, {useEffect, useState} from "react";

import Card from "./Card";

const OpponentArea = (props) => {
    const [hand, setHand] = useState([]);
    useEffect(() => {
        if(props.move !== undefined && props.move.type === "DRAW" && props.playerID === props.move.playerId && props.move.publicResponse) {
            setHand(prevState => [...prevState, ...props.move.cards])
        }
        else if(props.move !== undefined && props.move.type === "MOVE" && props.playerID === props.move.playerId && props.move.publicResponse) {
            console.log(props)
            setHand(prevState => [...prevState.splice(1)])
        }
    },[props.move])
    let cardNumber = 1;

    return (
        <>
            <h2>{props.playerID}</h2>
            {hand.map(card => <Card key={card.id}  move={props.move} data={card} x={700} y={300} cardNumber={cardNumber++}></Card>)}
        </>
    )
};

export default OpponentArea;