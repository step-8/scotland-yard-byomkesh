const showError = error => {
  const errorEle = new Element('div')
    .addClass('connection-error')
    .addClass('center-flex')
    .add('innerText', error);

  query('body').appendChild(errorEle.html);

  setTimeout(() => {
    errorEle.html.remove();
  }, 5000);
};

const serveConnectionError = () => {
  const cookie = new URLSearchParams(document.cookie);

  if (cookie.get('connError')) {
    showError(cookie.get('connError'));
  }
};
