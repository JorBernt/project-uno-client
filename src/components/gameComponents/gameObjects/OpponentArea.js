import Card from "./Card";

const OpponentArea = (props) => {
    return (
        <>
            <Card playerNumber={props.playerNumber} move={props.move}></Card>
        </>
    )
};

export default OpponentArea;