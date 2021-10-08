import {loginRequest, usersCreate, usersUpdate} from '../../actionCreators';
import {showError} from '../../NotificationService';

// w3c email regex https://html.spec.whatwg.org/multipage/input.html#e-mail-state-(type=email)
const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
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
    if (
      !/^(?=[A-Za-z0-9\s]{3,20}$).*$/.test(values.username) ||
      values.username.includes('  ')
    ) {
      errors.username = USERNAME_HINT;
    }
  } else {
    errors.username = USERNAME_HINT;
  }
  return errors;
};

export function useSubmitHandler(dispatch) {
  const checkIfUsernameMatch = (username, user) => {
    return user.fullName !== username.trim()
      ? new Promise((resolve, reject) =>
          dispatch(
            usersUpdate({
              fullName: username,
              login: user.login,
              reject: action =>
                reject(`Failed to update user\n${action.error}`),
              resolve,
            }),
          ),
        )
      : Promise.resolve();
  };

  const submit = ({login, username}) => {
    new Promise((resolve, reject) => {
      dispatch(loginRequest({login, reject, resolve}));
    })
      .then(action => {
        checkIfUsernameMatch(username, action.payload.user);
      })
      .catch(action => {
        if (action.error.toLowerCase().indexOf('unauthorized') > -1) {
          new Promise((resolve, reject) => {
            dispatch(
              usersCreate({
                fullName: username.trim(),
                login: login.trim(),
                password: 'quickblox',
                reject,
                resolve,
              }),
            );
          })
            .then(() => {
              submit({login, username});
            })
            .catch(userCreateAction => {
              const {error} = userCreateAction;
              if (error) {
                showError('Failed to create user account', error);
              }
            });
        } else {
          showError('Failed to sign in', action.error);
        }
      });
  };

  return submit;
}
