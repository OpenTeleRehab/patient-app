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
  cancelRequestToCancelAppointment,
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
      dispatch(
        getAppointmentsListRequest({
          page_size: pageSize,
          page: currentPage + 1,
        }),
      );
    }
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
                {netInfo.isConnected ? (
                  <Swipeable
                    ref={(ref) => (swipeableRef[appointment.id] = ref)}
                    renderRightActions={(progress, dragX) =>
                      appointment.status ===
                      APPOINTMENT_STATUS.REQUEST_CANCELLATION
                        ? null
                        : renderRightActions(progress, dragX, appointment.id)
                    }
                    containerStyle={styles.borderRightRadius}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(ROUTES.APPOINTMENT_DETAIL, {
                          appointment,
                        })
                      }>
                      <AppointmentCard
                        appointment={appointment}
                        style={styles.noBorderTopRightRadius}
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
