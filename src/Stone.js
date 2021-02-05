import React from "react";

import "./Game.css";
import StoneElement from "./StoneElement";


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
        return <StoneElement color={props.color} value={added_value} />
    }
    const stone_element = createStoneElement();

    return(
        <div
            style={{
                width: props.size,
                height: "100%",
                backgroundColor: props.isSettable ? "#ffa399" : "transparent"
            }}
            className="stoneFrame"
            onClick={() => props.onClick()}>
            {stone_element}
        </div>
    );
}
