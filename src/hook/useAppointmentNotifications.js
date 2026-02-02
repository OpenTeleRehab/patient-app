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

export const useAppointmentNotifications = (dispatch, profile) => {
  const appState = useRef(AppState.currentState);

  const handleAppointmentNotification = useCallback(() => {
      if (isPhcWorker(profile.type)) {
        const now = new Date();
        const formattedNow = moment(now).utc().format('YYYY-MM-DD HH:mm:ss');
        const formattedDate = moment(now).utc().format('DD/MM/YYYY');
        dispatch(getAppointmentsWithPatientRequest({date: formattedDate, now: formattedNow}));
        dispatch(getAppointmentsRequest({date: formattedDate, now: formattedNow}));
      } else {
        dispatch(getAppointmentsListRequest({page_size: 10}));
      }
    },
    [dispatch, profile]
  );

  useEffect(() => {
    // Foreground notifications
    const unsubOnMessage = messaging().onMessage(remoteMessage => {
      const eventType = remoteMessage.data?.event_type;
      if (eventType !== 'appointment') return;
      handleAppointmentNotification();
    });

    // App resume from background
    const subscription = AppState.addEventListener('change', nextState => {
      if (
        appState.current.match(/background|inactive/) &&
        nextState === 'active'
      ) {
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
