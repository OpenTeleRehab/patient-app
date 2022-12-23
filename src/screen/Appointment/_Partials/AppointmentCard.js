/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Divider, Icon, ListItem, Text, withTheme} from 'react-native-elements';
import moment from 'moment/min/moment-with-locales';

import {View} from 'react-native';
import styles from '../../../assets/styles';
import {getTherapistName} from '../../../utils/therapist';
import {APPOINTMENT_STATUS} from '../../../variables/constants';
import {getAssistiveTechnologyName} from '../../../utils/assistiveTechnology';

const AppointmentCard = ({appointment, style, theme}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {therapists} = useSelector((state) => state.therapist);
  const {therapist_status, patient_status} = appointment;

  let additionDateStyle = {};
  let additionTextStyle = {};
  let statusTextStyle = {
    color: theme.colors.primary,
  };
  let statusText = 'appointment.status.accept';
  if ([therapist_status, patient_status].includes(APPOINTMENT_STATUS.INVITED)) {
    statusTextStyle = {color: theme.colors.dark};
    statusText = 'appointment.status.pending';
  } else if (
    [therapist_status, patient_status].includes(APPOINTMENT_STATUS.REJECTED)
  ) {
    additionTextStyle = {textDecorationLine: 'line-through'};
    statusTextStyle = {color: theme.colors.orange};
    statusText = 'appointment.status.cancel';
  }

  return (
    <ListItem
      bottomDivider
      containerStyle={[styles.appointmentListContainer, style]}>
      <View style={[styles.appointmentListLeftContent, additionDateStyle]}>
        <Text style={styles.appointmentListMonth}>
          {moment.utc(appointment.start_date).local().format('MMM')}
        </Text>
        <Text style={styles.appointmentListDay}>
          {moment.utc(appointment.start_date).local().format('DD')}
        </Text>
      </View>
      <ListItem.Content>
        <View style={styles.appointmentListRightContent}>
          <Text
            style={[
              styles.fontWeightBold,
              styles.textWarning,
              additionTextStyle,
            ]}>
            {moment.utc(appointment.start_date).local().format('hh:mm A')}
            {' - '}
            {moment.utc(appointment.end_date).local().format('hh:mm A')}
          </Text>
          <Divider style={styles.marginY} />
          <Text style={additionTextStyle}>
            {translate('appointment.appointment_with')}
          </Text>
          <Text style={[styles.fontWeightBold, additionTextStyle]}>
            {getTherapistName(appointment.therapist_id, therapists)}
          </Text>
          {appointment.assistive_technology ? (
            <Text style={styles.marginTop} numberOfLines={1}>
              {translate('appointment.at_follow_up', {
                name: getAssistiveTechnologyName(
                  appointment.assistive_technology.assistive_technology_id,
                ),
              })}
              {appointment.note && ' : ' + appointment.note}
            </Text>
          ) : (
            <Text
              style={appointment.note && styles.marginTop}
              numberOfLines={1}>
              {appointment.note}
            </Text>
          )}
          <View
            style={[
              styles.paddingY,
              styles.appointmentStatus,
              !(appointment.note && appointment.note.trim() !== '') &&
                styles.appointmentStatusAdditionalSpace,
            ]}>
            <Text style={[styles.fontWeightBold, statusTextStyle]}>
              {translate(statusText)}
            </Text>
            {!appointment.created_by_therapist && (
              <Text>
                <Icon
                  name="person"
                  size={20}
                  type="material"
                  color={theme.colors.primary}
                />
              </Text>
            )}
          </View>
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

export default withTheme(AppointmentCard);
