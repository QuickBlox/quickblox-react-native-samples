import React from 'react';
import {View} from 'react-native';
import QB from 'quickblox-react-native-sdk';
import WebRTCView from 'quickblox-react-native-sdk/RTCView';

import OpponentsCircles from './OpponentsCircles';
import OpponentCircle from './OpponentCircle';
import {colors} from '../../theme';

export default function VideoViews(props) {
  const {currentUser, displayingUser, muteVideo, peers, session, users} = props;

  const [opponents, setOpponents] = React.useState([]);
  const [closedPeers, setClosedPeers] = React.useState([]);
  const closedPeersTimers = React.useRef({}).current;

  React.useEffect(() => {
    if (peers) {
      setOpponents(
        Object.keys(peers)
          .map(Number)
          .filter(userId => userId !== currentUser.id)
          .map(userId => ({
            userId: userId,
            connected:
              peers[userId] === QB.webrtc.RTC_PEER_CONNECTION_STATE.CONNECTED,
          })),
      );
    }
  }, [currentUser, peers]);

  React.useEffect(() => {
    const isAllPeersClosed = Object.keys(peers)
      .map(Number)
      .filter(userId => userId !== currentUser.id)
      .every(
        userId => peers[userId] === QB.webrtc.RTC_PEER_CONNECTION_STATE.CLOSED,
      );
    if (isAllPeersClosed) {
      Object.keys(peers).forEach(userId =>
        clearTimeout(closedPeersTimers[userId]),
      );
    } else {
      Object.keys(peers)
        .map(Number)
        .filter(
          userId =>
            userId !== currentUser.id &&
            peers[userId] === QB.webrtc.RTC_PEER_CONNECTION_STATE.CLOSED,
        )
        .forEach(userId => {
          if (!closedPeersTimers[userId]) {
            closedPeersTimers[userId] = setTimeout(
              id => {
                setClosedPeers(ids =>
                  ids.includes(id) ? ids : ids.concat(id),
                );
              },
              5000,
              userId,
            );
          }
        });
    }
  }, [closedPeersTimers, currentUser.id, peers]);

  if (session.type === QB.webrtc.RTC_SESSION_TYPE.VIDEO) {
    const videoStyle =
      opponents.filter(({userId}) => !closedPeers.includes(userId)).length > 1
        ? {height: '50%', width: '50%'}
        : {height: '50%', width: '100%'};
    const myVideoStyle =
      opponents.filter(({userId}) => !closedPeers.includes(userId)).length > 2
        ? {height: '50%', width: '50%'}
        : {height: '50%', width: '100%'};
    return (
      <React.Fragment>
        {opponents
          .filter(({userId}) => !closedPeers.includes(userId))
          .map(({connected, userId}) =>
            connected ? (
              <WebRTCView
                key={userId}
                sessionId={session.id}
                style={videoStyle}
                userId={userId}
              />
            ) : (
              <OpponentCircle
                key={userId}
                peers={peers}
                style={videoStyle}
                user={users.find(user => user.id === userId)}
              />
            ),
          )}
        {muteVideo ? (
          <View style={[myVideoStyle, {backgroundColor: colors.black}]} />
        ) : (
          <WebRTCView
            key={currentUser.id}
            mirror={displayingUser}
            sessionId={session.id}
            style={myVideoStyle}
            userId={currentUser.id}
          />
        )}
      </React.Fragment>
    );
  } else {
    return (
      <OpponentsCircles
        currentUser={currentUser}
        peers={peers}
        session={session}
        users={users}
      />
    );
  }
}
