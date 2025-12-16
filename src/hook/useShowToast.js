import {Alert, Platform, ToastAndroid} from 'react-native';

export const useShowToast = () => {
  const showToast = (message, title = '') => {
    if (Platform.OS === 'ios') {
      Alert.alert(title, message);
    } else {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  return {showToast};
};
