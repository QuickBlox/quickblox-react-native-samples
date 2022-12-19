import {useCallback, useState} from 'react';
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {Alert} from 'react-native';
import QB from 'quickblox-react-native-sdk';

import {
  appConnectedSelector,
  authUserSelector,
  usersItemsSelector,
  webrtcDisplayingUserSelector,
  webrtcOnCallSelector,
  webrtcPeersSelector,
  webrtcSessionSelector,
} from '../../selectors';
import {
  usersGet,
  webrtcAccept,
  webrtcHangUp,
  webrtcReject,
  webrtcSwitchAudioOutput,
  webrtcSwitchCamera,
  webrtcToggleAudio,
  webrtcToggleVideo,
} from '../../actionCreators';
import {useActions}  from '../../hooks';

const getUserFromSessionInitiator = (session, currentUser, users = []) => {
  if (!session) {
    return;
  }
  if (session.initiatorId === currentUser.id) {
    return currentUser;
  }
  return users.find(user => user.id === session.initiatorId);
};

const selector = createSelector(
  appConnectedSelector,
  authUserSelector,
  usersItemsSelector,
  webrtcDisplayingUserSelector,
  webrtcOnCallSelector,
  webrtcPeersSelector,
  webrtcSessionSelector,
  (connectedToInternet, currentUser, users, displayingUser, onCall, peers, session) => ({
    caller: getUserFromSessionInitiator(session, currentUser, users),
    connectedToInternet,
    currentUser,
    displayingUser,
    onCall,
    peers,
    session,
    users,
  })
);

const actions = {
  accept: webrtcAccept,
  getUsers: usersGet,
  hangUp: webrtcHangUp,
  reject: webrtcReject,
  switchAudio: webrtcSwitchAudioOutput,
  switchCamera: webrtcSwitchCamera,
  toggleAudio: webrtcToggleAudio,
  toggleVideo: webrtcToggleVideo,
};

export function useCallScreen() {
  const {
    caller,
    connectedToInternet,
    currentUser,
    displayingUser,
    onCall,
    peers,
    session,
    users,
  } = useSelector(selector);
  const {
    accept,
    getUsers,
    hangUp,
    reject,
    switchAudio,
    switchCamera,
    toggleAudio,
    toggleVideo,
  } = useActions(actions);

  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [isLoudspeaker, setIsLoudspeaker] = useState(false);
  const isIncomingCall = session && currentUser
    ? session.initiatorId !== currentUser.id
    : false;
  const media = session
    ? session.type === QB.webrtc.RTC_SESSION_TYPE.AUDIO ? 'audio' : 'video'
    : '';

  const loadMissingUsers = useCallback(() => {
    if (session) {
      const userIds = session
        .opponentsIds
        .concat(session.initiatorId)
        .filter(userId => !users.find(user => user.id === userId))
        .join();
      getUsers({
        append: true,
        filter: {
          field: QB.users.USERS_FILTER.FIELD.ID,
          type: QB.users.USERS_FILTER.TYPE.NUMBER,
          operator: QB.users.USERS_FILTER.OPERATOR.IN,
          value: userIds,
        },
      });
    }
  }, [getUsers, session, users])

  const acceptCall = useCallback(() => {
    if (!connectedToInternet) {
      Alert.alert('No internet connection');
    } else {
      if (session) {
        accept({sessionId: session.id});
      }
    }
  }, [accept, connectedToInternet, session]);

  const endCall = () => {
    if (
      isIncomingCall &&
      session.state < QB.webrtc.RTC_SESSION_STATE.CONNECTED
    ) {
      reject({sessionId: session.id});
    } else {
      hangUp({sessionId: session.id});
    }
  };

  const toggleMuteAudio = () => {
    toggleAudio({sessionId: session.id, enable: audioMuted});
    setAudioMuted(!audioMuted);
  };

  const toggleMuteVideo = () => {
    toggleVideo({sessionId: session.id, enable: videoMuted});
    setVideoMuted(!videoMuted);
  };

  const toggleAudioOutput = () => {
    const output = isLoudspeaker
      ? QB.webrtc.AUDIO_OUTPUT.EARSPEAKER
      : QB.webrtc.AUDIO_OUTPUT.LOUDSPEAKER;
    switchAudio({output});
    setIsLoudspeaker(!isLoudspeaker);
  };

  const toggleSwitchCamera = useCallback(() => {
    switchCamera({sessionId: session.id});
  }, [session]);

  return {
    acceptCall,
    audioMuted,
    caller,
    currentUser,
    displayingUser,
    endCall,
    isIncomingCall,
    isLoudspeaker,
    loadMissingUsers,
    media,
    onCall,
    peers,
    session,
    toggleAudioOutput,
    toggleMuteAudio,
    toggleMuteVideo,
    toggleSwitchCamera,
    users,
    videoMuted,
  }
}
