import classes from "./ColorPicker.module.css";
import Button from "../../UI/Button";
import React from "react";

const ColorPicker = (props) => {
    const colors = ["BLUE","RED","GREEN","YELLOW"]
    const onClickHandler = event => {
        props.setChosenColor({color:event.target.value, card:null});
    }
    return (
        <div className={classes.modal}>
            <p>Choose a color:</p>
            {colors.map(color => <Button style={{backgroundColor: color}} value={color} onClick={onClickHandler}></Button>)}
            <Button value={"CANCEL"} onClick={onClickHandler}>X</Button>
        </div>
    );
}

export default ColorPicker;