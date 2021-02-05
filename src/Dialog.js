import React from "react";
import "./Game.css";


export default function Dialog(props) {
    return (
        <div
            style={{visibility: props.visible ? "visible" : "hidden", opacity: props.visible ? 1 : 0}}
        >
            <div className="dialogInner">
                <button className="dialogCloseButton" type="button" onClick={() => props.closeDialog()}>×</button>
                {props.children}
            </div>
            <div className="fullScreen dialogOuter" onClick={() => props.closeDialog()} />
        </div>
    );
}