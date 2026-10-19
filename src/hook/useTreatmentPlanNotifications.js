import {useCallback, useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {isPhcWorker} from '../utils/helper';
import {getTreatmentPlanRequest} from '../store/activity/actions';
import {
  TREATMENT_PLAN_EVENT,
  clearTreatmentPlanOutdated,
  isTreatmentPlanOutdated,
  markTreatmentPlanOutdated,
} from '../utils/treatmentPlanNotification';

export const useTreatmentPlanNotifications = (dispatch, profile, canFetch) => {
  const appState = useRef(AppState.currentState);
  // Read through a ref so a connection change doesn't re-subscribe the listeners
  const canFetchRef = useRef(canFetch);
  canFetchRef.current = canFetch;
  const isRefreshing = useRef(false);
  const hasPendingRefresh = useRef(false);

  // Treatment plans are for patients only; a PHC worker's requests go to the therapist service
  const isPatient = !!profile?.id && !isPhcWorker(profile.type);

  const refreshTreatmentPlan = useCallback(async () => {
    if (isRefreshing.current) {
      // Another update arrived mid-fetch: that response may predate it, so fetch again afterwards
      hasPendingRefresh.current = true;
      return;
    }

    isRefreshing.current = true;

    try {
      do {
        hasPendingRefresh.current = false;

        // Offline (or before the offline-login re-login): the flag stays set until the connection is back
        if (!isPatient || !canFetchRef.current || !(await isTreatmentPlanOutdated())) {
          break;
        }

        await clearTreatmentPlanOutdated();
        const isFetched = await dispatch(getTreatmentPlanRequest());

        if (!isFetched) {
          await markTreatmentPlanOutdated();
          break;
        }
      } while (hasPendingRefresh.current);
    } finally {
      isRefreshing.current = false;
    }
  }, [dispatch, isPatient]);

  useEffect(() => {
    // Foreground notifications: just refresh, the screens show the new plan
    const unsubOnMessage = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data?.event_type !== TREATMENT_PLAN_EVENT) return;

      await markTreatmentPlanOutdated();
      refreshTreatmentPlan();
    });

    // App resume: the background handler only flags the update, it can't fetch without the session
    const subscription = AppState.addEventListener('change', (nextState) => {
      // Only a real resume: toggling the network from Control Center / Quick Settings goes inactive -> active
      if (appState.current === 'background' && nextState === 'active') {
        refreshTreatmentPlan();
      }
      appState.current = nextState;
    });

    return () => {
      unsubOnMessage();
      subscription.remove();
    };
  }, [refreshTreatmentPlan]);

  // App start, back online, or the re-login after an offline login finished
  useEffect(() => {
    if (canFetch) {
      refreshTreatmentPlan();
    }
  }, [canFetch, refreshTreatmentPlan]);
};
