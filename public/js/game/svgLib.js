const defaultStroke = '#000000';
const W3STD = 'http://www.w3.org/2000/svg';

const removeAllHighlight = () => {
  const ellipses = queryAll('#layer6 ellipse');

  ellipses.forEach(ellipse => {
    ellipse.style.stroke = defaultStroke;
    ellipse.style.filter = 'drop-shadow(0px 0px 0px)';
    ellipse.style.fill = 'white';
  });
};

const highlightSelectedPoint = (selectedStop, validStops) => {
  validStops.forEach(stop => {
    const selectedElement = byId(stop);
    const ellipse = selectedElement.querySelector('ellipse');
    ellipse.style.fill = selectedStop === stop ? '#c55e5e' : 'white';
  });
};

const removeEvent = () => {
  const ellipses = queryAll('#layer6 ellipse');

  ellipses.forEach(ellipse => {
    ellipse.onclick = null;
    const stop = ellipse.parentElement;
    stop.style.cursor = 'default';
  })
};

const highlightPoint = (stopNo) => {
  const stop = byId(stopNo);
  const ellipse = stop.querySelector('ellipse');
  ellipse.style.stroke = 'red';
  ellipse.style.filter = 'drop-shadow(0px 0px 4px)';
  stop.style.cursor = 'pointer';
};

const highlightPoints = (stopNo) => {
  removeAllHighlight();
  const station = coord[stopNo];
  const possibleStations = Object.values(station).flat();
  possibleStations.forEach(highlightPoint);
};

const selectStop = (point) => {
  const pin = byId('pin');
  const boxSize = point.getBBox();
  const { x, y } = boxSize;
  const ry = point.querySelector('ellipse').getAttribute('ry');
  highlightPoints(point.id);
  pin.setAttribute('x', x);
  pin.setAttribute('y', y - ry * 2);
};

const createPin = (color) => {
  const pinVector = 'M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z';

  const gElement = document.createElementNS(W3STD, 'g');
  const pin = document.createElementNS(W3STD, 'path');
  pin.setAttribute('transform', 'scale(1.5)');
  pin.setAttribute('fill', color);
  pin.setAttribute('id', color);
  pin.setAttribute('d', pinVector);
  gElement.appendChild(pin);
  return gElement;
};

const placePin = (stationNumber, pin) => {
  const station = byId(stationNumber);
  const ellipse = station.querySelector('ellipse');

  const boxSize = station.getBBox();
  const { x, y } = boxSize;
  const ry = ellipse.getAttribute('ry');

  pin.setAttribute('transform', `translate(${x},${y - ry * 2})`);
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

const updatePins = (gameState) => {
  const locations = gameState.getLocations();
  locations.forEach(({ currentPosition, color }) => {
    if (currentPosition === null) {
      return;
    }
    removePin(color);
    putPinInMap(currentPosition, color);
  });
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