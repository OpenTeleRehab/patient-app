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
} from 'react-native';
import _ from 'lodash';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {Icon, Text} from 'react-native-elements';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  getAppointmentsListRequest,
  updateStatus,
} from '../../store/appointment/actions';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import moment from 'moment/min/moment-with-locales';
import {APPOINTMENT_STATUS, ROUTES} from '../../variables/constants';
import AppointmentCard from './_Partials/AppointmentCard';
import {getProfessionRequest} from '../../store/profession/actions';
import {useNetInfo} from '@react-native-community/netinfo';
import SubmitRequestOverlay from './_Partials/SubmitRequestOverlay';

const Appointment = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {appointments, listInfo, loading} = useSelector(
    (state) => state.appointment,
  );

  const [appointmentObjs, setAppointmentObjs] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRequestOverlay, setShowRequestOverlay] = useState(false);
  const pageSize = 10;
  const swipeableRef = [];
  const netInfo = useNetInfo();

  useEffect(() => {
    dispatch(getProfessionRequest());
  }, [dispatch]);

  useEffect(() => {
    if (appointments.length) {
      setAppointmentObjs(appointments);
      setCurrentPage(listInfo.current_page);
    }
  }, [appointments, listInfo]);

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

  const renderLeftActions = (progress, dragX, id) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    });
    return (
      <RectButton
        style={styles.appointmentAcceptButtonWrapper}
        onPress={() => handleAcceptPress(id)}>
        <Animated.Text
          style={[
            styles.appointmentActionButtonText,
            {transform: [{translateX: trans}]},
          ]}>
          {translate('appointment.invitation.accept')}
        </Animated.Text>
      </RectButton>
    );
  };

  const renderRightActions = (progress, dragX, id) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0.7, 0],
    });
    return (
      <RectButton
        style={styles.appointmentRejectButtonWrapper}
        onPress={() => handleRejectPress(id)}>
        <Animated.Text
          style={[
            styles.appointmentActionButtonText,
            {transform: [{translateX: trans}]},
          ]}>
          {translate('appointment.invitation.reject')}
        </Animated.Text>
      </RectButton>
    );
  };

  const showMore = () => {
    if (listInfo.last_page > currentPage) {
      dispatch(
        getAppointmentsListRequest({
          page_size: pageSize,
          page: currentPage + 1,
        }),
      );
    }
  };

  const handleAcceptPress = (id) => {
    Alert.alert(
      translate('appointment.invitation.accept_title'),
      translate('appointment.are_you_sure_to_accept_invitation'),
      [
        {text: translate('common.ok'), onPress: () => handleAcceptConfirm(id)},
        {text: translate('common.cancel'), onPress: () => handleClose(id)},
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
        {text: translate('common.cancel'), onPress: () => handleClose(id)},
      ],
      {cancelable: false},
    );
  };

  const handleAcceptConfirm = (id) => {
    swipeableRef[id].close();
    dispatch(
      updateStatus(id, {
        status: APPOINTMENT_STATUS.ACCEPTED,
      }),
    );
  };

  const handleRejectConfirm = (id) => {
    swipeableRef[id].close();
    dispatch(
      updateStatus(id, {
        status: APPOINTMENT_STATUS.REJECTED,
      }),
    );
  };

  const handleClose = (id) => {
    swipeableRef[id].close();
  };

  return (
    <>
      <HeaderBar
        leftContent={{label: translate('tab.appointments')}}
        rightContent={{
          label: translate('appointment.request_appointment'),
          onPress: () => setShowRequestOverlay(true),
          disabled: !netInfo.isConnected,
        }}
      />

      {showRequestOverlay && (
        <SubmitRequestOverlay visible={setShowRequestOverlay} />
      )}

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
                {netInfo.isConnected &&
                appointment.patient_status === APPOINTMENT_STATUS.INVITED ? (
                  <Swipeable
                    ref={(ref) => (swipeableRef[appointment.id] = ref)}
                    renderLeftActions={(progress, dragX) =>
                      renderLeftActions(progress, dragX, appointment.id)
                    }
                    renderRightActions={(progress, dragX) =>
                      renderRightActions(progress, dragX, appointment.id)
                    }
                    containerStyle={styles.borderRadius}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(ROUTES.APPOINTMENT_DETAIL, {
                          appointment,
                        })
                      }>
                      <AppointmentCard
                        appointment={appointment}
                        style={styles.noBorderRadius}
                      />
                    </TouchableOpacity>
                  </Swipeable>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(ROUTES.APPOINTMENT_DETAIL, {
                        appointment,
                      })
                    }>
                    <AppointmentCard appointment={appointment} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ))}
        <View style={styles.appointmentShowMoreButtonWrapper}>
          {!loading &&
            pageSize < listInfo.total_count &&
            currentPage < listInfo.last_page && (
              <TouchableOpacity
                disabled={!netInfo.isConnected}
                style={styles.appointmentShowMoreButton}
                onPress={() => showMore()}>
                <Text
                  style={[
                    netInfo.type !== 'unknown' && netInfo.isConnected === false
                      ? styles.textLightGrey
                      : styles.textLight,
                    styles.fontWeightBold,
                  ]}>
                  {translate('appointment.show_more', {
                    number: listInfo.total_count - currentPage * pageSize,
                  })}
                </Text>
                <Icon
                  name="chevron-down"
                  type="font-awesome"
                  color={netInfo.isConnected ? 'white' : 'darkgrey'}
                />
              </TouchableOpacity>
            )}
          {loading && <ActivityIndicator size={30} color="white" />}
        </View>
      </ScrollView>
    </>
  );
};

export default Appointment;
