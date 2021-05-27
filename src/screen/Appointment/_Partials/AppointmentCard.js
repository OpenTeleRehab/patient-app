/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Divider, Icon, ListItem, Text} from 'react-native-elements';
import moment from 'moment/min/moment-with-locales';

import {View} from 'react-native';
import styles from '../../../assets/styles';
import {getTherapistName} from '../../../utils/therapist';
import {APPOINTMENT_STATUS} from '../../../variables/constants';

const AppointmentCard = ({appointment, style}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {therapists} = useSelector((state) => state.therapist);

  return (
    <ListItem
      bottomDivider
      containerStyle={[styles.appointmentListContainer, style]}>
      <View style={styles.appointmentListLeftContent}>
        <Text style={styles.appointmentListMonth}>
          {moment.utc(appointment.start_date).local().format('MMM')}
        </Text>
        <Text style={styles.appointmentListDay}>
          {moment.utc(appointment.start_date).local().format('DD')}
        </Text>
      </View>
      <ListItem.Content>
        <View style={styles.appointmentListRightContent}>
          <Text style={[styles.fontWeightBold, styles.textWarning]}>
            {moment.utc(appointment.start_date).local().format('hh:mm A')}
            {' - '}
            {moment.utc(appointment.end_date).local().format('hh:mm A')}
          </Text>
          <Divider style={styles.marginY} />
          <Text>{translate('appointment.appointment_with')}</Text>
          <Text style={styles.fontWeightBold}>
            {getTherapistName(appointment.therapist_id, therapists)}
          </Text>
          {appointment.status === APPOINTMENT_STATUS.REQUEST_CANCELLATION && (
            <Text style={[styles.textWarning, styles.marginTopMd]}>
              {translate('appointment.pending_request_for_cancellation')}
            </Text>
          )}
        </View>
        {appointment.note && appointment.note.trim() !== '' && (
          <View style={[styles.alignSelfEnd, styles.marginRight]}>
            <Icon name="event-note" size={22} />
          </View>
        )}
      </ListItem.Content>
    </ListItem>
  );
};

export default AppointmentCard;
