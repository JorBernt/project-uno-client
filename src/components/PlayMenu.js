import React, {useRef} from "react";
import {useNavigate} from 'react-router-dom';
import Button from "./UI/Button";
import classes from "./PlayMenu.module.css"

const PlayMenu = () => {
    const navigate = useNavigate();
    const roomIdRef = useRef(null);
    let sessionId = localStorage.getItem("sessionId");

    const randomString = (length) => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    const setSessionId = () => {
        sessionId = randomString(8);
        localStorage.setItem("sessionId", sessionId);
    }

    const connect = roomId => {
        fetch(`http://localhost:8080/checkValidRoomId/?roomId=${roomId}`)
            .then(response => response.json())
            .then(
                (response) => {
                    if (response.success) {
                        navigate(`/game/room/${roomId}`, {replace: false});
                    }
                    else
                        console.log("fant ikke rom", roomId)
                },
                (error) => {
                    console.log("error")
                    console.log(error)
                }
            )
    }

    const createGameHandler = () => {
        localStorage.clear();
        setSessionId();
        fetch(`http://localhost:8080/createNewGame/?sessionId=${sessionId}`)
            .then(response => response.json())
            .then(
                (roomId) => {
                    connect(roomId.id);
                },
                (error) => {

                }
            )
    }

    const joinGameHandler = () => {
        localStorage.clear();
        if (sessionId != null) {
            fetch(`http://localhost:8080/checkValidSessionId/?roomId=${roomIdRef.current.value}&sessionId=${sessionId}`)
                .then(response => response.json())
                .then(
                    (response) => {
                        if (!response.success) {
                            console.log("Invalid sessionId, settin new")
                            console.log("Old", sessionId)
                            setSessionId();
                            console.log("New", sessionId)
                        }
                    },
                    (error) => {
                        console.log(error)
                    }
                ).then(() => connect(roomIdRef.current.value));
        } else {
            setSessionId();
            connect(roomIdRef.current.value);
        }

    }

    return (
        <div className={classes.playmenu}>
            <h2>UNO!</h2>
            <div className={classes.buttons}>
                <label htmlFor="roomid">Room ID:</label>
                <input id="roomid" ref={roomIdRef}/>
                <Button className={"creategame"} onClick={createGameHandler}>Create game</Button>
                <Button className={"joingame"} onClick={joinGameHandler}>Join game</Button>
            </div>
        </div>
    );
};

export default PlayMenu;
