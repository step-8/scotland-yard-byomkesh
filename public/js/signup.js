const insertError = error => byId('error-msg').innerText = error;

const displayError = () => { 
  const cookie = new URLSearchParams(document.cookie);
  const error = cookie.get('signuperror');
  if (error) {
    insertError(error);
    document.cookie = `signuperror=;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  }
};

const handleSubmit = (event) => { 
  const formData = new FormData(event.target);
  const username = formData.get('username');
  const password = formData.get('password');
  let error = validateUsername(username);
  if (!error) {
    error = validatePassword(password);
  }
  if (error) {
    event.preventDefault();
    insertError(error);
  }
};

const main = () => {
  displayError();
  const form = query('form[action="/signup"]');
  form.addEventListener('submit', handleSubmit);
}

window.onload = main;
