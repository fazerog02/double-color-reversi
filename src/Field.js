import React from "react";
import Stone from "./Stone";

import "./Game.css";


export default function Field(props){
    const createStone = (position, stone) => {
        let is_settable = false;
        for (let i = 0; i < props.settablePositions.length; i++) {
            if (props.settablePositions[i].row === position.row && props.settablePositions[i].col === position.col) {
                is_settable = true;
                break;
            }
        }

        let on_click;
        if(stone.color === null && is_settable){
            on_click = () => props.setStone(position);
        }else{
            on_click = () => {};
        }

        return <Stone
            key={position.row.toString() + position.col.toString()}
            size={(100 / props.size).toString() + "%"}
            color={stone.color}
            value={stone.value}
            isSettable={is_settable}
            onClick={on_click}
        />;
    };

    const initFieldLine = (row) => {
        let stone_line = [];
        for(let col = 0; col < props.size; col++){
            const position = {row: row, col: col};
            const stone = createStone(position, props.data[row][col]);
            stone_line.push(stone);
        }
        return <div key={row.toString()} className="fieldLine" style={{height: 100 / props.size + "%"}}>{stone_line}</div>;
    };

    const initFiled = () => {
        let stone_field = [];
        for(let row = 0; row < props.size; row++){
            stone_field.push(initFieldLine(row));
        }
        return <div className="field">{stone_field}</div>;
    };

    const field_stones = initFiled();

    return(
        <div className="fieldWrapper">{field_stones}</div>
    );
}
