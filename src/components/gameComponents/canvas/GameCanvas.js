import React, {useEffect, useRef} from "react";


class Player {
    hand = []
    constructor(id, username) {
        this.id = id
        this.username = username
    }
}

class Card {
    width = 80
    height = 100
    radius = 4

    constructor(x, y, color, value) {
        this.x = x
        this.y = y
        this.originalPosX = x
        this.originalPosY = y
        this.color = color
        this.value = value
    }

    setX = x => {
        this.x = x
        this.originalPosX = x
    }
    setY = y => {
        this.y = y
        this.originalPosY = y
    }
}

class FullCard extends Card {

    followMouse = false
    hover = false
    played = false
    dead = false

    constructor(x, y, color, value, type, string, id, positionInHand) {
        super(x, y, color, value);
        this.type = type
        this.string = string
        this.id = id
        this.positionInHand = positionInHand
    }

    setFollowMouse = val => {
        this.followMouse = val
    }
    setHover = val => {
        this.hover = val
    }
    setDead = val => {
        this.dead = val
    }

    toPlayedCard = () => {
        return new PlayedCard(playedCardPosition.x, playedCardPosition.y, this.color, this.value, this.type, this.string, this.id)
    }
}

class PlayedCard extends Card {

    constructor(x, y, color, value, type, string, id) {
        super(x, y, color);
        this.value = value
        this.type = type
        this.string = string
        this.id = id
    }
}

const handPosition = {
    x: 500,
    y: 600,
    offset: 60
}

const playedCardPosition = {
    x: 700,
    y: 400
}


const GameCanvas = (props) => {
    const canvasRef = useRef(null)
    const playerId = localStorage.getItem("playerId")
    const sessionId = localStorage.getItem("sessionId")
    let hand = []
    let playedCard = null
    let stateLocked = false
    const deck = new Card(1000, 300, "gray", "DECK")
    let wildCard = null
    let colorPicker = false
    const players = []
    const resizeCanvasToDisplaySize = canvas => {

        const {width, height} = canvas.getBoundingClientRect()

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width
            canvas.height = height
            return true // here you can return some usefull information like delta width and delta height instead of just true
            // this information can be used in the next redraw...
        }

        return false
    }

    useEffect(() => {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            ctx.height = 1000
            ctx.width = 2000
            let frameCount = 0
            let animationFrameId;
            let cardsInHand = 0
            const addCardToHand = card => {
                const posInHand = cardsInHand++
                const c = new FullCard(deck.x, deck.y, card.color, card.value, card.type, card.string, card.id, posInHand)
                animateCardWithMovement(c, {
                    x: handPosition.x + (posInHand * handPosition.offset),
                    y: handPosition.y
                }, () => {
                    c.setX(handPosition.x + (posInHand * handPosition.offset))
                    c.setY(handPosition.y)
                    hand.push(c)
                    console.log(c)
                    hand = hand.sort((a, b) => a.positionInHand - b.positionInHand)

                })
            }
            const removeCardFromHand = card => {
                hand = hand.filter(c => c.id !== card.id)
                cardsInHand--
                for (const c of hand) {
                    if (c.positionInHand > card.positionInHand) {
                        c.positionInHand--
                        c.setX(handPosition.x + (c.positionInHand * handPosition.offset))
                    }
                }
                hand = hand.sort((a, b) => a.positionInHand - b.positionInHand)
            }
            const serverResponseHandler = (response) => {
                switch (response.type) {
                    case "STATE" : {

                    }
                    case "DRAW": {
                        if (response.publicResponse) return
                        for (const c of response.cards) {
                            addCardToHand(c)
                        }
                        break;
                    }
                    case "VALIDATE_PLAY": {
                        console.log(response.valid)
                        if (response.valid === true) {
                            playCard()
                        } else {
                            for (const card of hand) {
                                card.played = false
                                animateCardWithMovement(card, {x: card.originalPosX, y: card.originalPosY}, () => {
                                })
                            }
                            stateLocked = false
                        }
                        break;
                    }
                    case "MOVE" : {
                        if (+response.playerId !== +playerId) {
                            const c = response.card
                            const card = new FullCard(100, 100, c.color, c.value, c.type, c.string, c.id, 0)
                            animateCardWithMovement(card, {x: playedCardPosition.x, y: playedCardPosition.y}, () => {
                                playedCard = card
                                playedCard.setDead(true)
                            })
                        }
                        break;
                    }
                    default :
                        console.log("Response type unknown", response)
                }
            }

            const posEq = (a, b) => {
                return a.x === b.x && a.y === b.y
            }

            const getSpeed = (from, to) => {
                return Math.max(1, Math.abs(from - to) / 10)
            }

            const animateCard = (card, destination) => {
                renderCard(card)
                if (stateLocked) return
                if (!posEq(card, destination) && !card.followMouse && !card.dead) {
                    if (card.x >= destination.x - 3 && card.x <= destination.x + 3)
                        card.x = destination.x
                    if (card.y >= destination.y - 3 && card.y <= destination.y + 3)
                        card.y = destination.y
                    if (card.x < destination.x)
                        card.x += getSpeed(card.x, destination.x)
                    else if (card.x > destination.x)
                        card.x -= getSpeed(card.x, destination.x)
                    if (card.y < destination.y)
                        card.y += getSpeed(card.y, destination.y)
                    else if (card.y > destination.y)
                        card.y -= getSpeed(card.y, destination.y)
                }
            }

            const animateCardWithMovement = (card, destination, callback) => {
                renderCard(card)
                if (stateLocked) return
                if (!posEq(card, destination) && !card.followMouse) {
                    if (card.x >= destination.x - 3 && card.x <= destination.x + 3)
                        card.x = destination.x
                    if (card.y >= destination.y - 3 && card.y <= destination.y + 3)
                        card.y = destination.y
                    if (card.x < destination.x)
                        card.x += getSpeed(card.x, destination.x)
                    else if (card.x > destination.x)
                        card.x -= getSpeed(card.x, destination.x)
                    if (card.y < destination.y)
                        card.y += getSpeed(card.y, destination.y)
                    else if (card.y > destination.y)
                        card.y -= getSpeed(card.y, destination.y)
                    window.requestAnimationFrame(() => animateCardWithMovement(card, destination, callback))
                } else {
                    callback()
                }

            }

            const playCard = () => {
                for (const card of hand) {
                    if (card.played) {
                        console.log("card played")
                        stateLocked = false
                        playedCard = card.toPlayedCard()
                        removeCardFromHand(card)
                        break
                    }
                }
            }

            props.serverResponseCallback.current = serverResponseHandler

            const renderBackground = () => {
                ctx.fillStyle = '#c5d7f9'
                ctx.fillRect(50, 50, 1400, 1000)
            }

            const roundedRect = (ctx, x, y, width, height, radius) => {
                ctx.beginPath();
                ctx.moveTo(x, y + radius);
                ctx.arcTo(x, y + height, x + radius, y + height, radius);
                ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
                ctx.arcTo(x + width, y, x + width - radius, y, radius);
                ctx.arcTo(x, y, x, y + radius, radius);
                ctx.fill();
            }

            const renderHand = () => {
                for (const card of hand) {
                    if (card.hover && !card.followMouse) {
                        animateCard(card, {x: card.x, y: card.originalPosY - 10})
                    } else {
                        animateCard(card, {x: card.originalPosX, y: card.originalPosY})
                    }
                }
            }

            const renderDeck = () => {
                renderCard(deck)
            }

            const renderCard = (card) => {
                ctx.fillStyle = card.hover && !card.dead ? "pink" : card.color
                roundedRect(ctx, card.x, card.y, card.width, card.height, card.radius)
                ctx.font = "30px Comic Sans MS";
                ctx.fillStyle = card.color === "BLACK" ? "white" : "black";
                ctx.textAlign = "center";
                ctx.fillText(card.value, card.x + card.width / 2, card.y + card.height / 2);
            }

            const renderPlayedCard = () => {
                if (playedCard === null) return
                renderCard(playedCard)
            }

            class Button {
                hover = false
                width = 150
                height = 100
                radius = 5

                constructor(x, y, color, text) {
                    this.x = x
                    this.y = y
                    this.color = color
                    this.text = text
                }

                setHover = val => {
                    this.hover = val
                }
            }

            const colorPickerObj = {
                x: 550,
                y: 200,
                width: 400,
                height: 300,
                radius: 10
            }

            const buttons = []
            buttons.push(new Button(colorPickerObj.x + 50, colorPickerObj.y + 80, "YELLOW", "Yellow"))
            buttons.push(new Button(colorPickerObj.x + 200, colorPickerObj.y + 80, "RED", "Red"))
            buttons.push(new Button(colorPickerObj.x + 50, colorPickerObj.y + 180, "BLUE", "Blue"))
            buttons.push(new Button(colorPickerObj.x + 200, colorPickerObj.y + 180, "GREEN", "Green"))

            const renderColorPicker = () => {
                if (!colorPicker) return
                ctx.fillStyle = "white"
                roundedRect(ctx, 550, 200, 400, 300, 10)
                ctx.font = "30px Comic Sans MS";
                ctx.fillStyle = "black"
                ctx.textAlign = "center";
                ctx.fillText("Pick a color", 720, 250);

                for (const button of buttons) {
                    ctx.fillStyle = button.hover ? "pink" : button.color
                    roundedRect(ctx, button.x, button.y, button.width, button.height, button.radius)
                    ctx.font = "30px Comic Sans MS";
                    ctx.fillStyle = "black"
                    ctx.textAlign = "center";
                    ctx.fillText(button.text, button.x + 70, button.y + 60);
                }

            }

            const predraw = () => {
                ctx.save()
                //resizeCanvasToDisplaySize(ctx, canvas)
                const {width, height} = ctx.canvas
                ctx.clearRect(0, 0, width, height)
            }
            const postdraw = () => {
                ctx.restore()
            }

            const draw = (framecount) => {
                renderBackground()
                renderPlayedCard()
                renderHand()
                renderDeck()
                renderColorPicker()
            }

            const define = (element) => {
                roundedRect(ctx, element.x, element.y, element.width, element.height, element.radius)
            }

            const didClick = (element, event) => {
                define(element)
                const mouseX = parseInt(event.clientX);
                const mouseY = parseInt(event.clientY);
                return ctx.isPointInPath(mouseX, mouseY)
            }

            const mouseDownHandler = event => {
                if (colorPicker) {
                    for (const button of buttons) {
                        if (didClick(button, event)) {
                            props.onSendGameState({
                                playerId: playerId,
                                card: wildCard,
                                chosenColor: button.color,
                                sessionId: sessionId
                            })
                            wildCard = null
                            colorPicker = false
                            break
                        }
                    }
                }
                if (stateLocked) return
                for (const card of hand) {
                    if (card.hover) {
                        card.setFollowMouse(true)
                        break
                    }
                }
                if (didClick(deck, event)) {
                    props.onSendGameState({playerId: playerId, action: "DRAW", sessionId: sessionId})
                }
            }

            const showAndGetColor = card => {
                wildCard = card
                colorPicker = true
            }

            const mouseUpHandler = event => {
                if (stateLocked) return
                for (const card of hand) {
                    if (card.followMouse) {
                        card.followMouse = false
                        if (card.y < 400) {
                            card.dead = true
                            if (card.type === "WILD" || card.type === "DRAW4") {
                                animateCardWithMovement(card, playedCardPosition, () => {
                                    card.played = true
                                    console.log("played")
                                    showAndGetColor(card)
                                })
                                return;
                            }
                            animateCardWithMovement(card, playedCardPosition, () => {
                                card.played = true
                                console.log("played")
                                props.onSendGameState({
                                    card: card, 
                                    playerId: playerId,
                                    sessionId: sessionId
                                })
                            })
                        }
                    }
                }
            }

            const mouseMoveHandler = event => {
                const mouseX = parseInt(event.clientX);
                const mouseY = parseInt(event.clientY);
                for (const button of buttons) {
                    define(button)
                    if (ctx.isPointInPath(mouseX, mouseY)) {
                        button.setHover(true)
                        continue
                    }
                    button.setHover(false)
                }
                if (stateLocked) return
                for (const card of hand) {
                    if (card.followMouse) {
                        card.x = mouseX - card.width / 2
                        card.y = mouseY - card.height / 2
                    }
                }
                let n = -1
                let chosen
                for (const card of hand) {
                    define(card)
                    if (ctx.isPointInPath(mouseX, mouseY)) {
                        if (card.positionInHand > n) {
                            n = card.positionInHand
                            chosen = card
                        }
                    }
                    card.setHover(false)
                }
                if (chosen !== undefined)
                    chosen.setHover(true)

            }
            window.addEventListener('mousedown', mouseDownHandler)
            window.addEventListener('mouseup', mouseUpHandler)
            window.addEventListener('mousemove', mouseMoveHandler)

            //Our draw came here
            const render = () => {
                frameCount++
                predraw()
                draw(frameCount)
                postdraw()
                animationFrameId = window.requestAnimationFrame(render)
            }
            render()

            return () => {
                window.removeEventListener('mousedown', mouseDownHandler)
                window.removeEventListener('mouseup', mouseUpHandler)
                window.removeEventListener('mousemove', mouseMoveHandler)
                window.cancelAnimationFrame(animationFrameId)
            }
        }, [playerId]
    )

    return <canvas ref={canvasRef} {...props} width={1400} height={800}/>
};

export default GameCanvas;