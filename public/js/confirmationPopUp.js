const removePopUp = () => {
  const [backdrop] = byClass('pop-up-backdrop');
  if (backdrop) {
    backdrop.remove();
  }
};

const createConfirmationPopup = (message, onYes, onNo) => {
  const backdrop = new Element('div')
    .addClass('pop-up-backdrop')
    .addClass('center-flex');

  const popUp = new Element('div')
    .addClass('confirmation-pop-up')
    .addClass('vertical-flex')
    .addClass('vertical-middle');

  const popUpMessage = new Element('div')
    .addClass('confirmation-message')
    .add('innerText', message);

  const confirmation = new Element('div')
    .addClass('options')
    .addClass('horizontal-flex');

  const yesButton = new Element('div')
    .addClass('confirm')
    .add('innerText', 'Yes')
    .add('onclick', onYes);

  const noButton = new Element('div')
    .addClass('cancel')
    .add('innerText', 'No')
    .add('onclick', onNo);

  const closePopUp = new Element('div')
    .addClass('close-pop-up')
    .add('innerText', 'X')
    .add('onclick', removePopUp);

  confirmation.append(yesButton.html);
  confirmation.append(noButton.html);

  popUp.append(popUpMessage.html);
  popUp.append(confirmation.html);
  popUp.append(closePopUp.html);
  backdrop.append(popUp.html);

  const body = document.body;
  body.append(backdrop.html);
};
