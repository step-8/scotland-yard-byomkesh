const handleClosePopup = (event) => {
  query('.popup-backdrop').remove();
};

const submitOnEnter = (event) => {
  if (event.key === 'Enter') {
    const popup = query('.popup');
    popup.submit();
  }
};

const createPopup = () => {
  const backdrop = new Element('div')
    .addClass('popup-backdrop')
    .addClass('center-flex');

  const popup = new Element('form')
    .add('action', '/join')
    .add('method', 'get')
    .addEvent('keydown', submitOnEnter)
    .addClass('popup')
    .addClass('vertical-flex')
    .addClass('vertical-middle');

  const closePopup = new Element('button')
    .addClass('close-popup')
    .add('innerText', 'X')
    .addEvent('click', (e) => e.preventDefault())
    .addEvent('click', handleClosePopup);

  const h1 = new Element('h1')
    .add('innerText', 'JOIN GAME');

  const roomId = new Element('input')
    .add('type', 'text')
    .add('name', 'gameId')
    .add('placeholder', 'Game id');

  const popupError = new Element('div')
    .addClass('popup-error');

  const joinButton = new Element('button')
    .add('value', 'Join')
    .addClass('join-btn')
    .add('type', 'submit')
    .add('innerText', 'Join');

  popup.append(closePopup.html);
  popup.append(h1.html);
  popup.append(roomId.html);
  popup.append(popupError.html);
  popup.append(joinButton.html);

  backdrop.append(popup.html);
  return backdrop.html;
};
