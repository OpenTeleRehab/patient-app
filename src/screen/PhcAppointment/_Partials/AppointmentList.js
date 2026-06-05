/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import _ from 'lodash';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import moment from 'moment/min/moment-with-locales';
import AppointmentSection from './AppointmentSection';

const AppointmentList = ({appointments}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const groupAppointments = useMemo(() => {
    return _.chain(appointments)
      .groupBy((item) =>
        moment.utc(item.start_date).local().format('MMMM YYYY'),
      )
      .map((value, key) => ({month: key, appointments: value}))
      .value();
  }, [appointments]);

  return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={componentStyle.container}
        contentContainerStyle={
          (!groupAppointments.length )
            ? [styles.justifyContentCenter, componentStyle.contentContainer]
            : []
        }>
        {!groupAppointments.length && (
          <Text
            style={[
              styles.alignSelfCenter,
              styles.textLightGrey,
              styles.headerLeftTitleDark,
            ]}>
            {translate('phc.appointment.no_appointment')}
          </Text>
        )}
        {groupAppointments.length > 0 && (
          <AppointmentSection
            sectionData={groupAppointments}
          />
        )}
      </ScrollView>
  );
};

const componentStyle = StyleSheet.create({
  container: {
    padding: 12,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default AppointmentList;
