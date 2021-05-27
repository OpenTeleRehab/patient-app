/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect} from 'react';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {Divider, Text} from 'react-native-elements';
import moment from 'moment/min/moment-with-locales';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {ROUTES} from '../../variables/constants';
import {ScrollView} from 'react-native';
import {getTherapistName} from '../../utils/therapist';

const AppointmentDetail = ({route, navigation}) => {
  const {appointment} = route.params;
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {therapists} = useSelector((state) => state.therapist);

  useEffect(() => {
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    };
  }, [navigation]);

  return (
    <>
      <HeaderBar
        leftContent={
          <Text numberOfLines={1} h4 style={styles.textLight}>
            {translate('appointment')}
          </Text>
        }
        rightContent={{
          label: translate('common.close'),
          onPress: () => navigation.navigate(ROUTES.APPOINTMENT),
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
      </ScrollView>
    </>
  );
};

export default AppointmentDetail;
