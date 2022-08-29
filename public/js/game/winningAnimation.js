const randInt = (x) => {
  return Math.ceil(Math.random() * x);
};

const randIntBtw = (num1, num2) => {
  const diff = num2 - num1;
  const rand = Math.floor(Math.random() * 10000) % diff;
  return rand + num1;
};

const randomColor = () => {
  const colors = ['#07F985', '#FDE802', '#FF901B', '#FC5E01', '#FF00FA', '#3EC70B', '#F806CC', '#37E2D5']
  const rand = randInt(colors.length);
  return colors[rand];
}

const burst = (color, radius) => {
  const burstEle = new mojs.Burst({
    parent: '.winning-popup',
    left: 0, top: 0,
    radius: { 4: radius },
    angle: 45,
    children: {
      shape: 'line',
      radius: 10,
      scale: 1,
      stroke: color,
      strokeDasharray: '100%',
      strokeDashoffset: { '-100%': '100%' },
      duration: 1000,
      easing: 'quad.out',
    }
  });
  burstEle.el.style.zIndex = -1;
  return burstEle;
}

const events = ({ x, y, right, bottom }, radius) => {
  return {
    pageX: randIntBtw(x + radius, right - radius),
    pageY: randIntBtw(y + radius, bottom - radius),
  }
};

const invokeBurst = (event, radius) => {
  burst(randomColor(), radius)
    .tune({ x: event.pageX, y: event.pageY })
    .play();
};

const generateSparks = (index) => {
  const ele = document.querySelector('.winning-popup-body');
  const dimensions = ele.getBoundingClientRect()
  const intervalId = setInterval(() => {
    index++;
    if (index % 2 === 0) {
      invokeBurst(events(dimensions, 10), 19);
      invokeBurst(events(dimensions, 15), 15);
      invokeBurst(events(dimensions, 20), 20);
      invokeBurst(events(dimensions, 25), 25);
    } else {
      invokeBurst(events(dimensions, 30), 30);
      invokeBurst(events(dimensions, 25), 25);
      invokeBurst(events(dimensions, 20), 20);
      invokeBurst(events(dimensions, 15), 15);
    }
  }, 300);
  return { intervalId };
};
