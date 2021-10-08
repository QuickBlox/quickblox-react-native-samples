import React from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {useSelector} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import Dialog from './Dialog';
import {
  dialogsItemsSelector,
  dialogsLimitSelector,
  dialogsLoadingSelector,
  dialogsSelectedSelector,
  dialogsSkipSelector,
  dialogsTotalSelector,
} from '../../selectors';
import {dialogGet, dialogSelect} from '../../actionCreators';
import {useActions} from '../../hooks';
import styles from './styles';
import {colors} from '../../theme';

const selector = createStructuredSelector({
  data: dialogsItemsSelector,
  limit: dialogsLimitSelector,
  loading: dialogsLoadingSelector,
  selected: dialogsSelectedSelector,
  skip: dialogsSkipSelector,
  total: dialogsTotalSelector,
});

const actions = {
  getDialogs: dialogGet,
  selectDialog: dialogSelect,
};

function DialogsList(props) {
  const {onLongPress, onPress, selectable = false} = props;
  const {data, limit, loading, selected, skip, total} = useSelector(selector);
  const {getDialogs, selectDialog} = useActions(actions);

  React.useEffect(() => {
    getDialogs({append: true, limit, skip: 0});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNextPage = React.useCallback(() => {
    if (loading || skip + limit > total) {
      return;
    }
    getDialogs({append: true, limit, skip: skip + limit});
  }, [getDialogs, loading, limit, skip, total]);

  const pressHandler = React.useCallback(
    dialog => {
      if (onPress) {
        onPress(dialog);
      } else {
        if (selectable && selectDialog) {
          selectDialog(dialog.id);
        }
      }
    },
    [onPress, selectDialog, selectable],
  );

  const longPressHandler = React.useCallback(
    dialog => onLongPress && onLongPress(dialog),
    [onLongPress],
  );

  const renderDialog = React.useCallback(
    ({item}) => {
      const isSelected = selected.length && selected.includes(item.id);
      return (
        <Dialog
          dialog={item}
          onPress={pressHandler}
          onLongPress={longPressHandler}
          selectable={selectable}
          isSelected={isSelected}
        />
      );
    },
    [selected, pressHandler, longPressHandler, selectable],
  );

  return (
    <FlatList
      data={data}
      keyExtractor={({id}) => id}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.75}
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          onRefresh={() => getDialogs({limit, skip: 0})}
          refreshing={loading}
          tintColor={colors.primary}
        />
      }
      renderItem={renderDialog}
      style={styles.dialogsList}
    />
  );
}

export default React.memo(DialogsList);
