/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {Divider, Text, Button, Icon} from 'react-native-elements';
import moment from 'moment/min/moment-with-locales';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {APPOINTMENT_STATUS, ROUTES} from '../../variables/constants';
import {ScrollView, View, Alert} from 'react-native';
import {getTherapistName} from '../../utils/therapist';
import {
  deleteAppointment,
  getAppointmentsListRequest,
  updateStatus,
} from '../../store/appointment/actions';
import SubmitRequestOverlay from './_Partials/SubmitRequestOverlay';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNetInfo} from '@react-native-community/netinfo';

const AppointmentDetail = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {appointment} = route.params;
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {therapists} = useSelector((state) => state.therapist);
  const [showRequestOverlay, setShowRequestOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const netInfo = useNetInfo();

  useEffect(() => {
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    };
  }, [navigation]);

  const handleRemove = () => {
    Alert.alert(
      translate('appointment.alert.title'),
      translate('appointment.alert.content'),
      [
        {
          text: translate('common.cancel'),
          style: 'cancel',
        },
        {
          text: translate('common.ok'),
          onPress: () => {
            setIsLoading(true);
            dispatch(deleteAppointment(appointment.id)).then((res) => {
              setIsLoading(false);
              if (res) {
                dispatch(getAppointmentsListRequest({page_size: 10, page: 1}));
                navigation.navigate(ROUTES.APPOINTMENT);
              }
            });
          },
        },
      ],
    );
  };

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

  const handleGoBack = () => {
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    navigation.navigate(ROUTES.APPOINTMENT);
  };

  return (
    <>
      <HeaderBar
        leftContent={
          <Text numberOfLines={1} h4>
            {translate('appointment')}
          </Text>
        }
        rightContent={{
          label: translate('common.close'),
          onPress: () => handleGoBack(),
        }}
      />
      <ScrollView style={styles.mainContainerLight}>
        <Text style={[styles.fontWeightBold, styles.textPrimary]}>
          {moment.utc(appointment.start_date).local().format('DD MMM YYYY')}
        </Text>
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
        {appointment.note && appointment.note.trim() !== '' && (
          <>
            <Divider style={styles.marginY} />
            <Text>{appointment.note}</Text>
          </>
        )}
        <Divider style={styles.marginY} />
        {!appointment.created_by_therapist && (
          <View style={[styles.flexRow]}>
            <Button
              icon={
                <Icon
                  name="edit"
                  size={15}
                  type="font-awesome-5"
                  color="white"
                />
              }
              title={translate('common.edit')}
              titleStyle={styles.marginLeftSm}
              disabled={appointment.created_by_therapist}
              onPress={() => setShowRequestOverlay(true)}
            />
            <Button
              icon={
                <Icon
                  name="trash-alt"
                  size={15}
                  type="font-awesome-5"
                  color="white"
                />
              }
              title={translate('common.delete')}
              containerStyle={styles.marginLeft}
              buttonStyle={styles.bgDanger}
              titleStyle={styles.marginLeftSm}
              onPress={handleRemove}
            />
          </View>
        )}
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
        {showRequestOverlay && (
          <SubmitRequestOverlay
            visible={setShowRequestOverlay}
            appointment={appointment}
            navigation={navigation}
          />
        )}

        <Spinner
          visible={isLoading}
          textContent={translate('common.loading')}
          overlayColor="rgba(0, 0, 0, 0.75)"
          textStyle={styles.textLight}
        />
      </ScrollView>
    </>
  );
};

export default AppointmentDetail;
