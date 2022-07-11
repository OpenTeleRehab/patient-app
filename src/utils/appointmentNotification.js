import notifee, {TriggerType} from '@notifee/react-native';
import moment from 'moment';
import settings from '../../config/settings';
import {getTherapistName} from './therapist';

export const displayNotification = async (
  appointment,
  therapists,
  translate,
) => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  const date = moment(appointment.start_date)
    .subtract(settings.appointmentNotification, 'minutes')
    .toDate();

  // Create a time-based trigger
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(), // fire 10 minutes before meeting
  };

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      title:
        translate('appointment.appointment_with') +
        ' ' +
        getTherapistName(appointment.therapist_id, therapists),
      body:
        moment.utc(appointment.start_date).local().format('hh:mm A') +
        ' - ' +
        moment.utc(appointment.end_date).local().format('hh:mm A'),
      android: {
        channelId,
      },
    },
    trigger,
  );
};
