/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import _ from 'lodash';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Icon, Text} from 'react-native-elements';
import {getAppointmentsListRequest} from '../../store/appointment/actions';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import moment from 'moment/min/moment-with-locales';
import {ROUTES} from '../../variables/constants';
import AppointmentCard from './_Partials/AppointmentCard';
import {getProfessionRequest} from '../../store/profession/actions';
import {useNetInfo} from '@react-native-community/netinfo';
import SubmitRequestOverlay from './_Partials/SubmitRequestOverlay';
import {useIsDrawerOpen} from '@react-navigation/drawer';

const Appointment = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {profile} = useSelector((state) => state.user);
  const {appointments, listInfo, loading} = useSelector(
    (state) => state.appointment,
  );
  const isDrawerOpen = useIsDrawerOpen();

  const [appointmentObjs, setAppointmentObjs] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRequestOverlay, setShowRequestOverlay] = useState(false);
  const pageSize = 10;
  const netInfo = useNetInfo();

  useEffect(() => {
    dispatch(getProfessionRequest());
  }, [dispatch]);

  useEffect(() => {
    const tabNav = navigation.dangerouslyGetParent();
    if (isDrawerOpen) {
      tabNav.setOptions({tabBarVisible: false});
    }
    return () => {
      tabNav.setOptions({tabBarVisible: true});
    };
  }, [isDrawerOpen, navigation]);

  useEffect(() => {
    setAppointmentObjs(appointments);
    setCurrentPage(listInfo.current_page);
  }, [appointments, listInfo]);

  useEffect(() => {
    const groupedData = _.chain(appointmentObjs)
      .groupBy((item) =>
        moment.utc(item.start_date).local().format('MMMM YYYY'),
      )
      .map((value, key) => ({month: key, appointments: value}))
      .value();
    setGroupedAppointments(groupedData);
  }, [appointmentObjs]);

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

  const handleRequestAppointment = () => {
    setShowRequestOverlay(true);
  };

  return (
    <>
      <HeaderBar
        leftContent={{label: translate('tab.appointments')}}
        achievement={{
          hasAchievement: profile.kid_theme,
          onGoAchievement: () => navigation.navigate(ROUTES.ACHIEVEMENT),
        }}
        setting={{
          hasSetting: true,
          onGoSetting: () => navigation.toggleDrawer(),
        }}
      />

      {showRequestOverlay && (
        <SubmitRequestOverlay
          visible={setShowRequestOverlay}
          appointment={''}
          navigation={navigation}
        />
      )}

      <View style={styles.mainContainerLight}>
        <Button
          title={translate('appointment.request_new_appointment')}
          disabled={!netInfo.isConnected}
          onPress={handleRequestAppointment}
        />
      </View>

      <ScrollView
        style={styles.mainContainerLight}
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
              styles.textLightGrey,
              styles.fontWeightBold,
            ]}>
            {translate('appointment.no_appointment')}
          </Text>
        )}

        {groupedAppointments.map((group, index) => (
          <View key={index}>
            <Text style={[styles.fontWeightBold, styles.marginBottom]}>
              {group.month}
            </Text>
            {group.appointments.map((appointment, i) => (
              <View key={i} style={styles.appointmentListWrapper}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(ROUTES.APPOINTMENT_DETAIL, {
                      appointment,
                    })
                  }>
                  <AppointmentCard appointment={appointment} />
                </TouchableOpacity>
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
