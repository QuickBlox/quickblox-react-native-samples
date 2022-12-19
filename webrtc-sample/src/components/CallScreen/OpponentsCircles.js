import React from 'react';
import {View} from 'react-native';

import OpponentCircle from './OpponentCircle';
import styles from './styles';

export default function OpponentsCircles(props) {
  const {currentUser, peers, session, users} = props;
  const userIds = session.opponentsIds
    .concat(session.initiatorId)
    .filter(userId => userId !== currentUser.id);
  return (
    <View style={styles.opponentsContainer}>
      {userIds.map(userId => (
        <OpponentCircle
          key={userId}
          user={users.find(user => user.id === userId)}
          peers={peers}
        />
      ))}
    </View>
  );
}
