/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Button, Divider, Overlay, Text, Input} from 'react-native-elements';
import {Alert, Platform, ToastAndroid, View} from 'react-native';
import styles from '../../../assets/styles';
import SelectPicker from '../../../components/Common/SelectPicker';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {formatDate, formatTime} from '../../../utils/helper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {requestAppointment} from '../../../store/appointment/actions';
import settings from '../../../../config/settings';

const SubmitRequestOverlay = ({visible}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {therapists} = useSelector((state) => state.therapist);
  const {professions} = useSelector((state) => state.profession);
  const [therapistId, setTherapistId] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);
  const [date, setDate] = useState(moment().toDate());
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [errorTherapistId, setErrorTherapistId] = useState(false);
  const [errorFromTime, setErrorFromTime] = useState(false);
  const [errorToTime, setErrorToTime] = useState(false);
  const toTimeIncreaseNum = 15;

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
    if (therapistId === '' || therapistId === null) {
      setErrorTherapistId(true);
    } else {
      setErrorTherapistId(false);
    }

    if (fromTime === '' || moment().diff(fromTime, 'minutes') > 0) {
      setErrorFromTime(true);
    } else {
      setErrorFromTime(false);
    }

    if (toTime === '' || moment().diff(toTime, 'minutes') > 0) {
      setErrorToTime(true);
    } else {
      setErrorToTime(false);
    }

    if (
      therapistId !== '' &&
      therapistId !== null &&
      fromTime !== '' &&
      moment().diff(fromTime, 'minutes') < 0 &&
      toTime !== '' &&
      moment().diff(toTime, 'minutes') < 0
    ) {
      dispatch(
        requestAppointment({
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
    <Overlay isVisible={true} overlayStyle={styles.appointmentOverlayContainer}>
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
            display="default"
            onChange={onSetDate}
          />
        )}

        <View style={styles.formGroup}>
          <Input
            placeholder={translate('appointment.placeholder.time')}
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
            display="spinner"
            onChange={onSetFromTime}
          />
        )}

        <View style={styles.formGroup}>
          <Input
            placeholder={translate('appointment.placeholder.time')}
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
            display="spinner"
            onChange={onSetToTime}
          />
        )}

        <View style={styles.formGroup}>
          <View
            style={[styles.marginTop, styles.appointmentOverlayButtonsWrapper]}>
            <Button
              title={translate('common.submit')}
              titleStyle={[styles.textUpperCase]}
              containerStyle={styles.appointmentOverlayLeftButtonContainer}
              onPress={() => handleRequestAppoint()}
            />
            <Button
              title={translate('common.cancel')}
              titleStyle={[styles.textUpperCase]}
              type="outline"
              containerStyle={styles.appointmentOverlayRightButtonContainer}
              onPress={() => handleCloseOverlay()}
            />
          </View>
        </View>
      </>
    </Overlay>
  );
};

export default SubmitRequestOverlay;
