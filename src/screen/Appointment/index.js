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
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {Divider, Icon, ListItem, Text} from 'react-native-elements';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  getAppointmentsListRequest,
  cancelRequestToCancelAppointment,
} from '../../store/appointment/actions';
import {getTherapistRequest} from '../../store/therapist/actions';
import {getTherapistName} from '../../utils/therapist';
import {getLanguageRequest} from '../../store/language/actions';
import _ from 'lodash';
import moment from 'moment/min/moment-with-locales';
import {APPOINTMENT_STATUS} from '../../variables/constants';

const Appointment = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {profile} = useSelector((state) => state.user);
  const {therapists} = useSelector((state) => state.therapist);
  const {appointments, listInfo, loading} = useSelector(
    (state) => state.appointment,
  );
  const {languages} = useSelector((state) => state.language);
  const [appointmentObjs, setAppointmentObjs] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const swipeableRef = [];

  useEffect(() => {
    if (languages.length) {
      const language = languages.find((l) => l.id === profile.language_id);
      moment.locale(language ? language.code : '');
    }
  }, [languages, profile]);

  useEffect(() => {
    if (profile) {
      dispatch(
        getTherapistRequest({ids: JSON.stringify([profile.therapist_id])}),
      );
      dispatch(getLanguageRequest());
    }
  }, [profile, dispatch]);

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
      setAppointmentObjs([...appointmentObjs, ...appointments]);
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
          onPress: () => null,
        }}
      />
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
              styles.textWhite,
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
                styles.textWhite,
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
                  containerStyle={styles.appointmentSwipeableContainer}>
                  <ListItem
                    bottomDivider
                    containerStyle={styles.appointmentListContainer}>
                    <View style={styles.appointmentListLeftContent}>
                      <Text style={styles.appointmentListMonth}>
                        {moment
                          .utc(appointment.start_date)
                          .local()
                          .format('MMM')}
                      </Text>
                      <Text style={styles.appointmentListDay}>
                        {moment
                          .utc(appointment.start_date)
                          .local()
                          .format('DD')}
                      </Text>
                    </View>
                    <ListItem.Content>
                      <View style={styles.appointmentListRightContent}>
                        <Text
                          style={[styles.fontWeightBold, styles.textWarning]}>
                          {moment
                            .utc(appointment.start_date)
                            .local()
                            .format('hh:mm A')}
                          {' - '}
                          {moment
                            .utc(appointment.end_date)
                            .local()
                            .format('hh:mm A')}
                        </Text>
                        <Divider style={styles.marginY} />
                        <Text>{translate('appointment.appointment_with')}</Text>
                        <Text style={styles.fontWeightBold}>
                          {getTherapistName(
                            appointment.therapist_id,
                            therapists,
                          )}
                        </Text>
                        {appointment.status ===
                          APPOINTMENT_STATUS.REQUEST_CANCELLATION && (
                          <Text
                            style={[styles.textWarning, styles.marginTopMd]}>
                            {translate(
                              'appointment.pending_request_for_cancellation',
                            )}
                          </Text>
                        )}
                      </View>
                    </ListItem.Content>
                  </ListItem>
                </Swipeable>
              </View>
            ))}
          </View>
        ))}
        <View style={styles.appointmentShowMoreButtonWrapper}>
          {!loading && currentPage < listInfo.last_page && (
            <TouchableOpacity
              style={styles.appointmentShowMoreButton}
              onPress={() => showMore()}>
              <Text style={[styles.textWhite, styles.fontWeightBold]}>
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
