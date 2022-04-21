import React, {useState} from "react";

import classes from "./GameCanvas.module.css"

import Background from "./Background";
import PlayerArea from "../gameObjects/PlayerArea";
import OpponentArea from "../gameObjects/OpponentArea";
import PlayArea from "../gameObjects/PlayArea";

const GameCanvas = (props) => {
    console.log("numberOfplayers", props.numberOfPlayers)
    const playerId = +localStorage.getItem("playerId")
    const playerPlayHandler = state => {
       return props.onSendGameState(state)
    };
    return (
        <div className={classes.canvas}>
            <Background>
                <h2>{playerId}</h2>
                <p style={{marginLeft: "45%", fontSize:"30px"}}>{playerId === props.playerTurn ? "Your turn" : "Opponents Turn"}</p>
                <PlayArea onSendGameState={playerPlayHandler} data={props.move} playerId={playerId} playerTurn={props.playerTurn}/>
                <PlayerArea onSendGameState={playerPlayHandler} move={props.move} playerId={playerId} callBack={props.callBack} playerTurn={props.playerTurn}/>
                {props.numberOfPlayers > 1 &&
                    <OpponentArea playerID={playerId === 1 ? 2 : 1} move={props.move}></OpponentArea>}
            </Background>
        </div>
    );
};

export default GameCanvas;