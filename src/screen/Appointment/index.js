/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
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
import colors from '../../assets/styles/variables/colors';
import Spinner from 'react-native-loading-spinner-overlay';

const Appointment = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {appointments, listInfo, loading} = useSelector(
    (state) => state.appointment,
  );

  const [showRequestOverlay, setShowRequestOverlay] = useState(false);
  const netInfo = useNetInfo();
  const isOnline = !!netInfo.isConnected;

  const currentPage = listInfo.current_page || 1;
  const hasMore = currentPage < listInfo.last_page;
  const remainingCount = listInfo.total_count - appointments.length;

  useEffect(() => {
    dispatch(getProfessionRequest());
  }, [dispatch]);

  const groupedAppointments = useMemo(
    () =>
      _.chain(appointments)
        .groupBy((item) =>
          moment.utc(item.start_date).local().format('MMMM YYYY'),
        )
        .map((value, key) => ({month: key, appointments: value}))
        .value(),
    [appointments],
  );

  const loadMoreAppointments = () => {
    if (loading || !hasMore || !isOnline) {
      return;
    }
    dispatch(
      getAppointmentsListRequest({
        page: currentPage + 1,
      }),
    );
  };

  const handleRequestAppointment = () => {
    setShowRequestOverlay(true);
  };

  return (
    <>
      <HeaderBar leftContent={{label: translate('tab.appointments')}} />

      {showRequestOverlay && (
        <SubmitRequestOverlay
          visible={setShowRequestOverlay}
          appointment={''}
          navigation={navigation}
        />
      )}

      <Button
        title={translate('appointment.request_new_appointment')}
        disabled={!isOnline}
        onPress={handleRequestAppointment}
        containerStyle={[styles.paddingX, styles.paddingY]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          !groupedAppointments.length
            ? [styles.flexColumn, styles.justifyContentCenter]
            : []
        }
        style={[styles.paddingX, styles.paddingY]}
      >
        {!groupedAppointments.length && !loading && (
          <Text
            style={[
              styles.alignSelfCenter,
              styles.textLightGrey,
              styles.headerLeftTitleDark,
            ]}
          >
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
                  }
                >
                  <AppointmentCard appointment={appointment} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        <View style={styles.appointmentShowMoreButtonWrapper}>
          {!loading && hasMore && (
            <TouchableOpacity
              disabled={!isOnline}
              style={styles.appointmentShowMoreButton}
              onPress={loadMoreAppointments}
            >
              <Text
                style={[
                  isOnline ? styles.textBlack : styles.textLightGrey,
                  styles.fontWeightBold,
                ]}
              >
                {translate('appointment.show_more', {
                  number: remainingCount,
                })}
              </Text>
              <Icon
                name="chevron-down"
                type="font-awesome"
                color={isOnline ? colors.grey1 : colors.grey4}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Spinner
        visible={loading}
        overlayColor="rgba(0, 0, 0, 0.5)"
        textStyle={styles.textLight}
      />
    </>
  );
};

export default Appointment;
