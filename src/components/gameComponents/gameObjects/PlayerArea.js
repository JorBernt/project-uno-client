import React, {useEffect, useState} from "react";
import PlayableCard from "./PlayableCard";
import classes from "./PlayerArea.module.css"


const PlayerArea = (props) => {

    const [hand, setHand] = useState([]);

    const cardPlayedHandler = move => {
        props.onSendGameState({playerId: move.playerId, card: move.card, chosenColor:move.chosenColor});
    };

    useEffect(() => {
        console.log("hand", props.move)
        if (props.move !== undefined && props.move.type === "DRAW" && +props.move.playerId === +props.playerId && !props.move.publicResponse) {
            setHand(prevState => [...prevState, ...props.move.cards]);
        }
        if (props.move !== undefined && props.move.type === "MOVE" && +props.move.playerId === +props.playerId && props.move.publicResponse) {
            setHand(prevState => [...prevState.filter(c => c.id !== props.move.card.id)])
        }
    }, [props.move])

    useEffect(() => {
        console.log("update hand state")
        setHand(prevState => [...prevState]);
    }, [props.chosenColor])

    let cardNumber = 1;
    console.log(cardNumber)

    return (<div className={classes.area}>
        {hand.map(card => <PlayableCard key={card.id} onPlayed={cardPlayedHandler} card={card} cardNumber={cardNumber++}
                                        playerTurn={props.playerTurn} showColorPicker={props.showColorPicker}
                                        chosenColor={props.chosenColor}/>)}
    </div>)
};

export default PlayerArea;