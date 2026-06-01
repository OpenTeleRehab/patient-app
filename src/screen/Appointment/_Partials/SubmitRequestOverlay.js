/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Button, Divider, Text} from 'react-native-elements';
import {Alert, Platform, StyleSheet, ToastAndroid, View} from 'react-native';
import styles from '../../../assets/styles';
import SelectPicker from '../../../components/Common/SelectPicker';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {formatDate, formatTime} from '../../../utils/helper';
import DatePicker from '../../../components/Common/DatePicker';
import {
  getAppointmentsListRequest,
  requestAppointment,
} from '../../../store/appointment/actions';
import settings from '../../../../config/settings';
import CommonOverlay from '../../../components/Common/Overlay';
import {
  CARE_PROVIDER_OPTIONS,
  CARE_PROVIDER_TYPES,
} from '../../../variables/appointment';

const SubmitRequestOverlay = ({visible, appointment, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const profile = useSelector((state) => state.user.profile);
  const {therapists, phcWorkers} = useSelector((state) => state.therapist);
  const {professions} = useSelector((state) => state.profession);
  const [therapistId, setTherapistId] = useState(profile.therapist_id);
  const [date, setDate] = useState(moment().toDate());
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [errorTherapistId, setErrorTherapistId] = useState(false);
  const [errorFromTime, setErrorFromTime] = useState(false);
  const [errorToTime, setErrorToTime] = useState(false);
  const [errorFromTimeRequired, setErrorFromTimeRequired] = useState(false);
  const [errorToTimeRequired, setErrorToTimeRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('');
  const [errorType, setErrorType] = useState(false);
  const toTimeIncreaseNum = 15;

  useEffect(() => {
    if (profile.phc_worker_id) {
      if (!appointment) {
        setTherapistId(
          type === CARE_PROVIDER_TYPES.PHC_WORKER
            ? profile.phc_worker_id
            : profile.therapist_id,
        );
      } else {
        const isPhcWorker = phcWorkers.some(
          (item) => item.id === appointment.therapist_id,
        );
        setType(
          isPhcWorker
            ? CARE_PROVIDER_TYPES.PHC_WORKER
            : CARE_PROVIDER_TYPES.THERAPIST,
        );
      }
    } else {
      setType(CARE_PROVIDER_TYPES.THERAPIST);
    }
  }, [profile, type, appointment, phcWorkers]);

  useEffect(() => {
    if (appointment) {
      setTherapistId(appointment.therapist_id);
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
    setTherapistId(profile.phc_worker_id ? null : profile.therapist_id);
    setFromTime('');
    setToTime('');
    visible(false);
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

    if (fromTime === '') {
      setErrorFromTimeRequired(true);
      setErrorFromTime(false);
    } else {
      setErrorFromTimeRequired(false);
      if (fromTimeDuration < 0) {
        setErrorFromTime(true);
      } else {
        setErrorFromTime(false);
      }
    }

    if (toTime === '') {
      setErrorToTimeRequired(true);
      setErrorToTime(false);
    } else {
      setErrorToTimeRequired(false);
      if (toTimeDuration < 0) {
        setErrorToTime(true);
      } else {
        setErrorToTime(false);
      }
    }

    if (type === '') {
      setErrorType(true);
    } else {
      setErrorType(false);
    }

    if (
      therapistId !== '' &&
      therapistId !== null &&
      fromTime !== '' &&
      fromTimeDuration > 0 &&
      toTime !== '' &&
      toTimeDuration > 0 &&
      type !== ''
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
        navigation.goBack();
        setIsLoading(false);
      } else {
        dispatch(requestAppointment(data)).then((result) => {
          setIsLoading(false);
          if (result.success) {
            if (appointment) {
              handleCloseOverlay();
              navigation.goBack();
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

  const handleTypeChange = (value) => {
    setType(value);
    setErrorType(false);
    setErrorTherapistId(false);
  };

  return (
    <CommonOverlay visible={true} onClose={handleCloseOverlay}>
      <View>
        <Text
          accessible={true}
          accessibilityLabel={translate(
            appointment
              ? 'appointment.edit_appointment'
              : 'appointment.request_appointment',
          )}
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
        {profile.phc_worker_id && (
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              {translate('appointment.choose_therapist_phc_worker')}
            </Text>
            <SelectPicker
              placeholder={{
                label: translate('appointment.choose_therapist_phc_worker'),
                value: null,
              }}
              items={CARE_PROVIDER_OPTIONS.map((option) => ({
                label: translate(option.label),
                value: option.value,
              }))}
              value={type}
              itemKey={type}
              disabled={!!appointment}
              onValueChange={(value) => handleTypeChange(value)}
            />
            {errorType && (
              <Text style={styles.textDanger}>
                {translate('error.message.choose.therapist_phc_worker')}
              </Text>
            )}
            <Divider
              style={[
                styles.marginTop,
                errorTherapistId ? styles.bgDanger : null,
              ]}
            />
          </View>
        )}
        {type === CARE_PROVIDER_TYPES.THERAPIST && (
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              {translate('appointment.therapist')}
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
        )}
        {type === CARE_PROVIDER_TYPES.PHC_WORKER && (
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              {translate('appointment.phc_worker')}
            </Text>
            <SelectPicker
              placeholder={{
                label: translate('appointment.choose_phc_worker'),
                value: null,
              }}
              items={phcWorkers.map((phcWorker) => ({
                label:
                  phcWorker.last_name +
                  ' ' +
                  phcWorker.first_name +
                  getProfession(phcWorker.profession_id),
                value: phcWorker.id,
              }))}
              value={therapistId}
              itemKey={therapistId}
              disabled={!!appointment}
              onValueChange={(value) => setTherapistId(value)}
            />
            {errorTherapistId && (
              <Text style={styles.textDanger}>
                {translate('error.message.choose.phc_worker')}
              </Text>
            )}
            <Divider
              style={[
                styles.marginTop,
                errorTherapistId ? styles.bgDanger : null,
              ]}
            />
          </View>
        )}

        <View style={styles.formGroup}>
          <DatePicker
            label={translate('appointment.label.date')}
            placeholder={translate('appointment.placeholder.date')}
            value={date}
            minimumDate={moment().toDate()}
            is24Hour
            inputContainerStyle={componentStyles.datePickerInputContainerStyle}
            onSetDate={setDate}
          />
          <Divider />
        </View>

        <View style={styles.formGroup}>
          <DatePicker
            label={translate('appointment.label.from')}
            placeholder={translate('appointment.placeholder.start')}
            value={fromTime}
            mode="time"
            minimumDate={moment().toDate()}
            is24Hour={false}
            inputContainerStyle={componentStyles.datePickerInputContainerStyle}
            onSetDate={(value) => {
              setFromTime(value);
              setToTime(
                moment(value).add(toTimeIncreaseNum, 'minutes').toDate(),
              );
            }}
          />
          {errorFromTimeRequired && (
            <Text style={styles.textDanger}>
              {translate('error.message.select.time')}
            </Text>
          )}
          {errorFromTime && (
            <Text style={styles.textDanger}>
              {translate('error.message.appointment.from.validate.error')}
            </Text>
          )}
          <Divider
            style={[
              styles.marginTop,
              errorFromTime || errorFromTimeRequired ? styles.bgDanger : null,
            ]}
          />
        </View>

        <View style={styles.formGroup}>
          <DatePicker
            label={translate('appointment.label.to')}
            placeholder={translate('appointment.placeholder.end')}
            value={toTime}
            mode="time"
            minimumDate={moment().toDate()}
            is24Hour={false}
            inputContainerStyle={componentStyles.datePickerInputContainerStyle}
            onSetDate={setToTime}
          />
          {errorToTimeRequired && (
            <Text style={styles.textDanger}>
              {translate('error.message.select.time')}
            </Text>
          )}
          {errorToTime && (
            <Text style={styles.textDanger}>
              {translate('error.message.appointment.to.validate.error')}
            </Text>
          )}
          <Divider
            style={[
              styles.marginTop,
              errorToTime || errorToTimeRequired ? styles.bgDanger : null,
            ]}
          />
        </View>

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
    </CommonOverlay>
  );
};

const componentStyles = StyleSheet.create({
  datePickerInputContainerStyle: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
});

export default SubmitRequestOverlay;
