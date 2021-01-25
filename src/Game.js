import React , { useState, useEffect } from "react";

import './Game.css';
import Field from "./Field";


export default function Game() {
    const shuffle = (ary) => {
        ary = ary.slice();
        for(let i = ary.length - 1; i > 0; i--){
            let r = Math.floor(Math.random() * (i + 1));
            let tmp = ary[i];
            ary[i] = ary[r];
            ary[r] = tmp;
        }
        return ary;
    }

    const createEmptyField = () => {
        return JSON.parse(JSON.stringify(Array(fieldSize).fill(Array(fieldSize).fill({
            color: null,
            value: 0
        }))));
    }

    const [turn, setTurn] = useState(0);
    const [playerNames, setPlayerNames] = useState(shuffle(["player1", "player2"]));  // p1とp2の名前をランダムで入れ替えれば先行のランダム性が確保できる
    const [playerColors, setPlayerColors] = useState(["black", "red", "blue", "green"]);  // [p1, p2, p1, p2]
    const [fieldSize, setFieldSize] = useState(10);
    const [fieldData, setFieldData] = useState(createEmptyField());

    const startGame = () => {
        setFieldData(createEmptyField());
        setPlayerNames(shuffle(playerNames));
        console.log(playerNames);
    }

    const changeStoneColor = (row, col, color) => {
        let field_data = fieldData.slice();
        let stone_data = field_data[row][col];
        stone_data.color = color;
        field_data[row][col] = stone_data;
        setFieldData(field_data);
    };

    const addStoneValue = (row, col, num) => {
        let field_data = fieldData.slice();
        let stone_data = field_data[row][col];
        stone_data.value = stone_data.value + num;
        setFieldData(field_data);
    };

    const endTurn = () => {
        setTurn(turn + 1);
    };

    const setStone = (row, col) => {
        changeStoneColor(row, col, playerColors[turn % 4]);
        endTurn();
    };

    return (
        <div>
            <Field data={fieldData} size={fieldSize} setStone={setStone} />
        </div>
    );
}
