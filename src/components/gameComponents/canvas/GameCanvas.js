import React, {useState} from "react";

import classes from "./GameCanvas.module.css"

import Background from "./Background";
import PlayerArea from "../gameObjects/PlayerArea";
import OpponentArea from "../gameObjects/OpponentArea";

const GameCanvas = (props) => {
    console.log("numberOfplayers", props.numberOfPlayers)
    const playerId = +localStorage.getItem("playerId")
    const playerPlayHandler = state => {
        props.onSendGameState(state)
    };
    return (
        <div className={classes.canvas}>
            <Background>
                <h2>{playerId}</h2>
                <div className={classes.playableArea}/>
                <PlayerArea onSendGameState={playerPlayHandler}/>
                {props.numberOfPlayers > 1 &&
                    <OpponentArea playerNumber={playerId === 1 ? 2 : 1} move={props.move}></OpponentArea>}
            </Background>
        </div>
    );
};

export default GameCanvas;