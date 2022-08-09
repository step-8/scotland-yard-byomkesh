const handleClosePopup = (event) => {
  query('.popup-backdrop').remove();
};

const createPopup = () => {
  const backdrop = new Element('div')
    .addClass('popup-backdrop');

  const popup = new Element('form')
    .add('action', '/join')
    .add('method', 'get')
    .addClass('popup');

  const closePopup = new Element('button')
    .addClass('close-popup')
    .add('innerText', 'X')
    .addEvent('click', (e) => { e.preventDefault() })
    .addEvent('click', handleClosePopup);

  const h1 = new Element('h1')
    .add('innerText', 'JOIN GAME');

  const roomId = new Element('input')
    .add('type', 'text')
    .add('name', 'gameId')
    .add('placeholder', 'Rood id');

  const popupError = new Element('div')
    .addClass('popup-error');

  const joinButton = new Element('button')
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