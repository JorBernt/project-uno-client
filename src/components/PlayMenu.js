import React, {useRef} from "react";
import {useNavigate} from 'react-router-dom';
import Button from "./UI/Button";
import classes from "./PlayMenu.module.css"

const PlayMenu = () => {
    const navigate = useNavigate();
    const usernameRef = useRef(null);
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

    const createGameHandler = () => {
        localStorage.setItem("username", usernameRef.current.value);
        setSessionId();

        fetch(`http://localhost:8080/createNewGame/?username=${usernameRef.current.value}&sessionId=${sessionId}`)
            .then(respons => respons.json())
            .then(
                (roomId) => {
                    navigate(`/game/room/${roomId.id}`, {replace: false});
                },
                (error) => {

                }
            )
    }

    const connect = () => {
        console.log("Joining with id", sessionId)
        fetch(`http://localhost:8080/joinGame/?username=${usernameRef.current.value}&roomId=${roomIdRef.current.value}&sessionId=${sessionId}`)
            .then(respons => respons.json())
            .then(
                (response) => {
                    if (response.success) {

                        navigate(`/game/room/${roomIdRef.current.value}`, {replace: false});
                    }
                },
                (error) => {
                    console.log(error)
                }
            );
    }

    const joinGameHandler = () => {
        localStorage.setItem("username", usernameRef.current.value);
        if (sessionId != null) {
            fetch(`http://localhost:8080/checkValidSessionId/?roomId=${roomIdRef.current.value}&sessionId=${sessionId}`)
                .then(respons => respons.json())
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
                ).then(() => connect());
        } else {
            setSessionId();
            connect();
        }

    }
    return (
        <div className={classes.playmenu}>
            <h2>UNO!</h2>
            <div className={classes.buttons}>
                <label htmlFor="username">Username:</label>
                <input id="username" ref={usernameRef}/>
                <label htmlFor="roomid">Room ID:</label>
                <input id="roomid" ref={roomIdRef}/>
                <Button className={"creategame"} onClick={createGameHandler}>Create game</Button>
                <Button className={"joingame"} onClick={joinGameHandler}>Join game</Button>
            </div>
        </div>
    );
};

export default PlayMenu;
