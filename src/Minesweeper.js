import util from './util';

let msp = {
    emptyBoard: function(width, height) {
        let cells = Array(height).fill(0).map((row, y) =>
            Array(width).fill(0).map((col, x) => ({
                content: " ",
                flagged: false,
                uncovered: false,
            }))
        );
        return cells;
    },
    generateBoard: function(width, height, bombs) {
        // generate bomb map
        let bombLookup = Array(width * height).fill(0).map((val, index) => {
            if (index < bombs)
                return true;
            else return false;
        });
        bombLookup = util.shuffle(bombLookup);
        // generate cell arrays with bombs
        let cells = Array(height).fill(0).map((row, y) =>
            Array(width).fill(0).map((col, x) => ({
                content: bombLookup[y * width + x] ? "B" : " ",
                flagged: false,
                uncovered: false,
            }))
        );
        // place numbers on cells
        let newCells = cells.slice();
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (cells[x][y].content !== " ")
                    continue;
                let count = 0;
                let bombVal = "B";
                // top row
                if (x >= 1 && y >= 1) {
                    count += cells[x - 1][y - 1].content === bombVal;
                }
                if (y >= 1) {
                    count += cells[x][y - 1].content === bombVal;
                }
                if (x <= width - 2 && y >= 1) {
                    count += cells[x + 1][y - 1].content === bombVal;
                }
                // middle row
                if (x >= 1) {
                    count += cells[x - 1][y].content === bombVal;
                }
                if (x <= width - 2) {
                    count += cells[x + 1][y].content === bombVal;
                }
                // bottom row
                if (x >= 1 && y <= height - 2) {
                    count += cells[x - 1][y + 1].content === bombVal;
                }
                if (y <= height - 2) {
                    count += cells[x][y + 1].content === bombVal;
                }
                if (x <= width - 2 && y <= height - 2) {
                    count += cells[x + 1][y + 1].content === bombVal;
                }
                if (count !== 0)
                    newCells[x][y].content = count.toString();
            }
        }
        cells = newCells;
        return cells;
    },
    checkWin: function(cells) {
        // are all bombs flagged and all non-bombs uncovered?
        // if yes, it a win
        // if not, it not a win
        return cells.every(function(row) {
            return row.every(function(cell) {
                return (
                    cell.content === "B" ?
                    cell.flagged :
                    cell.uncovered
                );
            });
        });
    },
    checkLose: function(cells) {
        // check if there is a bomb that is uncovered
        return cells.some(function(row) {
            return row.some(function(cell) {
                return (
                    cell.content === "B" &&
                    cell.uncovered
                );
            });
        });
    }
};

export default msp;