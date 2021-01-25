import React, { useMemo } from "react";
import Stone from "./Stone";

import "./Game.css";


export default function Field(props){
    const createStone = (row, col, stone) => {
        return <Stone
            key={row.toString() + col.toString()}
            color={stone.color}
            value={stone.value}
            onClick={() => props.changeColor(row, col, "black")}
        />;
    };

    const initFieldLine = (row) => {
        let stone_line = [];
        for(let col = 0; col < props.size; col++){
            const stone = createStone(row, col, props.data[row][col]);
            stone_line.push(stone);
        }
        return <div key={row.toString()} className="fieldLine">{stone_line}</div>;
    };

    const initFiled = () => {
        let stone_field = [];
        for(let row = 0; row < props.size; row++){
            stone_field.push(initFieldLine(row));
        }
        return <div>{stone_field}</div>;
    };

    const field_stones = useMemo(() => initFiled(), [props.data]);

    return(
        <div>{field_stones}</div>
    );
}
