let maxWidth, maxHeight, svg, initialX, initialY;

const getSvgViewBox = () => {
  return svg.getAttribute('viewBox').split(' ').map(value => +value);
};

const getPointFromEvent = (event) => {
  const point = {};

  if (event.targetTouches) {
    point.x = event.targetTouches[0].clientX;
    point.y = event.targetTouches[0].clientY;
  } else {
    point.x = event.clientX;
    point.y = event.clientY;
  }

  return point;
};

const handlePan = (e) => {
  const [x, y, width, height] = getSvgViewBox();
  const viewBox = { x, y, width, height };

  const pointerOrigin = {};
  const pointerPosition = getPointFromEvent(e);

  pointerOrigin.x = pointerPosition.x;
  pointerOrigin.y = pointerPosition.y;

  const newViewBox = { x: 0, y: 0 };

  svg.onpointermove = (event) => {
    event.preventDefault();
    svg.style.cursor = 'grabbing';

    const pointerPosition = getPointFromEvent(event);
    newViewBox.x = viewBox.x - (pointerPosition.x - pointerOrigin.x);
    newViewBox.y = viewBox.y - (pointerPosition.y - pointerOrigin.y);

    const viewBoxString = `${newViewBox.x} ${newViewBox.y} ${viewBox.width} ${viewBox.height}`;
    svg.setAttribute('viewBox', viewBoxString);
  };
};

const getDelta = (length, percentage) => Math.abs(length * percentage / 100);

const zoomIn = () => {
  const [x, y, width, height] = getSvgViewBox();

  if (width < maxWidth * 0.1 && height < maxHeight * 0.1) {
    return;
  }

  const zoomPercentage = 10;
  const deltaX = getDelta(width, zoomPercentage);
  const deltaY = getDelta(height, zoomPercentage);

  const newWidth = width - deltaX;
  const newHeight = height - deltaY;

  const newX = x + (deltaX / 2);
  const newY = y + (deltaY / 2);

  const viewBox = [newX, newY, newWidth, newHeight];

  svg.setAttribute('viewBox', viewBox.join(' '));
};

const zoomOut = () => {
  const [x, y, width, height] = getSvgViewBox();

  if (width >= maxWidth && height >= maxHeight) {
    return;
  }

  const zoomPercentage = 10;
  const deltaX = getDelta(width, zoomPercentage);
  const deltaY = getDelta(height, zoomPercentage);

  const newWidth = width + deltaX;
  const newHeight = height + deltaY;

  let newX = x - (deltaX / 2);
  let newY = y - (deltaY / 2);

  newX = newX <= 0 ? 0 : newX;
  newY = newY <= 0 ? 0 : newY;

  const viewBox = [newX, newY, newWidth, newHeight];

  svg.setAttribute('viewBox', viewBox.join(' '));
};

const handleZoom = (e) => {
  if (e.deltaY < 0) {
    zoomOut();
  }
  if (e.deltaY > 0) {
    zoomIn();
  }
};

const removePointerUpEvent = (e) => {
  svg.onpointermove = null;
  svg.style.cursor = 'grab';
};

const resetZoom = () => {
  const viewBox = [initialX, initialY, maxWidth, maxHeight];
  svg.setAttribute('viewBox', viewBox.join(' '));
};

const loadSvgEvents = () => {
  svg = document.querySelector('svg');
  [initialX, initialY, maxWidth, maxHeight] = getSvgViewBox();

  svg.addEventListener('wheel', handleZoom);
  svg.addEventListener('pointerdown', handlePan);
  svg.addEventListener('pointerup', removePointerUpEvent);

  query('#zoom-in').addEventListener('click', zoomIn);
  query('#zoom-out').addEventListener('click', zoomOut);
  query('#zoom-reset').addEventListener('click', resetZoom);
};
