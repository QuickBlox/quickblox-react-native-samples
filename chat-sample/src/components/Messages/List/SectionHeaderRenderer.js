import React from 'react';
import {Text, View} from 'react-native';

import styles from '../styles';

/**
 * @param {Date} date
 * @returns {string}
 */
const getDateString = date => {
  const now = new Date();
  if (date.getFullYear() === now.getFullYear()) {
    if (date.getMonth() === now.getMonth()) {
      if (date.getDate() === now.getDate()) {
        return 'Today';
      }
      if (date.getDate() === now.getDate() - 1) {
        return 'Yesterday';
      }
    }
    return date
      .toDateString()
      .replace(/(^\w+\s)|(\s\d+$)/g, '')
      .split(' ')
      .reverse()
      .join(' ')
      .replace(/^0/, '');
  } else {
    const [month, day, year] = date
      .toDateString()
      .replace(/(^\w+\s)/, '')
      .split(' ');
    return [day, month, year].join(' ');
  }
};

export default function SectionHeaderRenderer(props) {
  const {section} = props;
  return (
    <View style={styles.messagesListSectionHeaderView}>
      <View style={styles.messagesListSectionHeaderTextView}>
        <Text style={styles.messagesListSectionHeaderText}>
          {getDateString(section.title)}
        </Text>
      </View>
    </View>
  );
}
