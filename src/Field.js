import React from "react";
import Stone from "./Stone";

import "./Game.css";


export default function Field(props){
    const createStone = (position, stone) => {
        return <Stone
            key={position.row.toString() + position.col.toString()}
            size={(80 / props.size).toString() + "vmin"}
            color={stone.color}
            value={stone.value}
            onClick={() => props.setStone(position)}
        />;
    };

    const initFieldLine = (row) => {
        let stone_line = [];
        for(let col = 0; col < props.size; col++){
            const position = {row: row, col: col};
            const stone = createStone(position, props.data[row][col]);
            stone_line.push(stone);
        }
        return <div key={row.toString()} className="fieldLine">{stone_line}</div>;
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
