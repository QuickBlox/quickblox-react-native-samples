// w3c email regex https://html.spec.whatwg.org/multipage/input.html#e-mail-state-(type=email)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const LOGIN_HINT =
  'Use your email or alphanumeric characters in a range from 3 to 50. First character must be a letter.';
const USERNAME_HINT =
  'Use alphanumeric characters and spaces in a range from 3 to 20. Cannot contain more than one space in a row.';

export const validate = values => {
  const errors = [];
  if (values.login) {
    if (values.login.indexOf('@') > -1) {
      if (!emailRegex.test(values.login)) {
        errors.login = LOGIN_HINT;
      }
    } else {
      if (!/^[a-zA-Z][\w\-.]{1,48}\w$/.test(values.login)) {
        errors.login = LOGIN_HINT;
      }
    }
  } else {
    errors.login = LOGIN_HINT;
  }
  if (values.username) {
    if (!/^(?=.{3,20}$)(?!.*([\s])\1{2})[\w\s]+$/.test(values.username)) {
      errors.username = USERNAME_HINT;
    }
  } else {
    errors.username = USERNAME_HINT;
  }
  return errors;
};
