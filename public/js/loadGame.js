const displayError = () => {
  const cookies = document.cookie.split('; ');
  const cookie = new URLSearchParams(cookies.join('&'));
  const message = document.querySelector('#message');
  if (cookie.get('loadGameError')) {
    message.innerText = cookie.get('loadGameError');
    message.classList.add('error');
    document.cookie = 'loadGameError=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  if (cookie.get('success')) {
    message.innerHTML = cookie.get('success') + ' <a href="/">Go to home</a>';
    message.classList.add('success');
    document.cookie = 'success=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};


window.onload = displayError;