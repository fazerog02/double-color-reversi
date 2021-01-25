import React , { useState } from "react";

import './Game.css';
import Field from "./Field";


const shuffle = (ary) => {
    ary = ary.slice();
    for(let i = ary.length - 1; i > 0; i--){
        let r = Math.floor(Math.random() * (i + 1));
        let tmp = ary[i];
        ary[i] = ary[r];
        ary[r] = tmp;
    }
    return ary;
};


export default function Game() {
    const onChangePlayerName = (e) => {
        switch(e.target.name){
            case "player0":
                setPlayerNames([e.target.value, playerNames[1]]);
                break;
            case "player1":
                setPlayerNames([playerNames[0], e.target.value]);
                break;
        }
    };

    const createEmptyField = () => {
        return JSON.parse(JSON.stringify(Array(fieldSize).fill(Array(fieldSize).fill({
            color: null,
            value: 0
        }))));
    };

    const createInitField = () => {
        let field = createEmptyField();
        const base_position = {row: fieldSize / 2 - 2, col: fieldSize / 2 - 2};
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                field[base_position.row + i][base_position.col + j] = {color: playerColors[(i + j) % 4], value: 1};
            }
        }
        return field;
    };

    const [isGameStart, setIsGameStart] = useState(false);
    const [isGameEnd, setIsGameEnd] = useState(false);
    const [turn, setTurn] = useState(0);
    const [playerNames, setPlayerNames] = useState(["player1", "player2"]);  // p1とp2の名前をランダムで入れ替えれば先行のランダム性が確保できる
    const [playerColors, setPlayerColors] = useState(["black", "red", "blue", "green"]);  // [p1, p2, p1, p2]
    const [fieldSize, setFieldSize] = useState(10);
    const [fieldData, setFieldData] = useState(null);

    const startGame = () => {
        setFieldData(createInitField());

        setPlayerNames(shuffle(playerNames));
        setIsGameStart(true);
    };

    const checkGameEnd = () => {
        for(let row = 0; row < fieldData.length; row++){
            for(let col = 0; col < fieldData[row].length; col++){
                if(fieldData[row][col].color === null) return false;
            }
        }
        return true;
    };

    const endTurn = () => {
        console.log(playerColors[(turn + 1) % 4])
        if(checkGameEnd()){
            setIsGameEnd(true);
            return;
        }
        setTurn(turn + 1);
    };

    const changeStoneColor = (position, color) => {
        let field_data = fieldData.slice();
        let stone_data = field_data[position.row][position.col];
        stone_data.color = color;
        field_data[position.row][position.col] = stone_data;
        setFieldData(field_data);
    };

    const addStoneValue = (position, num) => {
        let field_data = fieldData.slice();
        let stone_data = field_data[position.row][position.col];
        stone_data.value = stone_data.value + num;
        field_data[position.row][position.col] = stone_data;
        setFieldData(field_data);
    };

    const reverseStone = (position, color) => {
        if(fieldData[position.row][position.col].color === color) return;
        if(fieldData[position.row][position.col].color === null){
            changeStoneColor(position, color);
            addStoneValue(position, 1);
            return;
        }

        let color_index = null;
        for(let i = 0; i < playerColors.length; i++){
            if(fieldData[position.row][position.col].color === playerColors[i]) color_index = i;
        }
        if(color_index === null) return;

        if(turn % 2 === color_index % 2){
            // 自分の他の色のとき
            changeStoneColor(position, color);
            addStoneValue(position, 1);
        }else{
            if(fieldData[position.row][position.col].value >= 2){
                addStoneValue(position, -1);
            }else{
                changeStoneColor(position, color);
            }
        }
    };

    const getReversiblePositions = (position, color) => {
        const directions = [
            [1, 0], [0, 1], [1, 1], [-1, 1]
        ];

        let reversible_positions = [JSON.parse(JSON.stringify(position))];
        for(let i = 0; i < directions.length; i++){
            for(let ope = -1; ope <= 1; ope += 2){
                let now_position = JSON.parse(JSON.stringify(position));
                let tmp_reversible_positions = [];
                let is_detected = false;

                now_position.row += ope * directions[i][0];
                now_position.col += ope * directions[i][1];
                while(now_position.row >= 0 && now_position.row < fieldSize && now_position.col >= 0 && now_position.col < fieldSize){
                    if(fieldData[now_position.row][now_position.col].color === null) break;
                    if(fieldData[now_position.row][now_position.col].color === color){
                        is_detected = true;
                        break;
                    }

                    tmp_reversible_positions.push(JSON.parse(JSON.stringify(now_position)));
                    now_position.row += ope * directions[i][0];
                    now_position.col += ope * directions[i][1];
                }
                if(is_detected) reversible_positions = reversible_positions.concat(tmp_reversible_positions);
            }
        }
        if(reversible_positions.length <= 1) reversible_positions = [];
        return reversible_positions;
    };

    const setStone = (position) => {
        let now_color = playerColors[turn % 4];

        const reversible_positions = getReversiblePositions(position, now_color);
        console.log(reversible_positions);
        if(reversible_positions == false) return;

        for(let i = 0; i < reversible_positions.length; i++) reverseStone(reversible_positions[i], now_color);
        endTurn();
    };

    return(
        <div>
            {!isGameStart ?
                <div>
                    <input name="player0" type="text" value={playerNames[0]} onChange={(e) => onChangePlayerName(e)} />
                    <input name="player1" type="text" value={playerNames[1]} onChange={(e) => onChangePlayerName(e)} />
                    <button type="button" onClick={() => startGame()}>start</button>
                </div>
            :
                <Field data={fieldData} size={fieldSize} setStone={isGameEnd ? () => {} : setStone} />
            }
        </div>
    );
}
