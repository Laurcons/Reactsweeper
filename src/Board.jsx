import React from 'react';
import MineCell from './MineCell';
import "./Board.css";
// import util from './util';
import msp from './Minesweeper';

class Board extends React.Component {
    STATE_PLAY = "play";
    STATE_WON = "won";
    STATE_LOST = "lost";

    constructor(props) {
        super(props);
        this.width = props.width;
        this.height = props.height;
        this.bombs = props.bombs;
        this.boardGenerated = false;
        let cells = msp.emptyBoard(this.width, this.height);
        this.state = {
            cells,
            flagCount: 0,
            gameState: this.STATE_PLAY,
        };
    }

    recursiveUncover(cells, x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height)
            return;
        if (!cells[x][y].uncovered)
            cells[x][y].uncovered = true;
        else return;
        if (cells[x][y].content !== " " || cells[x][y].content === "B")
            return;
        this.recursiveUncover(cells, x - 1, y - 1);
        this.recursiveUncover(cells, x, y - 1);
        this.recursiveUncover(cells, x + 1, y - 1);
        this.recursiveUncover(cells, x - 1, y);
        this.recursiveUncover(cells, x + 1, y);
        this.recursiveUncover(cells, x - 1, y + 1);
        this.recursiveUncover(cells, x, y + 1);
        this.recursiveUncover(cells, x + 1, y + 1);
    }

    handleClick(x, y) {
        if (this.state.gameState !== this.STATE_PLAY)
            return;
        let cells = this.state.cells.slice();
        if (cells[x][y].flagged)
            return;
        if (!this.boardGenerated) {
            // check if there are any empty spaces
            let hasEmpty = false;
            hasEmpty = cells.some(row => row.some(cell => cell.content === " "));
            do {
                cells = msp.generateBoard(this.width, this.height, this.bombs);
            } while ((!hasEmpty) ? cells[x][y].content === "B" : cells[x][y].content !== " ");
        }
        this.boardGenerated = true;
        this.recursiveUncover(cells, x, y);
        // you can win or lose from here
        let isWin = msp.checkWin(cells);
        let isLose = msp.checkLose(cells);
        this.setState({
            cells: cells,
            gameState: isWin ? this.STATE_WON : (isLose ? this.STATE_LOST : this.STATE_PLAY),
        });
    }

    handleContextMenu(e, x, y) {
        e.preventDefault();
        if (this.state.gameState !== this.STATE_PLAY)
            return;
        let cells = this.state.cells.slice();
        if (cells[x][y].uncovered)
            return;
        // toggle flagged
        let flagCount = this.state.flagCount;
        cells[x][y].flagged = !cells[x][y].flagged;
        flagCount += cells[x][y].flagged ? 1 : -1;
        // you can only win from here (not lose)
        let isWin = msp.checkWin(cells);
        this.setState({
            cells,
            flagCount,
            gameState: isWin ? this.STATE_WON : this.STATE_PLAY,
        });
    }

    render() {
        let boardthis = this;
        let boardCells = [...Array(boardthis.height).keys()].map(function(y) {
            return (
                <tr key={y}>
                    {[...Array(boardthis.width).keys()].map(function(x) {
                        return (
                            <td key={x + "-" + y}>
                                <MineCell
                                    data={boardthis.state.cells[x][y]}
                                    previewed={boardthis.state.gameState === boardthis.STATE_LOST}
                                    onClick={() => boardthis.handleClick(x, y)}
                                    onContextMenu={(e) => boardthis.handleContextMenu(e, x, y)}
                                />
                            </td>
                        );
                    })}
                </tr>
            ); 
        });
        return (
            <div className="gameContainer">
                <table className="boardTable">
                    <tbody>
                        {boardCells}
                    </tbody>
                </table>
                <div>
                    <h1>Reactsweeper!</h1>
                    <ul>
                        <li>Map size: {this.width}x{this.height}</li>
                        <li>Total bombs: {this.bombs}</li>
                        <li>Bombs left: {this.bombs - this.state.flagCount}</li>
                        {
                            this.state.gameState === this.STATE_LOST ?
                            <li className="red">You lost the game!</li> :
                            this.state.gameState === this.STATE_WON ?
                            <li className="green">You won the game!</li> : ""
                        }
                    </ul>
                    Left Click to uncover, Right Click to flag
                </div>
            </div>
        )
    }
}

export default Board;