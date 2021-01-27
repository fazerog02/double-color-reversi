import React from "react";


export default function AvatarSelect(props){
    const onChangeColor = (e) => {
        props.setState(e.target.value);
        console.log(e.target.value);
    };

    const onChangeImage = (e) => {
        const image = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            props.setState(`url(${reader.result})`);
            console.log(`url(${reader.result})`);
        });
        reader.readAsDataURL(image);
    };

    return(
        <div>
            <input type="color" onChange={(e) => onChangeColor(e)} />
            <input type="file" accept="image/*" onChange={(e) => onChangeImage(e)} />
        </div>
    );
}
