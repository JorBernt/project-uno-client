import PlayableCard from "./PlayableCard";
import classes from "./PlayerArea.module.css"

const PlayerArea = (props) => {
    const cardPlayedHandler = move => {
        props.onSendGameState({playerId: move.playerId, card: move.card});
    };
    return (
        <div className={classes.area}>
            <PlayableCard onPlayed={cardPlayedHandler} ></PlayableCard>
        </div>
    )
};

export default PlayerArea;