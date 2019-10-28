import QB from 'quickblox-react-native-sdk'

import {
  getInfo,
  getInfoFail,
  getInfoSuccess,
} from '../actionCreators'

export const getSdkInfo = () => dispatch => {
  dispatch(getInfo())
  return QB
    .settings
    .get()
    .then(settings => dispatch(getInfoSuccess(settings)))
    .catch(e => dispatch(getInfoFail(e.message)))
}
