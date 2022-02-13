import './App.css';
import React from 'react';
const MAIN_WIDTH = 3;
const MAIN_HEIGHT = 3;
const PATTERN_LENGTH = 4;
const FIRST_ELEM = 1;
const LAST_ELEM = MAIN_WIDTH * MAIN_HEIGHT;
const ELEMS = Array.from({
  length: LAST_ELEM - FIRST_ELEM + 1
}, (x, i) => i + FIRST_ELEM);

/*
1 2 3 
4 5 6
7 8 9
*/

function pToCart(p) {
  p = p - 1;
  const x = p % MAIN_WIDTH;
  const y = Math.floor(p / MAIN_WIDTH);
  const r = {
    x: x,
    y: y
  };
  //console.log(p, r);
  return r;
}

function distance(p1, p2) {
  const p1Cart = pToCart(p1);
  const p2Cart = pToCart(p2);
  //console.log(p1Cart, p2Cart);

  const horizontalDist = Math.abs(p1Cart.y - p2Cart.y);
  const verticalDist = Math.abs(p1Cart.x - p2Cart.x);
  //console.log("x", horizontalDist, verticalDist)
  return Math.max(horizontalDist, verticalDist);
}

var testVar = pToCart(3);
console.assert(testVar.x === 2 && testVar.y === 0);
testVar = pToCart(4);
console.assert(testVar.x === 0 && testVar.y === 1);

console.assert(distance(1, 2) === 1);
console.assert(distance(1, 3) === 2);
console.assert(distance(1, 4) === 1);
console.assert(distance(1, 9) === distance(9, 1));
console.assert(distance(5, 5) === 0);

function traverseThroughMatrix(currentPath, matchingPaths) {
  if (currentPath.length === PATTERN_LENGTH) {
    //console.log("Pattern detected", currentPath);
    return [currentPath];
  } else if (currentPath.length < PATTERN_LENGTH) {
    //console.log("Traversing", currentPath);
    const currentElem = currentPath[currentPath.length - 1];
    return ELEMS.flatMap(elem => {
      //      const isANeighbour = distance(elem, currentElem) === 1;
      const hasNeverBeenVisited = currentPath.filter(el => el === elem).length < 1;
      //console.log("Trying", currentElem, elem, isANeighbour, hasBeenVisitedMaxOnce) ;
      if ( /*isANeighbour && */ hasNeverBeenVisited) {

        return traverseThroughMatrix(currentPath.concat(elem));
      } else {
        return [];
      }
    });
  } else {
    console.error("sth went wrong", currentPath);
  }
}

const allPossibleCombinations = ELEMS.flatMap(startingPoint => traverseThroughMatrix([startingPoint]));
console.log(allPossibleCombinations, allPossibleCombinations.length);

function serializeState(currentCombination) {
  return currentCombination.join("-");
}

function deserializeState(currentStateString) {
  console.log("current state string", currentStateString)
console.log("current state string2", currentStateString.split("-"))
  return currentStateString.split("-").map(v => parseInt(v));
}
function storeState(st) {
  window.location.hash = serializeState(st);
}
var currentState = null;
var currentIndex = 0;
if (window.location.hash) {
  const potentialState = deserializeState(window.location.hash.replace("#", ""));
  console.log("deserialized", currentState)
  currentIndex = allPossibleCombinations.findIndex(pc => potentialState.every(v => pc.includes(v)));
  console.log("curr idx", currentIndex);
} else {
  currentIndex = 0;
  storeState(allPossibleCombinations[currentIndex]);
}
currentState = allPossibleCombinations[currentIndex];

// document.body.onkeyup = function(e) {
//   if (e.keyCode == 32) {
//     //your code
//   }
// };

console.log("current state", currentState)

function Matrix(props) {

  return <div className = "elems" > {
      ELEMS.map((elem, idx) => {
        console.log("idx ", idx)
        return <div className = {`mybtn ${props.currentState.includes(idx+1) ? "active" : " "}` } key={idx}>
          <h1> {
            elem
          } < /h1> </div>

      })
    } 
<p>{props.currentIndex}/{allPossibleCombinations.length}</p>
    </div>
}

class App extends React.Component {
  constructor(props) {
    super(props);
    console.log("setting state to ", currentIndex)
    this.state = {currentIndex: currentIndex}
  }

  updateIndex() {
    const curr = this.state.currentIndex;

    this.setState({currentIndex: curr +1 }, () => {storeState(allPossibleCombinations[this.state.currentIndex])})
  }
  componentDidMount = () => {
    
document.body.onkeyup = (e) => {
  if (e.keyCode == 32) {
    this.updateIndex()
  }
};
  }

  generatePrevious() {

    const previousRangeMin = Math.max(this.state.currentIndex - 4, 0);
    const previousRangeMax = Math.max(this.state.currentIndex - 1, 0);
    return Array.from({length: previousRangeMax - previousRangeMin +1}, (x, i) => previousRangeMin + i).map(v => <p>{allPossibleCombinations[v]}</p>)
  }

  generateNext() {

    const nextRangeMin = Math.max(this.state.currentIndex +1, 0);
    const nextRangeMax = Math.max(this.state.currentIndex + 4, 0);
    return Array.from({length: nextRangeMax - nextRangeMin + 1}, (x, i) => nextRangeMin + i).map(v => <p>{allPossibleCombinations[v]}</p>)
  }
  render() {
    console.log("gett state to ", currentIndex);

    return <div className="rt">
    <Matrix currentState={allPossibleCombinations[this.state.currentIndex]} currentIndex={this.state.currentIndex}/>
    <div className="list">
    {this.state.currentIndex > 0 ? this.generatePrevious() : null}
    <h1>{allPossibleCombinations[this.state.currentIndex]}</h1>
    {this.state.currentIndex > 0 ? this.generateNext() : null}

    </div>


    
    </div>
  }
};



export default App;