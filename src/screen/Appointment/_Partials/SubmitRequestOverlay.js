/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Button, Divider, Overlay, Text, Input} from 'react-native-elements';
import {Alert, Platform, ToastAndroid, View} from 'react-native';
import styles from '../../../assets/styles';
import SelectPicker from '../../../components/Common/SelectPicker';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {formatDate, formatTime} from '../../../utils/helper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getAppointmentsListRequest,
  requestAppointment,
} from '../../../store/appointment/actions';
import settings from '../../../../config/settings';
import {ROUTES} from '../../../variables/constants';

const SubmitRequestOverlay = ({visible, appointment, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const profile = useSelector((state) => state.user.profile);
  const {therapists} = useSelector((state) => state.therapist);
  const {professions} = useSelector((state) => state.profession);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);
  const [therapistId, setTherapistId] = useState(
    appointment ? appointment.therapist_id : '',
  );
  const [date, setDate] = useState(moment().toDate());
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [errorTherapistId, setErrorTherapistId] = useState(false);
  const [errorFromTime, setErrorFromTime] = useState(false);
  const [errorToTime, setErrorToTime] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toTimeIncreaseNum = 15;

  useEffect(() => {
    if (appointment) {
      setDate(moment.utc(appointment.start_date).local().toDate());
      setFromTime(moment.utc(appointment.start_date).local().toDate());
      setToTime(moment.utc(appointment.end_date).local().toDate());
    }
  }, [appointment]);

  const getProfession = (id) => {
    const profession = professions.find((item) => item.id === id);

    return profession ? ' - ' + profession.name : '';
  };

  const handleCloseOverlay = () => {
    setTherapistId('');
    setFromTime('');
    setToTime('');
    visible(false);
  };

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
    !date && setDate(moment().toDate());
  };

  const handleShowFromTimePicker = () => {
    setShowFromTimePicker(true);
  };

  const handleShowToTimePicker = () => {
    setShowToTimePicker(true);
  };

  const handleRequestAppoint = () => {
    const dateTimeFormat = settings.format.date + ' ' + 'H:mm:ss';
    const now = moment().format(dateTimeFormat);

    const fromTimeThen = moment(
      formatDate(date) + ' ' + formatTime(fromTime),
      settings.format.date + ' hh:mm A',
    ).format(dateTimeFormat);

    const toTimeThen = moment(
      formatDate(date) + ' ' + formatTime(toTime),
      settings.format.date + ' hh:mm A',
    ).format(dateTimeFormat);

    const fromTimeDuration = moment(fromTimeThen, dateTimeFormat).diff(
      moment(now, dateTimeFormat),
    );

    const toTimeDuration = moment(toTimeThen, dateTimeFormat).diff(
      moment(fromTimeThen, dateTimeFormat),
    );

    if (therapistId === '' || therapistId === null) {
      setErrorTherapistId(true);
    } else {
      setErrorTherapistId(false);
    }

    if (fromTime === '' || fromTimeDuration < 0) {
      setErrorFromTime(true);
    } else {
      setErrorFromTime(false);
    }

    if (toTime === '' || toTimeDuration < 0) {
      setErrorToTime(true);
    } else {
      setErrorToTime(false);
    }

    if (
      therapistId !== '' &&
      therapistId !== null &&
      fromTime !== '' &&
      fromTimeDuration > 0 &&
      toTime !== '' &&
      toTimeDuration > 0
    ) {
      setIsLoading(true);

      const data = {
        id: appointment ? appointment.id : null,
        patient_id: profile ? profile.id : null,
        therapist_id: therapistId,
        start_date: moment(
          formatDate(date) + ' ' + formatTime(fromTime),
          settings.format.date + ' hh:mm A',
        )
          .utc()
          .locale('en')
          .format('YYYY-MM-DD HH:mm:ss'),
        end_date: moment(
          formatDate(date) + ' ' + formatTime(toTime),
          settings.format.date + ' hh:mm A',
        )
          .utc()
          .locale('en')
          .format('YYYY-MM-DD HH:mm:ss'),
      };

      if (
        moment.utc(appointment.start_date).local().format(dateTimeFormat) ===
          fromTimeThen &&
        moment.utc(appointment.end_date).local().format(dateTimeFormat) ===
          toTimeThen
      ) {
        handleCloseOverlay();
        navigation.navigate(ROUTES.APPOINTMENT);
        setIsLoading(false);
      } else {
        dispatch(requestAppointment(data)).then((result) => {
          setIsLoading(false);
          if (result.success) {
            if (appointment) {
              navigation.navigate(ROUTES.APPOINTMENT);
            } else {
              handleCloseOverlay();
            }
            if (Platform.OS === 'ios') {
              Alert.alert(
                translate('appointment'),
                translate(
                  'appointment.request_has_been_submitted_successfully',
                ),
              );
            } else {
              ToastAndroid.show(
                translate(
                  'appointment.request_has_been_submitted_successfully',
                ),
                ToastAndroid.SHORT,
              );
            }
            dispatch(getAppointmentsListRequest({page_size: 10, page: 1}));
          } else {
            if (Platform.OS === 'ios') {
              Alert.alert(translate('appointment'), translate(result.message));
            } else {
              ToastAndroid.show(
                translate(translate(result.message)),
                ToastAndroid.SHORT,
              );
            }
            setErrorFromTime(true);
            setErrorToTime(true);
            dispatch(getAppointmentsListRequest({page_size: 10, page: 1}));
          }
        });
      }
    }
  };

  const onSetDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onSetFromTime = (event, selectedTime) => {
    setShowFromTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setFromTime(selectedTime);
      setToTime(
        moment(selectedTime).add(toTimeIncreaseNum, 'minutes').toDate(),
      );
    }
  };

  const onSetToTime = (event, selectedTime) => {
    setShowToTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setToTime(selectedTime);
    }
  };

  return (
    <Overlay
      isVisible={true}
      backdropStyle={styles.overlayBackdrop}
      overlayStyle={styles.overlay}
      onBackdropPress={handleCloseOverlay}>
      <View>
        <Text
          style={[
            styles.fontWeightBold,
            styles.leadText,
            styles.textDefault,
            styles.marginBottomMd,
          ]}>
          {translate(
            appointment
              ? 'appointment.edit_appointment'
              : 'appointment.request_appointment',
          )}
        </Text>
        <Divider style={styles.marginBottomMd} />
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
            itemKey={therapistId}
            disabled={!!appointment}
            onValueChange={(value) => setTherapistId(value)}
          />
          {errorTherapistId && (
            <Text style={styles.textDanger}>
              {translate('error.message.choose.therapist')}
            </Text>
          )}
          <Divider
            style={[
              styles.marginTop,
              errorTherapistId ? styles.bgDanger : null,
            ]}
          />
        </View>
        <View style={styles.formGroup}>
          <Input
            placeholder={translate('appointment.placeholder.date')}
            label={translate('appointment.label.date')}
            labelStyle={[styles.formLabel, styles.textSmall]}
            disabled
            value={date ? formatDate(date) : ''}
            rightIcon={{
              name: 'calendar-today',
              type: 'material-community',
              color: '#575757',
              onPress: handleShowDatePicker,
            }}
            containerStyle={styles.formControlDate}
            inputContainerStyle={styles.noneBorderBottom}
            disabledInputStyle={styles.formControlDateInput}
          />
          <Divider />
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            minimumDate={moment().toDate()}
            mode="date"
            is24Hour={true}
            onChange={onSetDate}
          />
        )}
        <View style={styles.formGroup}>
          <Input
            placeholder={translate('appointment.placeholder.start')}
            label={translate('appointment.label.from')}
            labelStyle={[styles.formLabel, styles.textSmall]}
            disabled
            value={fromTime ? formatTime(fromTime) : ''}
            rightIcon={{
              name: 'clock-time-twelve-outline',
              type: 'material-community',
              color: '#575757',
              onPress: () => handleShowFromTimePicker(),
            }}
            containerStyle={styles.formControlDate}
            inputContainerStyle={styles.noneBorderBottom}
            disabledInputStyle={styles.formControlDateInput}
          />
          {errorFromTime && (
            <Text style={styles.textDanger}>
              {translate('error.message.select.time')}
            </Text>
          )}
          <Divider
            style={[styles.marginTop, errorFromTime ? styles.bgDanger : null]}
          />
        </View>
        {showFromTimePicker && (
          <DateTimePicker
            value={fromTime || moment().toDate()}
            maximumDate={toTime}
            mode="time"
            is24Hour={false}
            onChange={onSetFromTime}
          />
        )}
        <View style={styles.formGroup}>
          <Input
            placeholder={translate('appointment.placeholder.end')}
            label={translate('appointment.label.to')}
            labelStyle={[styles.formLabel, styles.textSmall]}
            disabled
            value={toTime ? formatTime(toTime) : ''}
            rightIcon={{
              name: 'clock-time-three-outline',
              type: 'material-community',
              color: fromTime ? '#575757' : '#ADADAD',
              onPress: () => fromTime && handleShowToTimePicker(),
            }}
            containerStyle={styles.formControlDate}
            inputContainerStyle={styles.noneBorderBottom}
            disabledInputStyle={styles.formControlDateInput}
          />
          {errorToTime && (
            <Text style={styles.textDanger}>
              {translate('error.message.select.time')}
            </Text>
          )}
          <Divider
            style={[styles.marginTop, errorToTime ? styles.bgDanger : null]}
          />
        </View>
        {showToTimePicker && (
          <DateTimePicker
            value={
              toTime || moment().add(toTimeIncreaseNum, 'minutes').toDate()
            }
            mode="time"
            is24Hour={false}
            onChange={onSetToTime}
          />
        )}
        <View style={styles.formGroup}>
          <View
            style={[styles.marginTop, styles.appointmentOverlayButtonsWrapper]}>
            <Button
              title={translate('common.cancel')}
              type="outline"
              containerStyle={styles.appointmentOverlayLeftButtonContainer}
              onPress={() => handleCloseOverlay()}
            />
            <Button
              title={translate('common.submit')}
              containerStyle={styles.appointmentOverlayRightButtonContainer}
              onPress={() => handleRequestAppoint()}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </Overlay>
  );
};

export default SubmitRequestOverlay;
