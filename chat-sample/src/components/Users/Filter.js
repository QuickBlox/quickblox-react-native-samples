import React from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import QB from 'quickblox-react-native-sdk';

import {usersFilterSelector} from '../../selectors';
import {usersGet, usersSetFilter} from '../../actionCreators';
import {useActions, useDebounce} from '../../hooks';
import {SEARCH} from '../../images';
import styles from './styles';

const FILTER_DEBOUNCE = 500;

const actions = {
  getUsers: usersGet,
  setFilter: usersSetFilter,
};

export default function Filter() {
  const filter = useSelector(usersFilterSelector);
  const {getUsers, setFilter} = useActions(actions);
  const debouncedFilter = useDebounce(filter, FILTER_DEBOUNCE);

  const filterTextChangeHandler = text => setFilter(text);

  React.useEffect(() => {
    const value = debouncedFilter;
    if (value.trim().length === 0 || value.trim().length > 2) {
      if (getUsers) {
        getUsers({
          filter:
            value && value.trim().length
              ? {
                  field: QB.users.USERS_FILTER.FIELD.FULL_NAME,
                  operator: QB.users.USERS_FILTER.OPERATOR.IN,
                  type: QB.users.USERS_FILTER.TYPE.STRING,
                  value,
                }
              : undefined,
          page: 1,
        });
      }
    }
  }, [debouncedFilter, getUsers]);

  return (
    <View style={styles.filterView}>
      <Image source={SEARCH} style={styles.icon} />
      <TextInput
        autoCapitalize="none"
        onChangeText={filterTextChangeHandler}
        placeholder="Search"
        returnKeyType="search"
        style={styles.filterInput}
        value={filter}
      />
      {filter && filter.trim().length ? (
        <TouchableOpacity
          onPress={() => filterTextChangeHandler('')}
          style={styles.resetFilterBtn}>
          <Text style={styles.resetFilterBtnText}>&times;</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
