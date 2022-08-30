const includesSpaces = (val) => val.includes(' ');
const isNotBeetween4And10 = (val) => val.length < 4 || val.length > 10;
const isStartingWithNum = (val) => /^[0-9]/.test(val);
const containsSpecialChar = (val) => /\W/i.test(val);

const usernameValidations = [
  {
    validator: includesSpaces,
    message: 'Username can\'t consist of spaces'
  },
  {
    validator: isNotBeetween4And10,
    message: 'Username should be at least 4 and at most 10 characters long.'
  }, 
  {
    validator:isStartingWithNum,
    message: 'Username shouldn\'t start with numbers.'
  },
  {
    validator: containsSpecialChar,
    message: 'Username should only contain alphabets and numbers.'
  }
];

const passwordValidations = [
  {
    validator: includesSpaces,
    message: 'Password can\'t consist of white spaces'
  },
  {
    validator: isNotBeetween4And10,
    message: 'Password should be at least 4 and at most 10 characters long.'
  }
];

const validate = (validationRules, val) => {
  for (let index = 0; index < validationRules.length; index++) {
    const {validator, message} = validationRules[index];
    if (validator(val)) {
      return message;
    }
  }
};

const validateUsername = (username) => validate(usernameValidations, username);
const validatePassword = (password) => validate(passwordValidations, password);

