/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {
  Divider,
  Icon,
  ListItem,
  Text,
  withTheme,
  Button,
} from 'react-native-elements';
import moment from 'moment/min/moment-with-locales';
import {useNetInfo} from '@react-native-community/netinfo';
import {displayNotification} from '../../../utils/appointmentNotification';
import {updateStatus} from '../../../store/appointment/actions';
import Spinner from 'react-native-loading-spinner-overlay';

import {View, Alert} from 'react-native';
import styles from '../../../assets/styles';
import {getTherapistName} from '../../../utils/therapist';
import {APPOINTMENT_STATUS, ROUTES} from '../../../variables/constants';
import {getAssistiveTechnologyName} from '../../../utils/assistiveTechnology';

const AppointmentCard = ({appointment, style, theme, navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {therapists} = useSelector((state) => state.therapist);
  const {therapist_status, patient_status} = appointment;
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

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
  useEffect(() => {
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    };
  }, [navigation]);

  const handleAcceptPress = (id) => {
    Alert.alert(
      translate('appointment.invitation.accept_title'),
      translate('appointment.are_you_sure_to_accept_invitation'),
      [
        {text: translate('common.ok'), onPress: () => handleAcceptConfirm(id)},
        {text: translate('common.cancel'), style: 'cancel'},
      ],
      {cancelable: false},
    );
  };

  const handleRejectPress = (id) => {
    Alert.alert(
      translate('appointment.invitation.reject_title'),
      translate('appointment.are_you_sure_to_reject_invitation'),
      [
        {text: translate('common.ok'), onPress: () => handleRejectConfirm(id)},
        {text: translate('common.cancel'), style: 'cancel'},
      ],
      {cancelable: false},
    );
  };

  const handleAcceptConfirm = (id) => {
    dispatch(
      updateStatus(id, {
        status: APPOINTMENT_STATUS.ACCEPTED,
      }),
    ).then((res) => {
      setIsLoading(false);
      if (res) {
        displayNotification(appointment, therapists, translate);
        navigation.navigate(ROUTES.APPOINTMENT);
      }
    });
  };

  const handleRejectConfirm = (id) => {
    dispatch(
      updateStatus(id, {
        status: APPOINTMENT_STATUS.REJECTED,
      }),
    ).then((res) => {
      setIsLoading(false);
      if (res) {
        navigation.navigate(ROUTES.APPOINTMENT);
      }
    });
  };

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
        <Divider style={styles.marginY} />
        {appointment.created_by_therapist && (
          <View style={[styles.flexRow]}>
            <Button
              icon={
                <Icon
                  name="calendar-check"
                  size={15}
                  type="font-awesome-5"
                  color="white"
                />
              }
              title={translate('appointment.invitation.accept')}
              titleStyle={styles.marginLeftSm}
              disabled={
                !netInfo.isConnected ||
                appointment.patient_status === APPOINTMENT_STATUS.ACCEPTED
              }
              onPress={() => handleAcceptPress(appointment.id)}
            />
            <Button
              icon={
                <Icon
                  name="calendar-times"
                  size={15}
                  type="font-awesome-5"
                  color="white"
                />
              }
              title={translate('appointment.invitation.reject')}
              containerStyle={styles.marginLeft}
              buttonStyle={styles.bgDanger}
              titleStyle={styles.marginLeftSm}
              disabled={
                !netInfo.isConnected ||
                appointment.patient_status === APPOINTMENT_STATUS.REJECTED
              }
              onPress={() => handleRejectPress(appointment.id)}
            />
          </View>
        )}
        <Spinner
          visible={isLoading}
          textContent={translate('common.loading')}
          overlayColor="rgba(0, 0, 0, 0.75)"
          textStyle={styles.textLight}
        />
      </ListItem.Content>
    </ListItem>
  );
};

export default withTheme(AppointmentCard);
