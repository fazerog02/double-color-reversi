import React , { useState, useEffect } from "react";

import './Game.css';
import Field from "./Field";


export default function Game() {
    const createEmptyField = () => {
        return JSON.parse(JSON.stringify(Array(fieldSize).fill(Array(fieldSize).fill({
            color: null,
            value: 0
        }))));
    }

    const [turnPlayer, setTurnPlayer] = useState(0);
    const [fieldSize, setFieldSize] = useState(10);
    const [fieldData, setFieldData] = useState(createEmptyField());

    const changeStoneColor = (row, col, color) => {
        console.log(fieldData);
        let field_data = fieldData.slice();
        let stone_data = field_data[row][col];
        stone_data.color = color;
        field_data[row][col] = stone_data;
        setFieldData(field_data);
        console.log(fieldData);
    };

    const addStoneValue = (row, col, num) => {
        let field_data = fieldData.slice();
        let stone_data = field_data[row][col];
        stone_data.value = stone_data.value + num;
        setFieldData(field_data);
    };

    return (
        <div>
            <Field data={fieldData} size={fieldSize} changeColor={changeStoneColor} />
        </div>
    );
}
