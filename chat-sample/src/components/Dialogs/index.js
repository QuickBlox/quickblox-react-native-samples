import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

import DialogsList from './List';
import useDialogScreenOptions from './useDialogScreenOptions';
import {styles} from '../../theme';

function DialogsScreen(props) {
  const {navigation} = props;
  const [deleteMode, setDeleteMode] = React.useState(false);

  const turnDeleteModeOn = () => {
    if (deleteMode) {
      return;
    }
    setDeleteMode(true);
  };

  const turnDeleteModeOff = () => {
    if (!deleteMode) {
      return;
    }
    setDeleteMode(false);
  };

  const navigationOptions = useDialogScreenOptions(
    deleteMode,
    turnDeleteModeOff,
  );

  React.useLayoutEffect(() => {
    if (navigation && navigationOptions) {
      navigation.setOptions(navigationOptions);
    }
  }, [navigation, navigationOptions]);

  const goToDialog = dialog =>
    navigation.navigate('Messages', {dialogId: dialog.id});

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <DialogsList
        onLongPress={turnDeleteModeOn}
        onPress={deleteMode ? undefined : goToDialog}
        selectable={deleteMode}
      />
    </SafeAreaView>
  );
}

export default React.memo(DialogsScreen);
