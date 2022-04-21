import GameCanvas from "../gameComponents/canvas/GameCanvas";
import React, {useEffect, useState, useRef} from "react";
import {useParams} from 'react-router-dom'
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import Button from "../UI/Button";
import classes from "../PlayMenu.module.css";

let stompClient = null;
let topic = null;
const hand = [];

const NOT_STARTED = "NOT_STARTED";
const INITIALIZE_GAME = "INITIALIZE_GAME";
const STARTED = "STARTED";

const GamePage = (props) => {

    const [playerId, setPlayerId] = useState(0);
    const params = useParams();
    const [numberOfPlayers, setNumberOfPlayers] = useState(0);
    const [move, setMove] = useState();
    const sessionId = localStorage.getItem("sessionId")
    const [username, setUsername] = useState("");
    const [gameReady, setGameReady] = useState(localStorage.getItem("username") !== null);
    const [gameStarted, setGameStarted] = useState(false);
    const [playerTurn, setPlayerTurn] = useState(1);
    const [gameState, setGameState] = useState(NOT_STARTED);
    const [gameOwner, setGameOwner] = useState("");
    const [wildChosenColor, setWildChosenColor] = useState("NONE");

    const usernameRef = useRef("");

    const sendData = (data) => {
        console.log(data)
        stompClient.send(`${topic}/sendGameData`, {}, JSON.stringify(data));
        return true;
    };

    const handleResponse = (response, publicResponse) => {
        const json = JSON.parse(response.body);
        console.log(json)
        switch (json.type) {
            case "CONFIG" : {
                setPlayerId(+json.playerId);
                localStorage.setItem("playerId", json.playerId);
                break;
            }
            case "STATE" : {
                setNumberOfPlayers(json.players.length);
                setPlayerTurn(json.playerTurn);
                setGameStarted(json.gameStarted)
                setGameState(json.state);
                setWildChosenColor(json.wildChosenColor);
                if(gameOwner === "")
                    setGameOwner(json.ownerUsername)
                break;
            }
            case "MOVE" : {
                setMove({playerId: json.playerId, card: json.card, type:json.type, publicResponse:publicResponse});
                break;
            }
            case "DRAW": {
                setMove({type: json.type, playerId: json.playerId, cards: json.cards, publicResponse:publicResponse});
            }
        }
    }

    const connectStomp = (addUser) => {
        topic = `/app/${params.roomId}`;
        const socket = new SockJS('http://localhost:8080/gs-guide-websocket', [], {
            sessionId: () => {
                return sessionId;
            }
        });
        stompClient = Stomp.over(socket);
        stompClient.connect({}, frame => {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/channel/${params.roomId}`, response => {
                handleResponse(response, true);
            });
            stompClient.subscribe(`/channel/${params.roomId}/${sessionId}`, response => {
                handleResponse(response, false);
            });
            if(addUser) {
                stompClient.send(`${topic}/addUser`, {}, JSON.stringify({
                    username: username,
                    roomId: params.roomId,
                    sessionId: sessionId
                }));
            }
        });
    }

    if(stompClient === null) {
        fetch(`http://localhost:8080/checkValidSessionId/?roomId=${params.roomId}&sessionId=${sessionId}`)
            .then(response => response.json())
            .then(
                (response) => {
                    if (response.success) {
                       connectStomp(false);
                    }
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const addUsernameHandler = () => {
        const usernameInput = usernameRef.current.value;
        fetch(`http://localhost:8080/joinGame/?username=${usernameInput}&roomId=${params.roomId}&sessionId=${sessionId}`)
            .then(response => response.json())
            .then(
                (response) => {
                    if (response) {
                        console.log(usernameInput)
                        setGameReady(true);
                        setUsername(usernameInput);
                        localStorage.setItem("username", usernameInput);
                        connectStomp(true);
                    }
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const startGameHandler = () => {
        stompClient.send(`${topic}/startGame`, {}, {});
        setGameStarted(true);
    }

    const callBack = () => {
        setMove(undefined)
    }


    return (
        <div>
            <div>
                {!gameReady &&
                    <div className={classes.playmenu}>
                        <h2>UNO!</h2>
                        <div className={classes.buttons}>
                            <label htmlFor="username">Username:</label>
                            <input id="username" ref={usernameRef}/>
                            <Button className={"addusername"} onClick={addUsernameHandler}>Start</Button>
                        </div>
                    </div>
                }
                {gameReady && !gameStarted && playerId === 1 &&
                    <Button className={"startgame"} onClick={startGameHandler}>Start game</Button>
                }
                {gameReady && !gameStarted && playerId !== 1 &&
                    <h1>Waiting for host to start game</h1>
                }
                {gameReady && <GameCanvas
                    onSendGameState={sendData}
                    numberOfPlayers={numberOfPlayers}
                    move={move}
                    hand={hand}
                    callBack={callBack}
                    playerTurn={playerTurn}
                    wildChosenColor={wildChosenColor}
                />}
            </div>
            <div>
                {/*  <Chat>

                </Chat>*/}
            </div>
        </div>
    )
}

export default GamePage;