import React from "react";

import "./Game.css";


export default function Stone(props){
    const blackOrWhite  = (hexcolor) => {
        if(hexcolor[0] !== "#") return "white";

        const r = parseInt( hexcolor.substr( 1, 2 ), 16 ) ;
        const g = parseInt( hexcolor.substr( 3, 2 ), 16 ) ;
        const b = parseInt( hexcolor.substr( 5, 2 ), 16 ) ;

        return ( ( ( (r * 299) + (g * 587) + (b * 114) ) / 1000 ) < 128 ) ? "white" : "black" ;
    }

    const createStoneElement = () => {
        if(props.color === null) return null;
        const added_value = props.value <= 1 ? null : <span style={{color: blackOrWhite(props.color)}}>{"+" + (props.value - 1).toString()}</span>;
        return <div className="stoneElement" style={{background: props.color}}>{added_value}</div>
    }
    const stone_element = createStoneElement();

    return(
        <div style={{width: props.size, height: props.size, border: "1px solid black"}} onClick={() => props.onClick()}>{stone_element}</div>
    );
}
