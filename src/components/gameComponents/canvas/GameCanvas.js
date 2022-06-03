import React, {useEffect, useRef} from "react";

class Card {
    width = 80
    height = 100
    radius = 4
    followMouse = false
    handX = 0
    handY = 0
    hover = false
    played = false

    constructor(x, y, color, value, type, string, id, positionInHand) {
        this.x = x
        this.y = y
        this.handX = x
        this.handY = y
        this.color = color
        this.value = value
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

let hand = []
let playedCard = {}
let stateLocked = false

const GameCanvas = (props) => {
    const canvasRef = useRef(null)
    const playerId = localStorage.getItem("playerId")

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
            const serverResponseHandler = (response) => {
                if (response.type === "DRAW") {
                    if (response.publicResponse) return
                    console.log("draw", response)
                    hand = []
                    let offset = 0
                    let positionInHand = 0
                    for (const c of response.cards) {
                        hand.push(new Card(handPosition.x + offset, handPosition.y, c.color, c.value, c.type, c.string, c.id, positionInHand))
                        offset += handPosition.offset
                        positionInHand++
                    }
                }
                if (response.type === "VALIDATE_PLAY") {
                    console.log(response.valid)
                    if (response.valid == true) {
                        playCard()
                    }
                    else {
                        for(const card of hand) {
                            card.played = false
                        }
                        stateLocked = false
                    }
                }
            }

            const posEq = (a,b) => {
                return a.x === b.x && a.y === b.y
            }

            const getSpeed = (from, to) => {
                return Math.max(1, Math.abs(from-to) / 10)
            }

            const animateCard = (card, destination) => {
                drawCard(card)
                if(stateLocked) return
                if(!posEq(card, destination) && !card.followMouse) {
                    if(card.x >= destination.x - 3 && card.x <= destination.x + 3)
                        card.x = destination.x
                    if(card.y >= destination.y - 3 && card.y <= destination.y + 3)
                        card.y = destination.y
                    if(card.x < destination.x)
                        card.x += getSpeed(card.x, destination.x)
                    else if(card.x > destination.x)
                        card.x -= getSpeed(card.x, destination.x)
                    if(card.y < destination.y)
                        card.y += getSpeed(card.y, destination.y)
                    else if(card.y > destination.y)
                        card.y -= getSpeed(card.y, destination.y)
                }
            }

        const animateCardWithMovement = (card, destination) => {
            drawCard(card)
            if(stateLocked) return
            if(!posEq(card, destination) && !card.followMouse) {
                if(card.x >= destination.x - 3 && card.x <= destination.x + 3)
                    card.x = destination.x
                if(card.y >= destination.y - 3 && card.y <= destination.y + 3)
                    card.y = destination.y
                if(card.x < destination.x)
                    card.x += getSpeed(card.x, destination.x)
                else if(card.x > destination.x)
                    card.x -= getSpeed(card.x, destination.x)
                if(card.y < destination.y)
                    card.y += getSpeed(card.y, destination.y)
                else if(card.y > destination.y)
                    card.y -= getSpeed(card.y, destination.y)
                window.requestAnimationFrame(() => animateCardWithMovement(card, destination))
            }

        }

            const playCard = () => {
                for (const card of hand) {
                    if (card.played) {
                        stateLocked = false
                        hand = hand.filter(a => a.id !== card.id)
                        animateCardWithMovement(card, playedCardPosition)

                        break
                    }
                }
            }

            props.serverResponseCallback.current = serverResponseHandler

            const drawBackground = () => {
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

            const drawHand = () => {
                for (const card of hand) {
                    if (card.hover && !card.followMouse) {
                        animateCard(card, {x: card.x, y: card.handY - 10})
                    } else {
                        animateCard(card, {x: card.handX, y: card.handY})
                    }
                }
            }

            const drawCard = (card) => {
                ctx.fillStyle = card.played ? "brown" : card.hover ? "pink" : card.color
                roundedRect(ctx, card.x, card.y, card.width, card.height, card.radius)
                ctx.font = "30px Comic Sans MS";
                ctx.fillStyle = card.color === "black" ? "white" : "black";
                ctx.textAlign = "center";
                ctx.fillText(card.value, card.x + card.width / 2, card.y + card.height / 2);

            }

            const drawPlayedCard = () => {
                if (props.move !== undefined && props.move.type === "MOVE") {
                    const c = props.move.card
                    playedCard = new Card(playedCardPosition.x, playedCardPosition.y, c.color, c.value, c.type, c.string, c.id, 0)
                    props.callBack()
                }
                drawCard(playedCard)

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
                drawBackground()
                drawPlayedCard()
                drawHand()
            }

            const define = (card) => {
                roundedRect(ctx, card.x, card.y, card.width, card.height, card.radius)
            }

            const mouseDownHandler = event => {
                if (stateLocked) return
                for (const card of hand) {
                    if (card.hover) {
                        card.setFollowMouse(true)
                        break
                    }
                }
            }

            const mouseUpHandler = event => {
                if (stateLocked) return
                for (const card of hand) {
                    if (card.followMouse) {
                        card.followMouse = false
                        if (card.y < 400) {
                            stateLocked = true
                            card.played = true
                            props.onSendGameState({
                                card: card,
                                playerId: playerId,
                                sessionId: localStorage.getItem("sessionId")
                            })
                        }
                    }
                }
            }

            const mouseMoveHandler = event => {
                if (stateLocked) return
                const mouseX = parseInt(event.clientX);
                const mouseY = parseInt(event.clientY);
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
        }, [playerId, props, props.move]
    )

    return <canvas ref={canvasRef} {...props} width={1400} height={800}/>
};

export default GameCanvas;