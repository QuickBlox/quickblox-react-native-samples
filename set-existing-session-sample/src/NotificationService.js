import {showMessage} from 'react-native-flash-message';
import {colors} from './theme';

const NOTIFICATION_CHANNEL_ID = 'qb-rn-chat';

/**
 * Show error message with title and description (optional)
 * @param {string} error
 * @param {string=} description
 */
export const showError = (error, description) =>
  showMessage({
    description,
    message: error,
    type: 'danger',
  });

/**
 * Show success message with title and description (optional)
 * @param {string} message
 * @param {string=} description
 */
export const showSuccess = (message, description) =>
  showMessage({
    backgroundColor: colors.primary,
    description,
    message,
    type: 'success',
  });

