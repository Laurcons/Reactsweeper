import React from 'react';
import './MineCell.css';
import bombSvg from './media/bomb.svg';
import classNames from 'classnames';

// class MineCell extends React.Component {
//     render() {

//     }
// }

function MineCell(props) {

    function getNumberColor(number) {
        switch (number) {
            case "1": return "blue";
            case "2": return "orange";
            case "3": return "green";
            case "4": return "red";
            default: return "red";
        }
    }

    let classes = classNames({
        "mineCell": true,
        "covered": !props.data.uncovered
    });

    return (
        <button className={classes} onClick={props.onClick} onContextMenu={props.onContextMenu}>
            {
                props.data.uncovered ? (
                    (props.data.content === "B") ? (
                        <img src={bombSvg} alt="bomb"/>
                    ) : (props.data.content === " ") ? (
                        " "
                    ) : (
                        <span style={{color: getNumberColor(props.data.content)}}>
                            {props.data.content}
                        </span>
                    )
                ) : (
                    <span>
                        {props.previewed ? (
                            props.data.content === "B" ? (
                                <img src={bombSvg} alt="bomb"/>
                            ) : (props.data.content === " ") ? (
                                " "
                            ) : (
                                <span style={{color: getNumberColor(props.data.content)}}>
                                    {props.data.content}
                                </span>
                            )
                        ) : (props.data.flagged
                        ? "F"
                        : " ")}
                    </span>
                )
            }
        </button>
    )
}

export default MineCell;