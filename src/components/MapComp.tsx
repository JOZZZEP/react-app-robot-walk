import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";

function MapComp() {
  const commandRef = useRef<HTMLInputElement>();
  const gridSize = 9;
  const turnPattern: [number, number][] = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ];

  const createGrid = () => {
    return Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  };

  const middleIndex = Math.floor(gridSize / 2);
  const initGrid = createGrid();
  initGrid[middleIndex][middleIndex] = 2;

  const [grid, setGrid] = useState<number[][]>(initGrid);

  const walk = () => {
    if (!commandRef.current?.value) {
      setGrid(initGrid);
      return;
    }

    let turn = 0;
    let current: [number, number] = [middleIndex, middleIndex];
    const initialPath: [number, number][] = [[middleIndex, middleIndex]];

    let path = [...initialPath];

    for (let com of commandRef.current?.value) {
      if (com === "L") {
        turn = (turn + 1) % 4;
      } else if (com === "R") {
        turn = (turn - 1 + 4) % 4;
      } else if (com === "W") {
        const move: [number, number] = [
          current[0] + turnPattern[turn][0],
          current[1] + turnPattern[turn][1],
        ];
        path.push(move);
        current = move;
      }
    }

    const newGrid = createGrid();
    path.forEach(([x, y]) => {
      newGrid[x][y] = 1;
    });

    const [startX, startY] = path[0];
    const [endX, endY] = path[path.length - 1];

    newGrid[startX][startY] = 2;
    newGrid[endX][endY] = 3;

    setGrid(newGrid);
  };

  return (
    <>
      <Box pb={2} display={"flex"} justifyContent={"space-evenly"}>
        <TextField inputRef={commandRef}></TextField>
        <Button variant="contained" onClick={walk}>
          Walk
        </Button>
      </Box>
      <div>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((cell, cellIndex) => {
              return (
                <div
                  key={cellIndex}
                  style={{
                    width: "60px",
                    height: "60px",
                    border: "1px solid lightgray",
                    backgroundColor:
                      cell === 1
                        ? "gray"
                        : cell === 2
                        ? "green"
                        : cell === 3
                        ? "red"
                        : "white",
                  }}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default MapComp;
