const displayError = () => {
  const cookies = document.cookie.split('; ');
  const cookie = new URLSearchParams(cookies.join('&'));
  const error = document.querySelector('.error-msg');
  if (cookie.get('loginError')) {
    error.innerText = cookie.get('loginError');
    document.cookie = 'loginError=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/login';
  }
};

window.onload = displayError;
