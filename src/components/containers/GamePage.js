import GameCanvas from "../gameComponents/canvas/GameCanvas";
import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import Button from "../UI/Button";

let stompClient = null;
let topic = null;
const GamePage = (props) => {

    let playerId = 0;
    const params = useParams();
    const [numberOfPlayers, setNumberOfPlayers] = useState(0);
    const [move, setMove] = useState();
    const sessionId = localStorage.getItem("sessionId")
    const username = localStorage.getItem("username");
    const [gameReady, setGameReady] = useState(false);
    const sendData = (data) => {
        console.log(data)
        stompClient.send(`${topic}/sendGameData`, {}, JSON.stringify(data));
    }

    const handleResponse = (response) => {
        const json = JSON.parse(response.body);
        console.log(json)
        if (json.type === "CONFIG") {
            playerId = json.playerId;
            localStorage.setItem("playerId", playerId);
        } else if (json.type === "STATE") {
            setNumberOfPlayers(json.players.length);
        } else if (json.type === "MOVE") {
            setMove({playerId: json.playerId, card: json.card})
        }
    }

    useEffect(() => {
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
                handleResponse(response);
            });
            stompClient.subscribe(`/channel/${params.roomId}/${sessionId}`, response => {
                handleResponse(response);
            });
            stompClient.send(`${topic}/addUser`, {}, JSON.stringify({
                username: username,
                roomId: params.roomId,
                sessionId: sessionId
            }));
        });
    }, [handleResponse, params.roomId, sessionId, username]);

    const startGameHandler = event => {
        setGameReady(true);
    }

    return (
        <div>
            <div>
                {!gameReady && <div>
                    <label htmlFor="username">Username:</label>
                    <input id="username" />
                    <Button className={"startgame"} onClick={startGameHandler}>Start</Button>
                </div>}
                {gameReady && <GameCanvas
                    onSendGameState={sendData}
                    numberOfPlayers={numberOfPlayers}
                    move={move}/>}
            </div>
            <div>
                {/*  <Chat>

                </Chat>*/}
            </div>
        </div>
    )
}

export default GamePage;