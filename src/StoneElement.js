import React from "react";


export default function StoneElement(props){
    return(
        <div className={`stoneElement ${props.className}`} style={{background: props.color}}>{props.value}</div>
    )
}
