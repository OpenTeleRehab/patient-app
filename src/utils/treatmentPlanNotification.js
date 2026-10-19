import notifee from '@notifee/react-native';
import {getLocalData, storeLocalData} from './local_storage';
import {STORAGE_KEY} from '../variables/constants';

export const TREATMENT_PLAN_EVENT = 'treatment_plan';

export const displayTreatmentPlanNotification = async (title, body) => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      localOnly: true,
      pressAction: {
        id: 'default',
      },
      smallIcon: 'ic_notification',
    },
  });
};

// Persisted rather than kept in memory: the push may arrive while the app is killed or offline,
// and the plan is fetched the next time the app is open with a connection.
export const markTreatmentPlanOutdated = () =>
  storeLocalData(STORAGE_KEY.TREATMENT_PLAN_OUTDATED, 'true');

export const clearTreatmentPlanOutdated = () =>
  storeLocalData(STORAGE_KEY.TREATMENT_PLAN_OUTDATED, 'false');

export const isTreatmentPlanOutdated = async () =>
  (await getLocalData(STORAGE_KEY.TREATMENT_PLAN_OUTDATED)) === 'true';
