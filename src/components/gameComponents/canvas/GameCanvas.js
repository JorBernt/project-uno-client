import React, {useState} from "react";

import classes from "./GameCanvas.module.css"

import Background from "./Background";
import PlayerArea from "../gameObjects/PlayerArea";
import OpponentArea from "../gameObjects/OpponentArea";
import PlayArea from "../gameObjects/PlayArea";
import ColorPicker from "./ColorPicker";

let selectedCard;

const GameCanvas = (props) => {
    console.log("numberOfplayers", props.numberOfPlayers)
    const playerId = +localStorage.getItem("playerId")
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [chosenColor, setChosenColor] = useState(null);
    const playerPlayHandler = state => {
        props.onSendGameState(state)
    };

    const handleColorPicker = color => {
        setChosenColor({selected: selectedCard, color: color});
        setShowColorPicker(false);
    }

    const showColorPickerHandler = val => {
        setShowColorPicker(true);
        selectedCard = val;
    }

    return (
        <div className={classes.canvas}>
            {showColorPicker && <ColorPicker setChosenColor={handleColorPicker}/>}
            <Background>
                <h2>{playerId}</h2>
                <p style={{
                    marginLeft: "37%",
                    fontSize: "30px",
                    zIndex: 2,
                    position: "absolute",
                    flexDirection: "row"
                }}>
                    {playerId === props.playerTurn ? "Your turn" : "Opponents Turn"}
                </p>
                {props.wildChosenColor !== "NONE" &&
                    <p style={{
                        marginLeft: "35%",
                        marginTop: "5%",
                        fontSize: "30px",

                        zIndex: 2,
                        position: "absolute",
                        flexDirection: "row"
                    }}>
                        Chosen color: <span style={{color: props.wildChosenColor,}}>{props.wildChosenColor}</span>
                    </p>
                }
                <PlayArea onSendGameState={playerPlayHandler} data={props.move} playerId={playerId}
                          playerTurn={props.playerTurn}/>
                <PlayerArea onSendGameState={playerPlayHandler} move={props.move} playerId={playerId}
                            callBack={props.callBack} playerTurn={props.playerTurn}
                            showColorPicker={showColorPickerHandler}
                            chosenColor={chosenColor}/>
                {props.numberOfPlayers > 1 &&
                    <OpponentArea playerID={playerId === 1 ? 2 : 1} move={props.move}></OpponentArea>}
            </Background>
        </div>
    );
};

export default GameCanvas;