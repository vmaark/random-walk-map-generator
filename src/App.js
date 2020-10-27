import * as React from "react";
import { useState } from "react";

import "./styles.css";

const App = () => {
  const [dimensions, setDimensions] = useState(20);
  const [maxTunnels, setMaxTunnels] = useState(50);
  const [maxLength, setMaxLength] = useState(8);

  const grid = createMap(dimensions, maxTunnels, maxLength);

  return (
    <div>
      <div className="form-group row">
        <div className="left col-4">
          <label>dimensions</label>
          <input
            className="form-control"
            name="dimensions"
            type="text"
            maxLength="2"
            value={dimensions}
            onChange={(e) => setDimensions(validator(e.target.value))}
          />
        </div>
        <div className="center col-4">
          <label>maxTunnels</label>
          <input
            className="form-control"
            name="maxTunnels"
            type="text"
            maxLength="3"
            value={maxTunnels}
            onChange={(e) => setMaxTunnels(validator(e.target.value))}
          />
        </div>
        <div className="right col-4">
          <label>maxLength</label>
          <input
            className="form-control"
            name="maxLength"
            type="text"
            maxLength="3"
            value={maxLength}
            onChange={(e) => setMaxLength(validator(e.target.value))}
          />
        </div>
      </div>
      <table className="grid">
        <thead>
          {grid.map((obj, row) => (
            <tr key={row}>
              {obj.map((obj2, col) => (
                <td className={obj2 === 1 ? "wall" : "tunnel"} key={col}>
                  {" "}
                </td>
              ))}
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
};

//lets create a randomly generated map for our dungeon crawler
const createMap = (_dimensions, _maxTunnels, _maxLength) => {
  const dimensions = _dimensions; // width and height of the map
  let maxTunnels = _maxTunnels; // max number of tunnels possible
  const maxLength = _maxLength; // max length each tunnel can have
  const map = createArray(1, dimensions); // create a 2d array full of 1's
  let currentRow = Math.floor(Math.random() * dimensions); // our current row - start at a random spot
  let currentColumn = Math.floor(Math.random() * dimensions); // our current column - start at a random spot
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ]; // array to get a random direction from (left,right,up,down)
  let lastDirection = []; // save the last direction we went
  let randomDirection; // next turn/direction - holds a value from directions

  // lets create some tunnels - while maxTunnels, dimentions, and maxLength  is greater than 0.
  while (maxTunnels && dimensions && maxLength) {
    // lets get a random direction - until it is a perpendicular to our lastDirection
    // if the last direction = left or right,
    // then our new direction has to be up or down,
    // and vice versa
    do {
      randomDirection =
        directions[Math.floor(Math.random() * directions.length)];
    } while (
      (randomDirection[0] === -lastDirection[0] &&
        randomDirection[1] === -lastDirection[1]) ||
      (randomDirection[0] === lastDirection[0] &&
        randomDirection[1] === lastDirection[1])
    );

    var randomLength = Math.ceil(Math.random() * maxLength), //length the next tunnel will be (max of maxLength)
      tunnelLength = 0; //current length of tunnel being created

    // lets loop until our tunnel is long enough or until we hit an edge
    while (tunnelLength < randomLength) {
      //break the loop if it is going out of the map
      if (
        (currentRow === 0 && randomDirection[0] === -1) ||
        (currentColumn === 0 && randomDirection[1] === -1) ||
        (currentRow === dimensions - 1 && randomDirection[0] === 1) ||
        (currentColumn === dimensions - 1 && randomDirection[1] === 1)
      ) {
        break;
      } else {
        map[currentRow][currentColumn] = 0; //set the value of the index in map to 0 (a tunnel, making it one longer)
        currentRow += randomDirection[0]; //add the value from randomDirection to row and col (-1, 0, or 1) to update our location
        currentColumn += randomDirection[1];
        tunnelLength++; //the tunnel is now one longer, so lets increment that variable
      }
    }

    if (tunnelLength) {
      // update our variables unless our last loop broke before we made any part of a tunnel
      lastDirection = randomDirection; //set lastDirection, so we can remember what way we went
      maxTunnels--; // we created a whole tunnel so lets decrement how many we have left to create
    }
  }
  return map; // all our tunnels have been created and our map is complete, so lets return it to our render()
};

const createArray = (num, dimensions) => {
  return Array.from(Array(dimensions), (_) => Array(dimensions).fill(num));
};

const validator = (x) => {
  let input = Number(x);
  if (isNaN(input)) {
    return 0;
  }
  return input;
};

export default App;
