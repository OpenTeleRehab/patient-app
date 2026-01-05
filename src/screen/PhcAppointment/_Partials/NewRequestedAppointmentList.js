/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import _ from 'lodash';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import moment from 'moment/min/moment-with-locales';
import {PHC_APPOINTMENT_RECIPIENT_TYPE} from '../../../variables/appointment';
import AppointmentSection from './AppointmentSection';

const NewRequestedAppointmentList = ({appointmentWithPatients, appointments}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [groupedAppointmentWithPatients, setGroupedAppointmentWithPatients] = useState([]);
  const [groupedAppointmentWithTherapists, setGroupedAppointmentWithTherapists] = useState([]);
  const [groupedAppointmentWithPhcWorkers, setGroupedAppointmentWithPhcWorkers] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    patient: true,
    phcWorker: true,
    therapist: true,
  });

  useEffect(() => {
    const groupedData = _.chain(appointmentWithPatients)
      .groupBy((item) =>
        moment.utc(item.start_date).local().format('MMMM YYYY'),
      )
      .map((value, key) => ({month: key, appointments: value}))
      .value();
    setGroupedAppointmentWithPatients(groupedData);
  }, [appointmentWithPatients]);

  useEffect(() => {
    const therapistGroupedData = _.chain(appointments)
      .filter(item => item.with_user_type === PHC_APPOINTMENT_RECIPIENT_TYPE.THERAPIST)
      .groupBy((item) =>
        moment.utc(item.start_date).local().format('MMMM YYYY'),
      )
      .map((value, key) => ({month: key, appointments: value}))
      .value();
    const phcWorkerGroupedData = _.chain(appointments)
      .filter(item => item.with_user_type === PHC_APPOINTMENT_RECIPIENT_TYPE.PHC_WORKER)
      .groupBy((item) =>
        moment.utc(item.start_date).local().format('MMMM YYYY'),
      )
      .map((value, key) => ({month: key, appointments: value}))
      .value();
    setGroupedAppointmentWithTherapists(therapistGroupedData);
    setGroupedAppointmentWithPhcWorkers(phcWorkerGroupedData);
  }, [appointments]);

  const toggleSection = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={componentStyle.container}
      contentContainerStyle={
        (!groupedAppointmentWithPatients.length &&
          !groupedAppointmentWithTherapists.length &&
          !groupedAppointmentWithPhcWorkers.length)
          ? [styles.justifyContentCenter, componentStyle.contentContainer]
          : []
      }>
      {!groupedAppointmentWithPatients.length && !groupedAppointmentWithTherapists.length && !groupedAppointmentWithPhcWorkers.length && (
        <Text
          style={[
            styles.alignSelfCenter,
            styles.textLightGrey,
            styles.headerLeftTitleDark,
          ]}>
          {translate('phc.appointment.no_appointment')}
        </Text>
      )}

      {groupedAppointmentWithPatients.length > 0 && (
        <AppointmentSection
          title={translate('phc.appointment.with_patient')}
          expanded={expandedSections.patient}
          onToggle={() => toggleSection('patient')}
          sectionData={groupedAppointmentWithPatients}
        />
      )}

      {groupedAppointmentWithPhcWorkers.length > 0 && (
        <AppointmentSection
          title={translate('phc.appointment.with_phc_worker')}
          expanded={expandedSections.phcWorker}
          onToggle={() => toggleSection('phcWorker')}
          sectionData={groupedAppointmentWithPhcWorkers}
        />
      )}

      {groupedAppointmentWithTherapists.length > 0 && (
        <AppointmentSection
          title={translate('phc.appointment.with_therapist')}
          expanded={expandedSections.therapist}
          onToggle={() => toggleSection('therapist')}
          sectionData={groupedAppointmentWithTherapists}
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

export default NewRequestedAppointmentList;
