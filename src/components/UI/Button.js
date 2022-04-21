import React from "react";

import classes from "./Button.module.css";

const Button = props => {

    const getClasses = name => {
        switch (name) {
            case "joingame": return classes.joingame;
            case "creategame": return classes.creategame;
            default: return "button";
        }
    }

    return (
        <button value={props.value} style={props.style} type={props.type | 'button'} className={getClasses(props.className)} onClick={props.onClick}>{props.children}</button>
    )
};

export default Button;