import {eventChannel} from 'redux-saga';
import {
  call,
  delay,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects';
import {Platform} from 'react-native';
import RNCallKeep, {CONSTANTS as CK_CONSTANTS} from 'react-native-callkeep';
import QB from 'quickblox-react-native-sdk';

import {showError} from '../NotificationService';
import {
  chatConnectAndSubscribe,
  webrtcAccept,
  webrtcAcceptSuccess,
  webrtcHangUp,
  webrtcReject,
  webrtcToggleAudio,
} from '../actionCreators';
import {
  CALL_KEEP_INCOMING_CALL,
  WEBRTC_ACCEPT_FAIL,
  WEBRTC_ACCEPT_SUCCESS,
  WEBRTC_HANGUP_REQUEST,
  WEBRTC_REJECT_REQUEST,
} from '../constants';
import {name} from '../../package.json';

const options = {
  ios: {
    appName: name,
    imageName: 'sim_icon',
    supportsVideo: true,
    maximumCallGroups: '1',
    maximumCallsPerCallGroup: '1',
  },
  android: {
    alertTitle: 'Permissions Required',
    alertDescription:
      'This application needs to access your phone calling accounts to receive calls in background',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'sim_icon',
  },
};

function createRNCallKeepChannel() {
  return eventChannel(emitter => {
    const emitEvent = type => payload => emitter({type, payload});
    // Add RNCallKeep Events
    RNCallKeep.addEventListener(
      'didReceiveStartCallAction',
      emitEvent('didReceiveStartCallAction'),
    );
    RNCallKeep.addEventListener('answerCall', emitEvent('answerCall'));
    RNCallKeep.addEventListener('endCall', emitEvent('endCall'));
    RNCallKeep.addEventListener(
      'didDisplayIncomingCall',
      emitEvent('didDisplayIncomingCall'),
    );
    RNCallKeep.addEventListener(
      'didPerformSetMutedCallAction',
      emitEvent('didPerformSetMutedCallAction'),
    );
    RNCallKeep.addEventListener(
      'didToggleHoldCallAction',
      emitEvent('didToggleHoldCallAction'),
    );
    RNCallKeep.addEventListener(
      'didPerformDTMFAction',
      emitEvent('didPerformDTMFAction'),
    );
    RNCallKeep.addEventListener(
      'didActivateAudioSession',
      emitEvent('didActivateAudioSession'),
    );
    RNCallKeep.addEventListener('checkReachability', () =>
      RNCallKeep.setReachable(true),
    );
    return () => {
      RNCallKeep.removeEventListener('didReceiveStartCallAction');
      RNCallKeep.removeEventListener('answerCall');
      RNCallKeep.removeEventListener('endCall');
      RNCallKeep.removeEventListener('didDisplayIncomingCall');
      RNCallKeep.removeEventListener('didPerformSetMutedCallAction');
      RNCallKeep.removeEventListener('didToggleHoldCallAction');
      RNCallKeep.removeEventListener('didPerformDTMFAction');
      RNCallKeep.removeEventListener('didActivateAudioSession');
      RNCallKeep.removeEventListener('checkReachability');
    };
  });
}

// Initialise RNCallKeep
function* setup() {
  try {
    yield call(RNCallKeep.setup, options);
    yield call(RNCallKeep.canMakeMultipleCalls, false);
    yield call(RNCallKeep.setAvailable, true);
  } catch (err) {
    showError(
      'CallKeep init error:',
      err && err.message ? err.message : err || 'Unknown',
    );
  }
}

function* showIncomingCall(action) {
  const {session} = action.payload;
  const start =
    session.timestamp && !isNaN(parseInt(session.timestamp, 10))
      ? parseInt(session.timestamp, 10)
      : Date.now() - 2000;
  if (start) {
    const now = Date.now();
    // eslint-disable-next-line no-undef
    if (now > start + globalThis.ANSWER_TIME_INTERVAL * 1000 - 2000) {
      // call has already ended
      return call(reportEndCallWithUUID, {
        type: QB.webrtc.EVENT_TYPE.HANG_UP,
        payload: action.payload,
      });
    }
  }
  if (Platform.OS === 'android') {
    let localizedCallerName = '';
    if (session.contactIdentifier) {
      localizedCallerName = session.contactIdentifier;
    } else {
      const users = yield select(state => state.users.users);
      const initiator = users.find(user => user.id === session.initiatorId);
      localizedCallerName =
        initiator.fullName ||
        initiator.login ||
        initiator.phone ||
        initiator.email;
    }
    const hasVideo = session.type === QB.webrtc.RTC_SESSION_TYPE.VIDEO;
    yield call(
      RNCallKeep.displayIncomingCall,
      session.id,
      `${session.initiatorId}`,
      localizedCallerName,
      'generic',
      hasVideo,
    );
  }
}

function* reportEndCallWithUUID(action) {
  const {
    session: {id: callUUID},
  } = action.payload;
  let reason;
  switch (action.type) {
    case QB.webrtc.EVENT_TYPE.HANG_UP:
      reason = CK_CONSTANTS.END_CALL_REASONS.REMOTE_ENDED;
      break;
    case QB.webrtc.EVENT_TYPE.NOT_ANSWER:
      reason = CK_CONSTANTS.END_CALL_REASONS.UNANSWERED;
      break;
    case QB.webrtc.EVENT_TYPE.REJECT:
      reason = CK_CONSTANTS.END_CALL_REASONS.DECLINED_ELSEWHERE;
      break;
  }
  yield call(RNCallKeep.reportEndCallWithUUID, callUUID, reason);
}

// Event Listener Callbacks

function* didReceiveStartCallAction({callUUID}) {
  // Get this event after the system decides you can start a call
  // You can now start a call from within your app
  if (callUUID) {
    yield call(RNCallKeep.endCall, callUUID);
  }
  yield call(RNCallKeep.backToForeground);
}

/** Called when the user answered a call from the app UI */
function* onAnswerCallFromApp(action) {
  const {session} = action.payload;
  yield call(RNCallKeep.answerIncomingCall, session.id);
}

/** Called when the user answers an incoming call */
function* onAnswerCallAction({callUUID}) {
  const {session, connected, connecting} = yield select(
    ({chat, webrtc}) => ({
      connected: chat.connected,
      connecting: chat.loading,
      session: webrtc.session,
    }),
  );
  if (!connected && !connecting) {
    yield put(chatConnectAndSubscribe());
  }
  if (session && session.id.toLowerCase() === callUUID.toLowerCase()) {
    if (session.state < QB.webrtc.RTC_SESSION_STATE.CONNECTED) {
      if (Platform.OS === 'ios') {
        yield put(webrtcAcceptSuccess(session));
      }
      const hasVideo = session.type === QB.webrtc.RTC_SESSION_TYPE.VIDEO;
      yield put(webrtcAccept({sessionId: callUUID}));
      const {failure} = yield race({
        success: take(WEBRTC_ACCEPT_SUCCESS),
        failure: take(WEBRTC_ACCEPT_FAIL),
      });
      if (failure) {
        const {call} = yield race({
          call: take(QB.webrtc.EVENT_TYPE.CALL),
          timeout: delay(5000)
        });
        if (call) {
          yield put(webrtcAccept({sessionId: callUUID}));
        } else {
          yield call(RNCallKeep.setAvailable, false);
          return;
        }
      }
      if (Platform.OS === 'android') {
        yield call(
          RNCallKeep.reportEndCallWithUUID,
          callUUID,
          CK_CONSTANTS.END_CALL_REASONS.ANSWERED_ELSEWHERE,
        );
      }
      if (hasVideo) {
        yield call(RNCallKeep.backToForeground);
      }
    }
  } else {
    __DEV__ &&  console.warn('Got answerCall for unknown session', callUUID);
  }
}

function* onEndCallAction({callUUID}) {
  yield call(RNCallKeep.endCall, callUUID);
  const currentUser = yield select(({auth}) => auth.user);
  let session = yield select(({webrtc}) => webrtc.session);
  if (!session || session.contactIdentifier) {
    yield take(QB.webrtc.EVENT_TYPE.CALL);
    session = yield select(({webrtc}) => webrtc.session);
  }
  const isIncomingCall =
    session && currentUser ? session.initiatorId !== currentUser.id : false;
  if (session && session.id.toLowerCase() === callUUID.toLowerCase()) {
    if (session.state < QB.webrtc.RTC_SESSION_STATE.CLOSED) {
      const actionCreator =
        isIncomingCall && session.state < QB.webrtc.RTC_SESSION_STATE.CONNECTED
          ? webrtcReject
          : webrtcHangUp;
      yield put(actionCreator({sessionId: session.id}));
    }
  }
}

function* onHangUpOrReject(action) {
  const {sessionId} = action.payload;
  yield call(
    RNCallKeep.reportEndCallWithUUID,
    sessionId,
    CK_CONSTANTS.END_CALL_REASONS.DECLINED_ELSEWHERE,
  );
}

// Currently iOS only
function* onIncomingCallDisplayed(data) {
  // You will get this event after RNCallKeep finishes showing incoming call UI
  // You can check if there was an error while displaying
}

/** Called when the system or user mutes a call */
function* onToggleMute({muted, callUUID}) {
  yield put(webrtcToggleAudio({sessionId: callUUID, enable: !muted}));
}

/** Called when the system or user holds a call */
function* onToggleHold({hold, callUUID}) {}

/** Called when the system or user performs a DTMF action */
function* onDTMFAction({digits, callUUID}) {}

/** You might want to do following things when receiving this event:
 * - Start playing ringback if it is an outgoing call
 */
function* audioSessionActivated(data) {}

function* handleCallKeepEvent(action) {
  const {type, payload} = action;
  let handler;
  switch (type) {
    case 'didReceiveStartCallAction':
      handler = didReceiveStartCallAction;
      break;
    case 'answerCall':
      handler = onAnswerCallAction;
      break;
    case 'endCall':
      handler = onEndCallAction;
      break;
    case 'didDisplayIncomingCall':
      handler = onIncomingCallDisplayed;
      break;
    case 'didPerformSetMutedCallAction':
      handler = onToggleMute;
      break;
    case 'didToggleHoldCallAction':
      handler = onToggleHold;
      break;
    case 'didPerformDTMFAction':
      handler = onDTMFAction;
      break;
    case 'didActivateAudioSession':
      handler = audioSessionActivated;
      break;
  }
  if (handler) {
    yield call(handler, payload);
  }
}

function* callKeepFlow() {
  try {
    yield call(setup);
    const channel = yield call(createRNCallKeepChannel);
    while (true) {
      const action = yield take(channel);
      yield put(action);
      yield call(handleCallKeepEvent, action);
    }
  } catch (e) {
    yield put({type: 'CALL_KEEP_ERROR', error: e.message || e});
  }
}

export default [
  takeEvery(
    [
      QB.webrtc.EVENT_TYPE.HANG_UP,
      QB.webrtc.EVENT_TYPE.NOT_ANSWER,
      QB.webrtc.EVENT_TYPE.REJECT,
    ],
    reportEndCallWithUUID,
  ),
  takeEvery(WEBRTC_ACCEPT_SUCCESS, onAnswerCallFromApp),
  takeEvery([WEBRTC_HANGUP_REQUEST, WEBRTC_REJECT_REQUEST], onHangUpOrReject),
  takeEvery(CALL_KEEP_INCOMING_CALL, showIncomingCall),
  callKeepFlow(),
];
