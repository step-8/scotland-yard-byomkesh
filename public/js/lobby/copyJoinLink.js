const copyToClipboard = (gameId) => {
  const copyText = `http://localhost:8000/join?gameId=${gameId}`;
  navigator.clipboard.writeText(copyText);
  const message = byId('copy-message');
  const copyBtn = byId('copy-btn');

  message.classList.remove('hide');
  copyBtn.classList.add('hide');
  setTimeout(() => {
    message.classList.add('hide');
    copyBtn.classList.remove('hide');
  }, 2000);
};
