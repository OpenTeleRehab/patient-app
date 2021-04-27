/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native';
import _ from 'lodash';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {Divider, Icon, Text, Overlay, Button} from 'react-native-elements';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  getAppointmentsListRequest,
  requestAppointment,
  cancelRequestToCancelAppointment,
} from '../../store/appointment/actions';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import moment from 'moment/min/moment-with-locales';
import {APPOINTMENT_STATUS} from '../../variables/constants';
import SelectPicker from '../../components/Common/SelectPicker';
import AppointmentCard from './_Partials/AppointmentCard';
import {getProfessionRequest} from '../../store/profession/actions';

const Appointment = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {therapists} = useSelector((state) => state.therapist);
  const {professions} = useSelector((state) => state.profession);
  const {appointments, listInfo, loading} = useSelector(
    (state) => state.appointment,
  );

  const [appointmentObjs, setAppointmentObjs] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const [therapistId, setTherapistId] = useState('');
  const pageSize = 10;
  const swipeableRef = [];

  useEffect(() => {
    dispatch(getProfessionRequest());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getAppointmentsListRequest({
        page_size: pageSize,
        page: currentPage,
      }),
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (appointments.length) {
      if (currentPage === 1) {
        setAppointmentObjs(appointments);
      } else {
        setAppointmentObjs([...appointmentObjs, ...appointments]);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments]);

  useEffect(() => {
    if (appointmentObjs.length) {
      const groupedData = _.chain(appointmentObjs)
        .groupBy((item) =>
          moment.utc(item.start_date).local().format('MMMM YYYY'),
        )
        .map((value, key) => ({month: key, appointments: value}))
        .value();
      setGroupedAppointments(groupedData);
    }
  }, [appointmentObjs]);

  const renderRightActions = (progress, dragX, id) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    });
    return (
      <RectButton
        style={styles.appointmentCancelButtonWrapper}
        onPress={() => handleRequestCancelPress(id)}>
        <Animated.Text
          style={[
            styles.appointmentCancelButtonText,
            {transform: [{translateX: trans}]},
          ]}>
          {translate('appointment.request_cancel')}
        </Animated.Text>
      </RectButton>
    );
  };

  const showMore = () => {
    if (listInfo.last_page > currentPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getProfession = (id) => {
    const profession = professions.find((item) => item.id === id);

    return profession ? ' - ' + profession.name : '';
  };

  const handleRequestCancelPress = (id) => {
    Alert.alert(
      translate('appointment.request_to_cancel'),
      translate('appointment.are_you_sure_to_request_for_cancellation'),
      [
        {text: translate('common.ok'), onPress: () => handleConfirm(id)},
        {text: translate('common.cancel'), onPress: () => handleClose(id)},
      ],
      {cancelable: false},
    );
  };

  const handleConfirm = (id) => {
    swipeableRef[id].close();
    dispatch(
      cancelRequestToCancelAppointment(id, {
        status: APPOINTMENT_STATUS.REQUEST_CANCELLATION,
      }),
    ).then((result) => {
      if (result) {
        const newAppointmentObjs = [...appointmentObjs];
        newAppointmentObjs.find((appointment) => appointment.id === id).status =
          APPOINTMENT_STATUS.REQUEST_CANCELLATION;
        setAppointmentObjs(newAppointmentObjs);
      }
    });
  };

  const handleClose = (id) => {
    swipeableRef[id].close();
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setTherapistId('');
  };

  const handleRequestAppoint = () => {
    if (therapistId) {
      dispatch(
        requestAppointment({
          therapist_id: therapistId,
        }),
      ).then((result) => {
        if (result) {
          handleCloseOverlay();
          if (Platform.OS === 'ios') {
            Alert.alert(
              translate('appointment'),
              translate('appointment.request_has_been_submitted_successfully'),
            );
          } else {
            ToastAndroid.show(
              translate('appointment.request_has_been_submitted_successfully'),
              ToastAndroid.SHORT,
            );
          }
        }
      });
    } else {
      Alert.alert(
        translate('appointment').toString(),
        translate('error.message.therapist').toString(),
        [
          {
            text: translate('common.ok').toString(),
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <>
      <HeaderBar
        leftContent={{label: translate('tab.appointments')}}
        rightContent={{
          label: translate('appointment.request_appointment'),
          onPress: () => setShowOverlay(true),
        }}
      />
      <Overlay
        isVisible={showOverlay}
        overlayStyle={styles.appointmentOverlayContainer}>
        <>
          <Text
            style={[
              styles.fontWeightBold,
              styles.leadText,
              styles.textDefault,
              styles.marginBottomMd,
            ]}>
            {translate('appointment.request_appointment')}
          </Text>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, styles.textSmall]}>
              {translate('appointment.choose_therapist')}
            </Text>
            <SelectPicker
              placeholder={{
                label: translate('appointment.choose_therapist'),
                value: null,
              }}
              items={therapists.map((therapist) => ({
                label:
                  therapist.last_name +
                  ' ' +
                  therapist.first_name +
                  getProfession(therapist.profession_id),
                value: therapist.id,
              }))}
              value={therapistId}
              onValueChange={(value) => setTherapistId(value)}
            />
            <Divider style={styles.marginBottomMd} />
            <View style={styles.appointmentOverlayButtonsWrapper}>
              <Button
                title={translate('common.submit')}
                titleStyle={[styles.textUpperCase]}
                containerStyle={styles.appointmentOverlayLeftButtonContainer}
                onPress={() => handleRequestAppoint()}
              />
              <Button
                title={translate('common.cancel')}
                titleStyle={[styles.textUpperCase]}
                containerStyle={styles.appointmentOverlayRightButtonContainer}
                onPress={() => handleCloseOverlay()}
              />
            </View>
          </View>
        </>
      </Overlay>
      <ScrollView
        style={styles.mainContainerPrimary}
        contentContainerStyle={
          !groupedAppointments.length
            ? [styles.flexColumn, styles.justifyContentCenter]
            : []
        }>
        {!groupedAppointments.length && !loading && (
          <Text
            h4
            style={[
              styles.alignSelfCenter,
              styles.textLight,
              styles.fontWeightBold,
            ]}>
            {translate('appointment.no_appointment')}
          </Text>
        )}
        {groupedAppointments.map((group, index) => (
          <View key={index}>
            <Text
              style={[
                styles.fontWeightBold,
                styles.textLight,
                styles.marginBottom,
              ]}>
              {group.month}
            </Text>
            {group.appointments.map((appointment, i) => (
              <View key={i} style={styles.appointmentListWrapper}>
                <Swipeable
                  ref={(ref) => (swipeableRef[appointment.id] = ref)}
                  renderRightActions={(progress, dragX) =>
                    appointment.status ===
                    APPOINTMENT_STATUS.REQUEST_CANCELLATION
                      ? null
                      : renderRightActions(progress, dragX, appointment.id)
                  }
                  containerStyle={styles.borderRightRadius}>
                  <AppointmentCard
                    appointment={appointment}
                    style={styles.noBorderTopRightRadius}
                  />
                </Swipeable>
              </View>
            ))}
          </View>
        ))}
        <View style={styles.appointmentShowMoreButtonWrapper}>
          {!loading &&
            pageSize < listInfo.total_count &&
            currentPage < listInfo.last_page && (
              <TouchableOpacity
                style={styles.appointmentShowMoreButton}
                onPress={() => showMore()}>
                <Text style={[styles.textLight, styles.fontWeightBold]}>
                  {translate('appointment.show_more', {
                    number: listInfo.total_count - currentPage * pageSize,
                  })}
                </Text>
                <Icon name="chevron-down" type="font-awesome" color="white" />
              </TouchableOpacity>
            )}
          {loading && <ActivityIndicator size={30} color="white" />}
        </View>
      </ScrollView>
    </>
  );
};

export default Appointment;
