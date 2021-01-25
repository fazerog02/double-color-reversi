import React from "react";

import "./Game.css";


export default function Stone(props){
    const createStoneElement = () => {
        if(props.color === null) return null;
        const added_value = props.value <= 1 ? null : <span>{"+" + (props.value - 1).toString()}</span>;
        return <div className="stoneElement" style={{backgroundColor: props.color}}>{added_value}</div>
    }
    const stone_element = createStoneElement();

    return(
        <div style={{width: props.size, height: props.size, border: "1px solid black"}} onClick={() => props.onClick()}>{stone_element}</div>
    );
}
