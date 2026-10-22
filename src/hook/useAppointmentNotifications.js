import {useEffect, useCallback, useRef} from 'react';
import {AppState} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import {isPhcWorker} from '../utils/helper';
import {
  getAppointmentsWithPatientRequest,
  getAppointmentsRequest
} from '../store/phcAppointment/actions';
import {getAppointmentsListRequest} from '../store/appointment/actions';

export const useAppointmentNotifications = (dispatch, profile, canFetch) => {
  const appState = useRef(AppState.currentState);
  // Read through a ref so a connection change doesn't re-subscribe the listeners
  const canFetchRef = useRef(canFetch);
  canFetchRef.current = canFetch;

  const handleAppointmentNotification = useCallback(() => {
    // Offline (or before the offline-login re-login) the request just fails, then runs again on reconnect,
    // so the loading shows twice
    if (!canFetchRef.current) return;

    if (isPhcWorker(profile.type)) {
      const now = new Date();
      const formattedNow = moment(now).utc().format('YYYY-MM-DD HH:mm:ss');
      const formattedDate = moment(now).utc().format('DD/MM/YYYY');
      dispatch(getAppointmentsWithPatientRequest({date: formattedDate, now: formattedNow}));
      dispatch(getAppointmentsRequest({date: formattedDate, now: formattedNow}));
    } else {
      dispatch(getAppointmentsListRequest({}));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    // Foreground notifications
    const unsubOnMessage = messaging().onMessage(remoteMessage => {
      const eventType = remoteMessage.data?.event_type;
      if (eventType !== 'appointment') return;
      handleAppointmentNotification();
    });

    // App resume from background
    const subscription = AppState.addEventListener('change', nextState => {
      // Only a real resume: toggling the network from Control Center / Quick Settings goes inactive -> active
      if (appState.current === 'background' && nextState === 'active') {
        // Refresh appointments when app comes back from background
        handleAppointmentNotification();
      }
      appState.current = nextState;
    });

    return () => {
      unsubOnMessage();
      subscription.remove();
    };
  }, [handleAppointmentNotification]);
};
