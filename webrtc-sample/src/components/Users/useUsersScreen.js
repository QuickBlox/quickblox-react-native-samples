import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {
  deletePushSubscription,
  logoutRequest,
} from '../../actionCreators';
import {
  authLoadingSelector,
  authUserSelector,
} from '../../selectors';
import {useActions} from '../../hooks';

const selector = createStructuredSelector({
  loading: authLoadingSelector,
  user: authUserSelector,
});

const actions = {
  deleteSubscription: deletePushSubscription,
  logout: logoutRequest,
};

export function useUsersScreen() {
  const {loading, user} = useSelector(selector);
  const {deleteSubscription, logout} = useActions(actions);

  const logoutPressHandler = () => {
    deleteSubscription({
      resolve: () => logout(),
      reject: () => logout(),
    });
  }

  return {loading, logoutPressHandler, user};
}
