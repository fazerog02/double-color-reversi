import React , { useState, useEffect } from "react";

import './Game.css';
import Field from "./Field";
import AvatarSelect from "./AvatarSelect";


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

const createEmptyField = (field_size) => {
    return JSON.parse(JSON.stringify(Array(field_size).fill(Array(field_size).fill({
        color: null,
        value: 0
    }))));
};

const createInitField = (field_size, player_colors) => {
    let field = createEmptyField(field_size);
    const base_position = {row: field_size / 2 - 2, col: field_size / 2 - 2};

    field[base_position.row][base_position.col] = {color: player_colors[0], value: 1};
    field[base_position.row][base_position.col + 1] = {color: player_colors[1], value: 1};
    field[base_position.row][base_position.col + 2] = {color: player_colors[2], value: 1};
    field[base_position.row][base_position.col + 3] = {color: player_colors[3], value: 1};

    field[base_position.row + 1][base_position.col] = {color: player_colors[1], value: 1};
    field[base_position.row + 1][base_position.col + 1] = {color: player_colors[0], value: 1};
    field[base_position.row + 1][base_position.col + 2] = {color: player_colors[3], value: 1};
    field[base_position.row + 1][base_position.col + 3] = {color: player_colors[2], value: 1};

    field[base_position.row + 2][base_position.col] = {color: player_colors[2], value: 1};
    field[base_position.row + 2][base_position.col + 1] = {color: player_colors[3], value: 1};
    field[base_position.row + 2][base_position.col + 2] = {color: player_colors[0], value: 1};
    field[base_position.row + 2][base_position.col + 3] = {color: player_colors[1], value: 1};

    field[base_position.row + 3][base_position.col] = {color: player_colors[3], value: 1};
    field[base_position.row + 3][base_position.col + 1] = {color: player_colors[2], value: 1};
    field[base_position.row + 3][base_position.col + 2] = {color: player_colors[1], value: 1};
    field[base_position.row + 3][base_position.col + 3] = {color: player_colors[0], value: 1};

    return field;
};


export default function Game() {
    const [isGameStart, setIsGameStart] = useState(false);
    const [isGameEnd, setIsGameEnd] = useState(false);

    const [fieldSize, setFieldSize] = useState(10);
    const [playerNames, setPlayerNames] = useState(["player1", "player2"]);  // p1とp2の名前をランダムで入れ替えれば先行のランダム性が確保できる
    const [playerColors, setPlayerColors] = useState(["black", "red", "blue", "green"]);  // [p1, p2, p1, p2]

    const [turn, setTurn] = useState(0);
    const [fieldData, setFieldData] = useState(null);
    const [points, setPoints] = useState([0, 0]);
    const [settablePositions, setSettablePositions] = useState([]);


    const setPlayerColor = (color, index) => {
        let player_colors = JSON.parse(JSON.stringify(playerColors));
        player_colors[index] = color;
        setPlayerColors(player_colors);
    };

    const onChangePlayerName = (e) => {
        switch(e.target.name){
            case "player0":
                setPlayerNames([e.target.value, playerNames[1]]);
                break;
            case "player1":
                const field_size = parseInt(e.target.value);
                if(playerNames[0] === "size" && !isNaN(field_size)){
                    // 隠しコマンド(size, num)で4以上100以下の値に盤面の大きさを変えられる
                    if(field_size >= 4 && field_size <= 100) setFieldSize(field_size);
                }
                setPlayerNames([playerNames[0], e.target.value]);
                break;
        }
    };

    const checkGameEnd = () => {
        for(let row = 0; row < fieldData.length; row++){
            for(let col = 0; col < fieldData[row].length; col++){
                if(fieldData[row][col].color === null) return false;
            }
        }
        return true;
    };

    const getPoints = () => {
        let result = [0, 0];
        for(let row = 0; row < fieldData.length; row++){
            for(let col = 0; col < fieldData[row].length; col++){
                for(let k = 0; k < playerColors.length; k++){
                    if(fieldData[row][col].color === playerColors[k]){
                        result[k % 2] += fieldData[row][col].value ** 2;
                        break;
                    }
                }
            }
        }
        return result;
    }

    const getSettablePositions = (color) => {
        let settable_positions = [];
        for(let row = 0; row < fieldSize; row++){
            for(let col = 0; col < fieldSize; col++){
                let position = {row: row, col: col};
                if(fieldData[position.row][position.col].color === null){
                    if(getReversiblePositions(position, color) != false) settable_positions.push(position);
                }
            }
        }
        return settable_positions;
    }

    const changeStoneColor = (field_data, position, color) => {
        let new_field_data = field_data.slice();
        let stone_data = new_field_data[position.row][position.col];
        stone_data.color = color;
        new_field_data[position.row][position.col] = stone_data;
        return new_field_data;
    };

    const addStoneValue = (field_data, position, num) => {
        let new_field_data = field_data.slice();
        let stone_data = new_field_data[position.row][position.col];
        stone_data.value = stone_data.value + num;
        new_field_data[position.row][position.col] = stone_data;
        return new_field_data;
    };

    const reverseStones = (field_data, positions, color) => {
        let new_field_data = field_data.slice();

        positions.forEach((position) => {
            if(new_field_data[position.row][position.col].color === color) return;
            if(new_field_data[position.row][position.col].color === null){
                new_field_data = changeStoneColor(new_field_data, position, color);
                new_field_data = addStoneValue(new_field_data, position, 1);
                return new_field_data;
            }

            let color_index = null;
            for(let i = 0; i < playerColors.length; i++){
                if(new_field_data[position.row][position.col].color === playerColors[i]) color_index = i;
            }
            if(color_index === null) return;

            if(turn % 2 === color_index % 2){
                // 自分の他の色のとき
                new_field_data = changeStoneColor(new_field_data, position, color);
                new_field_data = addStoneValue(new_field_data, position, 1);
            }else{
                if(new_field_data[position.row][position.col].value >= 2){
                    new_field_data = addStoneValue(new_field_data, position, -1);
                }else{
                    new_field_data = changeStoneColor(new_field_data, position, color);
                }
            }
        });

        return new_field_data;
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


    const startGame = () => {
        setFieldData(createInitField(fieldSize, playerColors));
        setPlayerNames(shuffle(playerNames));
        setIsGameStart(true);
    };

    const setStone = (position) => {
        if(fieldData[position.row][position.col].color !== null) return;

        const reversible_positions = getReversiblePositions(position, playerColors[turn % 4]);
        if(reversible_positions == false) return;

        let new_field_data = fieldData.slice();
        new_field_data = reverseStones(new_field_data, reversible_positions, playerColors[turn % 4]);
        setFieldData(new_field_data);

        startNextTurn();
    };

    useEffect(() => {
        if(fieldData === null) return;

        setPoints(getPoints());

        let settable_positions = getSettablePositions(playerColors[turn % 4]);
        if(settable_positions == false){
            console.log("pass");
            settable_positions = getSettablePositions(playerColors[(turn + 1) % 4]);
            setSettablePositions(settable_positions);
            startNextTurn();
        }else{
            setSettablePositions(settable_positions);
        }
    }, [fieldData]);

    const startNextTurn = () => {
        if(checkGameEnd()){
            endGame();
            return;
        }

        if(setSettablePositions == false){
            console.log("pass");
            startNextTurn();
            return;
        }

        setTurn(turn + 1);
    };

    const endGame = () => {
        setIsGameEnd(true);
    };

    return(
        <div>
            {!isGameStart ?
                <div>
                    <div>
                        <input name="player0" type="text" value={playerNames[0]} onChange={(e) => onChangePlayerName(e)} />
                        <p>色1</p>
                        <AvatarSelect setState={(avatar) => {
                            if(!playerColors.includes(avatar)) setPlayerColor(avatar, 0);
                        }} />
                        <p>色2</p>
                        <AvatarSelect setState={(avatar) => {
                            if(!playerColors.includes(avatar)) setPlayerColor(avatar, 2);
                        }} />
                    </div>
                    <div>
                        <input name="player1" type="text" value={playerNames[1]} onChange={(e) => onChangePlayerName(e)} />
                        <p>色1</p>
                        <AvatarSelect setState={(avatar) => {
                            if(!playerColors.includes(avatar)) setPlayerColor(avatar, 1);
                        }} />
                        <p>色2</p>
                        <AvatarSelect setState={(avatar) => {
                            if(!playerColors.includes(avatar)) setPlayerColor(avatar, 3);
                        }} />
                    </div>
                    <button type="button" onClick={() => startGame()}>start</button>
                </div>
            :
                <div>
                    <div>
                        <div>
                            <span>{playerNames[0]}: <span style={{color: playerColors[0]}}>{playerColors[0]}</span>, <span style={{color: playerColors[2]}}>{playerColors[2]}</span>　</span>
                            <span>{playerNames[1]}: <span style={{color: playerColors[1]}}>{playerColors[1]}</span>, <span style={{color: playerColors[3]}}>{playerColors[3]}</span></span>
                        </div>
                        <span>turn: <span style={{color: playerColors[turn % 4]}}>{playerColors[turn % 4]}</span>　</span>
                        <span>{playerNames[0]}: {points[0]}　</span>
                        <span>{playerNames[1]}: {points[1]}</span>
                        {/*<div><button type="button" onClick={() => endTurn()}>pass</button></div>*/}
                        <Field data={fieldData} size={fieldSize} setStone={isGameEnd ? () => {} : setStone} settablePositions={settablePositions} />
                    </div>
                    <div className="fadeTrans fullScreen" style={{visibility: isGameEnd ? "visible" : "hidden", opacity: isGameEnd ? 1 : 0}}>
                        end
                    </div>
                </div>
            }
        </div>
    );
}
