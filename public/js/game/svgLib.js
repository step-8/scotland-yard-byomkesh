const defaultStroke = '#000000';
const W3STD = 'http://www.w3.org/2000/svg';

const removeAllHighlight = () => {
  const ellipses = queryAll('.selected-stop, .possible-stop');

  ellipses.forEach(ellipse => {
    ellipse.classList.remove('selected-stop');
    ellipse.classList.remove('possible-stop');
  });
};

const removeAllPointer = () => {
  const stops = queryAll('.pointer');

  stops.forEach(stop =>
    stop.classList.remove('pointer')
  );
};

const highlightSelectedPoint = (selectedStop, validStops) => {
  validStops.forEach(stop => {
    const selectedElement = byId(stop);
    const ellipse = selectedElement.querySelector('ellipse');
    if (selectedStop === stop) {
      ellipse.classList.add('selected-stop');
      return;
    }
    ellipse.classList.remove('selected-stop');
  });
};

const removeEvent = () => {
  const ellipses = queryAll('#layer6 ellipse');

  ellipses.forEach(ellipse => {
    ellipse.onclick = null;
    const stop = ellipse.parentElement;
    stop.style.cursor = 'default';
  });
};

const highlightPoint = (stopNo) => {
  const stop = byId(stopNo);
  const ellipse = stop.querySelector('ellipse');
  ellipse.classList.add('possible-stop');
  stop.classList.add('pointer');
};

const highlightPoints = (stopNo) => {
  removeAllHighlight();
  const station = coord[stopNo];
  const possibleStations = Object.values(station).flat();
  possibleStations.forEach(highlightPoint);
};

const createPin = (color) => {
  const pinVector = 'M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z';

  const gElement = document.createElementNS(W3STD, 'g');
  const pin = document.createElementNS(W3STD, 'path');
  // pin.setAttribute('transform', 'scale(3)');
  // pin.setAttribute('transform', 'scale(2)');
  pin.setAttribute('stroke', 'black');
  pin.setAttribute('fill', color);
  pin.setAttribute('d', pinVector);
  gElement.appendChild(pin);
  gElement.setAttribute('id', color);
  return gElement;
};

const placePin = (stationNumber, pin) => {
  const station = byId(stationNumber);
  const ellipse = station.querySelector('ellipse');

  const boxSize = station.getBBox();
  const { x, y } = boxSize;
  const ry = ellipse.getAttribute('ry');

  pin.setAttribute('transform', `translate(${x - 16},${y - ry * 3.7})`);
  // pin.setAttribute('transform', `translate(${x - 5},${y - ry * 2.5})`);
};

const removePin = (color) => {
  const pin = byId(color);
  pin && pin.remove();
};

const putPinInMap = (currentPosition, color) => {
  const newPin = createPin(color);
  placePin(currentPosition, newPin);
  byId('map').appendChild(newPin);
};

const movePinApart = (detectiveColor, mrXColor) => {
  const detectivePin = query(`#${detectiveColor}`);
  const mrXPin = query(`#${mrXColor}`);

  const transform = window.getComputedStyle(detectivePin).transform;
  const matrix = new WebKitCSSMatrix(transform);

  const x = matrix.m41;
  const y = matrix.m42;

  detectivePin.setAttribute('transform', `translate(${x + 15}, ${y})`);
  mrXPin.setAttribute('transform', `translate(${x - 15}, ${y})`);
};

const updateOverlap = (gameState) => {
  const mrX = gameState.mrX;
  const detectives = gameState.getDetectives();

  detectives.forEach(detective => {
    if (detective.currentPosition === mrX.currentPosition) {
      movePinApart(detective.color, mrX.color);
    }
  });
};

const updatePins = (gameState) => {
  const locations = gameState.getLocations();
  locations.forEach(({ currentPosition, color }) => {
    if (currentPosition === null) {
      removePin(color);
      return;
    }
    removePin(color);
    putPinInMap(currentPosition, color);
  });

  updateOverlap(gameState);
};

const highlightStops = (gameState) => {
  const validRoutes = gameState.possibleRoutes;
  const validStops = Object.values(validRoutes).flat();
  validStops.forEach(stopNo => {
    if (byId(stopNo)) {
      highlightPoint(stopNo);
    }
  });
  return gameState;
};
