/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
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

import {View, Alert, StyleSheet} from 'react-native';
import styles from '../../../assets/styles';
import {APPOINTMENT_STATUS} from '../../../variables/constants';
import CreateOrEditAppointment from './CreateOrEdit';
import {
  deleteAppointmentWithPatient,
  updateAppointmentWithPatientStatus,
  deleteAppointment,
  acceptAppointment,
  declineAppointment
} from '../../../store/phcAppointment/actions';
import {useShowToast} from '../../../hook/useShowToast';
import variables from '../../../assets/styles/variables';

const AppointmentCard = ({theme, appointment}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const showToast = useShowToast();
  const {profile} = useSelector((state) => state.user);
  const {therapist_status, patient_status, requester_status, recipient_status} = appointment;
  const netInfo = useNetInfo();
  const dispatch = useDispatch();
  const [showEditForm, setShowEditForm] = useState(false);

  let additionDateStyle = {};
  let additionTextStyle = {};
  let statusTextStyle = {
    color: theme.colors.primary,
    fontWeight:'bold'
  };
  let statusText = 'phc.appointment.status.accept';
  if ([therapist_status, patient_status, requester_status, recipient_status].includes(APPOINTMENT_STATUS.INVITED)) {
    statusTextStyle = {color: theme.colors.dark, fontWeight:'bold'};
    statusText = 'phc.appointment.status.pending';
  } else if (
    [therapist_status, patient_status, requester_status, recipient_status].includes(APPOINTMENT_STATUS.REJECTED)
  ) {
    additionTextStyle = {textDecorationLine: 'line-through'};
    statusTextStyle = {color: theme.colors.orange, fontWeight:'bold'};
    statusText = 'phc.appointment.status.cancel';
  }

  const handleAccept = () => {
    Alert.alert(
      translate('phc.appointment.invitation.accept'),
      translate('phc.appointment.invitation.accept.confirm_message'),
      [
        {text: translate('common.ok'), onPress: handleAcceptConfirm},
        {text: translate('common.cancel'), style: 'cancel'},
      ],
      {cancelable: false},
    );
  };

  const handleReject = () => {
    Alert.alert(
      translate('phc.appointment.invitation.decline'),
      translate('phc.appointment.invitation.decline.confirm_message'),
      [
        {text: translate('common.ok'), onPress: handleRejectConfirm},
        {text: translate('common.cancel'), style: 'cancel'},
      ],
      {cancelable: false},
    );
  };

  const handleCancel = () => {
    Alert.alert(
      translate('phc.appointment.cancel'),
      translate('phc.appointment.cancel.confirm_message'),
      [
        {
          text: translate('common.ok'),
          onPress: handleCancelConfirm,
        },
        {
          text: translate('common.cancel'),
          style: 'cancel',
        },
      ],
    );
  };

  const handleCancelConfirm = () => {
    if (appointment.patient_id) {
      dispatch(deleteAppointmentWithPatient(appointment.id)).then((res) => {
        if (res.success) {
          showToast(
            translate(
              'phc.appointment.message.cancel_success',
            ),
            translate('phc.appointment.cancel')
          );
        } else {
          showToast(
            translate(translate(res.message)),
            translate('phc.appointment.cancel')
          );
        }
      });
      return;
    }

    dispatch(deleteAppointment(appointment.id)).then((res) => {
      if (res.success) {
        showToast(
          translate(
            'phc.appointment.message.cancel_success',
          ),
          translate('phc.appointment.cancel')
        );
      } else {
        showToast(
          translate(translate(res.message)),
          translate('phc.appointment.cancel')
        );
      }
    });
  };

  const handleAcceptConfirm = () => {
    if (appointment.patient_id) {
      dispatch(updateAppointmentWithPatientStatus(appointment.id, {therapist_status: APPOINTMENT_STATUS.ACCEPTED})).then((res) => {
        if (res.success) {
          showToast(
            translate(
              'phc.appointment.message.accept_success',
            ),
            translate('phc.appointment.invitation.accept')
          );
        } else {
          showToast(
            translate(translate(res.message)),
            translate('phc.appointment.invitation.accept')
          );
        }
      });
      return;
    }
    dispatch(acceptAppointment(appointment.id)).then((res) => {
      if (res.success) {
        showToast(
          translate(
            'phc.appointment.message.accept_success',
          ),
          translate('phc.appointment.invitation.accept')
        );
      } else {
        showToast(
          translate(translate(res.message)),
          translate('phc.appointment.invitation.accept')
        );
      }
    });
  };

  const handleRejectConfirm = () => {
    if (appointment.patient_id) {
      dispatch(updateAppointmentWithPatientStatus(appointment.id, {therapist_status: APPOINTMENT_STATUS.REJECTED})).then((res) => {
        if (res.success) {
          showToast(
            translate(
              'phc.appointment.message.decline_success',
            ),
            translate('phc.appointment.invitation.decline')
          );
        } else {
          showToast(
            translate(translate(res.message)),
            translate('phc.appointment.invitation.decline')
          );
        }
      });
      return;
    }
    dispatch(declineAppointment(appointment.id)).then((res) => {
      if (res.success) {
        showToast(
          translate(
            'phc.appointment.message.decline_success',
          ),
          translate('phc.appointment.invitation.decline')
        );
      } else {
        showToast(
          translate(translate(res.message)),
          translate('phc.appointment.invitation.decline')
        );
      }
    });
  };

  const isPast = (datetime) => {
    return datetime.isBefore(moment());
  };

  const editDisabled =
    !netInfo.isConnected || isPast(moment.utc(appointment.start_date).local()) ||
    appointment.patient_status === APPOINTMENT_STATUS.ACCEPTED || appointment.patient_status === APPOINTMENT_STATUS.REJECTED ||
    appointment.recipient_status === APPOINTMENT_STATUS.ACCEPTED || appointment.recipient_status === APPOINTMENT_STATUS.REJECTED;

  const isOwner = appointment.created_by_therapist || (appointment.requester_id === profile.id);
  const userStatus = appointment.therapist_status ? appointment.therapist_status : isOwner ? appointment.requester_status : appointment.recipient_status;

  const appointmentWith=()=>{
    if(appointment.with_user_type){
      return `phc.appointment.${appointment.with_user_type}`
    }else{
      return 'phc.appointment.patient'
    }
  }

  return (
    <>
      <ListItem
        bottomDivider
        containerStyle={[styles.appointmentListContainer]}>
        <View style={[componentStyle.leftContainer, additionDateStyle]}>
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
              {translate('phc.appointment.appointment_with')} <Text style={styles.fontWeightBold}>{translate(appointmentWith())}</Text> {appointment.type && <Text>({translate(`appointment.type.${appointment.type}`)})</Text>}
            </Text>
            <Text style={[componentStyle.nameText, additionTextStyle]}>
              {appointment.patient
                ? `${appointment.patient.last_name} ${appointment.patient.first_name}`
                : isOwner ? `${appointment?.recipient.last_name} ${appointment?.recipient.first_name}` : `${appointment?.requester.last_name} ${appointment?.requester.first_name}`}
            </Text>
            {appointment.note && (
              <View style={componentStyle.noteContainer}>
                <Text>
                  {appointment.note}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.paddingY,
                styles.appointmentStatus,
                !(appointment.note && appointment.note.trim() !== '') &&
                  styles.appointmentStatusAdditionalSpace,
              ]}>
              <Text style={statusTextStyle}>
                {translate(statusText)}
              </Text>
            </View>
          </View>
          {isOwner && (
            <View
              style={[styles.flexRow, styles.flexWrap, styles.alignSelfStart]}>
              <Button
                icon={
                  <Icon
                    name="edit"
                    size={20}
                    type="feather"
                    color={theme.colors.white}
                  />
                }
                containerStyle={[
                  styles.marginRight,
                  styles.marginBottom,
                ]}
                title={translate('phc.appointment.button.edit')}
                titleStyle={styles.marginLeftSm}
                buttonStyle={componentStyle.buttonStyle}
                disabled={editDisabled}
                onPress={() => setShowEditForm(true)}
              />
              <Button
                icon={
                  <Icon
                    name="trash"
                    size={15}
                    type="font-awesome-5"
                    color={theme.colors.white}
                  />
                }
                title={translate('phc.appointment.button.cancel')}
                buttonStyle={[componentStyle.buttonStyle, componentStyle.cancelButtonStyle]}
                titleStyle={styles.marginLeftSm}
                textStyle={styles.textLight}
                onPress={handleCancel}
                disabled={isPast(moment.utc(appointment.start_date).local())}
              />
            </View>
          )}
          {!isOwner && !(userStatus === APPOINTMENT_STATUS.REJECTED || isPast(moment.utc(appointment.start_date).local())) && (
            <View
              style={[styles.flexRow, styles.flexWrap, styles.alignSelfStart, styles.marginBottom]}>
              {!(userStatus === APPOINTMENT_STATUS.ACCEPTED || isPast(moment.utc(appointment.start_date).local())) && (
                <Button
                  icon={
                    <Icon
                      name="calendar-check"
                      size={20}
                      type="font-awesome-5"
                      color={theme.colors.white}
                    />
                  }
                  containerStyle={[
                    styles.marginRight,
                    styles.marginBottom,
                  ]}
                  title={translate('phc.appointment.button.accept')}
                  titleStyle={styles.marginLeftSm}
                  buttonStyle={componentStyle.buttonStyle}
                  onPress={handleAccept}
                />
              )}
              <Button
                icon={
                  <Icon
                    name="calendar-times"
                    size={15}
                    type="font-awesome-5"
                    color={theme.colors.white}
                  />
                }
                title={translate('phc.appointment.button.decline')}
                buttonStyle={[componentStyle.buttonStyle, componentStyle.cancelButtonStyle]}
                titleStyle={styles.marginLeftSm}
                textStyle={styles.textLight}
                onPress={handleReject}
                disabled={userStatus === APPOINTMENT_STATUS.REJECTED || isPast(moment.utc(appointment.start_date).local())}
              />
            </View>
          )}
        </ListItem.Content>
      </ListItem>
      {showEditForm && (
        <CreateOrEditAppointment
          visible={showEditForm}
          setVisible={setShowEditForm}
          appointment={appointment}
        />
      )}
    </>
  );
};

const componentStyle = StyleSheet.create({
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: variables.primary,
  },
  leftContainer: {
    backgroundColor: variables.primary,
    color: variables.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    width: 100,
    height: '100%',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  cancelButtonStyle: {
    backgroundColor: variables.danger,
  },
});

export default withTheme(AppointmentCard);
