import {loginRequest, usersCreate, usersUpdate} from '../../actionCreators';
import {showError} from '../../NotificationService';
import {useActions} from '../../hooks';

const actions = {
  createUser: usersCreate,
  signIn: loginRequest,
  updateUser: usersUpdate,
};

export function useSubmitHandler() {
  const {createUser, signIn, updateUser} = useActions(actions);

  const createUserAndSubmit  = ({login, username}) => {
    createUser({
      fullName: username,
      login,
      password: 'quickblox',
      resolve: () => submit({login, username}),
      reject: (userCreateFailureAction => {
        const {error: createUserError} = userCreateFailureAction;
        if (createUserError) {
          showError('Failed to create user account', createUserError);
        }
      }),
    });
  }

  const checkIfUsernameMatch = (username, user) => {
    const updateFullNameIfNotMatch =
      user.fullName !== username
        ? new Promise((resolve, reject) =>
            updateUser({
              fullName: username,
              login: user.login,
              resolve,
              reject,
            }),
          )
        : Promise.resolve();
    updateFullNameIfNotMatch
      .catch(action => {
        if (action && action.error) {
          showError('Failed to update user', action.error);
        }
      });
  };

  const submit = ({login, username}) => {
    signIn({
      login,
      resolve: (action) => checkIfUsernameMatch(username, action.payload.user),
      reject: ({error}) => {
        if (error.toLowerCase().indexOf('unauthorized') > -1) {
          createUserAndSubmit({login, username});
        } else {
          showError('Failed to sign in', error);
        }
      },
    });
  };

  return submit;
}
