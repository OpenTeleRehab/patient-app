/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Button, Divider, Text} from 'react-native-elements';
import {Platform, View, StyleSheet} from 'react-native';
import styles from '../../../assets/styles';
import SelectPicker from '../../../components/Common/SelectPicker';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {formatDate, formatTime} from '../../../utils/helper';
import settings from '../../../../config/settings';
import CommonOverlay from '../../../components/Common/Overlay';
import {
  PHC_APPOINTMENT_RECIPIENT_TYPE,
  PHC_APPOINTMENT_OPTIONS
} from '../../../variables/appointment';
import {useForm, Controller} from 'react-hook-form';
import {theme} from '../../../../App';
import DatePicker from '../../../components/Common/DatePicker';
import TextField from '../../../components/Common/TextField';
import {useShowToast} from '../../../hook/useShowToast';
import {
  createAppointmentWithPatient,
  updateAppointmentWithPatient,
  createAppointment,
  updateAppointment
} from '../../../store/phcAppointment/actions';
import Spinner from 'react-native-loading-spinner-overlay';

const CreateOrEditAppointment = ({visible, setVisible, appointment, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {showToast} = useShowToast();
  const profile = useSelector((state) => state.user.profile);
  const {allPatients} = useSelector((state) => state.patient);
  const {phcWorkers} = useSelector((state) => state.phcService);
  const {professions} = useSelector((state) => state.profession);
  const {loading} = useSelector((state) => state.phcAppointment);
  const {referralTherapists} = useSelector((state) => state.therapist);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState(moment().toDate());
  const [showFromTimePicker, setShowFromTimePicker] = useState(false);
  const [showToTimePicker, setShowToTimePicker] = useState(false);
  const [date, setDate] = useState(moment().toDate());
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const toTimeIncreaseNum = 15;

  const defaultValues = {
    recipient_type: '',
    date: moment().toDate(),
    recipient_id: '',
    patient_id: '',
    fromTime: '',
    toTime: '',
    note: '',
  };
  const {
    control,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: {isDirty, errors},
  } = useForm({defaultValues});

  useEffect(() => {
    if (appointment) {
      let recipientType = '';
      if (appointment.therapist_id) {
        recipientType = PHC_APPOINTMENT_RECIPIENT_TYPE.PATIENT;
      } else {
        const iswithTherapist = referralTherapists.find((item) => item.id === appointment.recipient_id);
        recipientType = iswithTherapist ? PHC_APPOINTMENT_RECIPIENT_TYPE.THERAPIST : PHC_APPOINTMENT_RECIPIENT_TYPE.PHC_WORKER;
      }

      reset({
        recipient_type: recipientType,
        date: moment.utc(appointment.start_date).local().toDate(),
        fromTime: moment.utc(appointment.start_date).local().toDate(),
        toTime: moment.utc(appointment.end_date).local().toDate(),
        recipient_id: appointment.recipient_id,
        patient_id: appointment.patient_id,
        note: appointment.note,
      });
      setDate(moment.utc(appointment.start_date).local().toDate());
      setFromTime(moment.utc(appointment.start_date).local().toDate());
      setToTime(moment.utc(appointment.end_date).local().toDate());
    }
  }, [appointment, reset, referralTherapists]);

  const getProfession = (id) => {
    const profession = professions.find((item) => item.id === id);

    return profession ? ' - ' + profession.name : '';
  };

  const handleCloseOverlay = () => {
    setVisible(false);
  };

  const onSubmit = (data) => {
    let payload = {};
    const startDate = moment(data.date, 'DD/MM/YYYY')
    .set({
      hour: data.fromTime.getHours(),
      minute: data.fromTime.getMinutes(),
      second: 0,
    })
    .utc()
    .format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(data.date, 'DD/MM/YYYY')
    .set({
      hour: data.toTime.getHours(),
      minute: data.toTime.getMinutes(),
      second: 0,
    })
    .utc()
    .format('YYYY-MM-DD HH:mm:ss');
    if (data.recipient_type === PHC_APPOINTMENT_RECIPIENT_TYPE.PATIENT) {
      payload = {
        patient_id: data.patient_id,
        therapist_id: profile.id,
        from: startDate,
        to: endDate,
        note: data.note
      };
    } else {
      payload = {
        recipient_id: data.recipient_id,
        from: startDate,
        to: endDate,
        note: data.note,
      }
    }

    if (data.recipient_type === PHC_APPOINTMENT_RECIPIENT_TYPE.PATIENT) {
      if (appointment) {
        dispatch(updateAppointmentWithPatient(appointment.id, payload)).then((res) => {
          if (res.success) {
            showToast(
              translate(
                'phc.appointment.message.update_success',
              ),
              translate('phc.appointment.edit')
            );
            handleCloseOverlay();
          } else {
            showToast(
              translate(translate(res.message)),
              translate('phc.appointment.edit')
            );
          }
        });
      } else {
        dispatch(createAppointmentWithPatient(payload)).then((res) => {
          if (res.success) {
            showToast(
              translate(
                'phc.appointment.message.create_success',
              ),
              translate('phc.appointment.create')
            );
            handleCloseOverlay();
          } else {
            showToast(
              translate(translate(res.message)),
              translate('phc.appointment.create')
            );
          }
        });  
      }
    } else {
      if (appointment) {
        dispatch(updateAppointment(appointment.id, payload)).then((res) => {
          if (res.success) {
            showToast(
              translate(
                'phc.appointment.message.update_success',
              ),
              translate('phc.appointment.edit')
            );
            handleCloseOverlay();
          } else {
            showToast(
              translate(translate(res.message)),
              translate('phc.appointment.edit')
            );
          }
        });
      } else {
        dispatch(createAppointment(payload)).then((res) => {
          if (res.success) {
            showToast(
              translate(
                'phc.appointment.message.create_success',
              ),
              translate('phc.appointment.create')
            );
            handleCloseOverlay();
          } else {
            showToast(
              translate(translate(res.message)),
              translate('phc.appointment.create')
            );
          }
        });
      }
    }
  };

  return (
    <CommonOverlay visible={visible} onClose={handleCloseOverlay}>
      <View>
        <Text
          accessible={true}
          accessibilityLabel={translate(
            appointment
              ? 'phc.appointment.edit'
              : 'phc.appointment.create',
          )}
          style={[
            styles.fontWeightBold,
            styles.leadText,
            styles.textDefault,
            styles.marginBottomMd,
          ]}>
          {translate(
            appointment
              ? 'phc.appointment.edit'
              : 'phc.appointment.create',
          )}
        </Text>
        <Divider style={styles.marginBottomMd} />
        <View>
          <Text
            accessibilityLabel={translate('phc.appointment.appointment_with')}
            style={componentStyles.labelStyle}
          >
            {translate('phc.appointment.appointment_with')}
            <Text style={componentStyles.requiredText}> *</Text>
          </Text>
          <View style={styles.formSelectPickerContainer}>
            <Controller
              control={control}
              name="recipient_type"
              rules={{required: translate('error.message.phc.appointment.recipient_type.required')}}
              render={({field: {value, onChange}}) => (
                <SelectPicker
                  placeholder={{
                    label: translate('phc.appointment.recipient_type.placeholder'),
                    value: null,
                  }}
                  value={value}
                  items={PHC_APPOINTMENT_OPTIONS.map((option) => ({
                    label: translate(option.label),
                    value: option.value,
                  }))}
                  onValueChange={onChange}
                  accessibilityLabel={translate('phc.appointment.recipient_type')}
                  customeFontSize={13}
                  disabled={!!appointment}
                />
              )}
            />
          </View>
          {errors.recipient_type && (
            <Text style={componentStyles.errorTextStyle}>{errors.recipient_type.message}</Text>
          )}
        </View>
        {watch('recipient_type') === PHC_APPOINTMENT_RECIPIENT_TYPE.PHC_WORKER && (
          <View>
            <Text
              accessibilityLabel={translate('phc.appointment.phc_worker')}
              style={componentStyles.labelStyle}
            >
              {translate('phc.appointment.phc_worker')}
              <Text style={componentStyles.requiredText}> *</Text>
            </Text>
            <View style={styles.formSelectPickerContainer}>
              <Controller
                control={control}
                name="recipient_id"
                rules={{required: translate('error.message.phc.appointment.phc_worker.required')}}
                render={({field: {value, onChange}}) => (
                  <SelectPicker
                    placeholder={{
                      label: translate('phc.appointment.phc_worker.placeholder'),
                      value: null,
                    }}
                    value={value}
                    items={phcWorkers.filter((phcWorker) => phcWorker.id !== profile.id).map((phcWorker) => ({
                      label:`${phcWorker.last_name} ${phcWorker.first_name} ${getProfession(phcWorker.profession_id)}`,
                      value: phcWorker.id,
                    }))}
                    onValueChange={onChange}
                    accessibilityLabel={translate('phc.appointment.phc_worker')}
                    customeFontSize={13}
                    disabled={!!appointment}
                  />
                )}
              />
            </View>
            {errors.recipient_id && (
              <Text style={componentStyles.errorTextStyle}>{errors.recipient_id.message}</Text>
            )}
          </View>
        )}
        {watch('recipient_type') === PHC_APPOINTMENT_RECIPIENT_TYPE.THERAPIST && (
          <View>
            <Text
              accessibilityLabel={translate('phc.appointment.therapist')}
              style={componentStyles.labelStyle}
            >
              {translate('phc.appointment.therapist')}
              <Text style={componentStyles.requiredText}> *</Text>
            </Text>
            <View style={styles.formSelectPickerContainer}>
              <Controller
                control={control}
                name="recipient_id"
                rules={{required: translate('error.message.phc.appointment.therapist.required')}}
                render={({field: {value, onChange}}) => (
                  <SelectPicker
                    placeholder={{
                      label: translate('phc.appointment.therapist.placeholder'),
                      value: null,
                    }}
                    value={value}
                    items={referralTherapists.map((therapist) => ({
                      label:`${therapist.last_name} ${therapist.first_name} ${getProfession(therapist.profession_id)}`,
                      value: therapist.id,
                    }))}
                    onValueChange={onChange}
                    accessibilityLabel={translate('phc.appointment.therapist')}
                    customeFontSize={13}
                    disabled={!!appointment}
                  />
                )}
              />
            </View>
            {errors.recipient_id && (
              <Text style={componentStyles.errorTextStyle}>{errors.recipient_id.message}</Text>
            )}
          </View>
        )}
        {watch('recipient_type') === PHC_APPOINTMENT_RECIPIENT_TYPE.PATIENT && (
          <View>
            <Text
              accessibilityLabel={translate('phc.appointment.patient')}
              style={componentStyles.labelStyle}
            >
              {translate('phc.appointment.patient')}
              <Text style={componentStyles.requiredText}> *</Text>
            </Text>
            <View style={styles.formSelectPickerContainer}>
              <Controller
                control={control}
                name="patient_id"
                rules={{required: translate('error.message.phc.appointment.patient.required')}}
                render={({field: {value, onChange}}) => (
                  <SelectPicker
                    placeholder={{
                      label: translate('phc.appointment.patient.placeholder'),
                      value: null,
                    }}
                    value={value}
                    items={allPatients.map((patient) => ({
                      label: `${patient.last_name} ${patient.first_name}`,
                      value: patient.id,
                    }))}
                    onValueChange={onChange}
                    accessibilityLabel={translate('phc.appointment.patient')}
                    customeFontSize={13}
                    disabled={!!appointment}
                  />
                )}
              />
            </View>
            {errors.patient_id && (
              <Text style={componentStyles.errorTextStyle}>{errors.patient_id.message}</Text>
            )}
          </View>
        )}
        <View style={styles.formGroup}>
          <Text
              accessibilityLabel={translate('phc.appointment.date')}
              style={[componentStyles.labelStyle, styles.marginTop]}
            >
            {translate('phc.appointment.date')}
            <Text style={componentStyles.requiredText}> *</Text>
          </Text>
          <Controller
            control={control}
            name="date"
            rules={{required: translate('error.message.phc.appointment.date.required')}}
            render={({field: {onChange}}) => {
              return (
                <DatePicker
                  placeholder={translate('phc.appointment.date.placeholder')}
                  value={dateValue}
                  mode="date"
                  onSetDate={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      onChange(formatDate(selectedDate));
                      setDateValue(moment(selectedDate).toDate());
                    }
                  }}
                  show={showDatePicker}
                  onClickIcon={() => setShowDatePicker(true)}
                  labelStyle={componentStyles.labelStyle}
                  inputStyle={componentStyles.inputStyle}
                  minimumDate={new Date()}
                />
              );
            }}
          />
          {errors.date && (
            <Text style={componentStyles.errorTextStyle}>{errors.date.message}</Text>
          )}
        </View>
        <View style={styles.formGroup}>
          <Text
              accessibilityLabel={translate('phc.appointment.from')}
              style={componentStyles.labelStyle}
            >
            {translate('phc.appointment.from')}
            <Text style={componentStyles.requiredText}> *</Text>
          </Text>
          <Controller
            control={control}
            name="fromTime"
            rules={{validate: (value) => {
                if (!value) { return translate('error.message.phc.appointment.from.required')}
                const dateTimeFormat = settings.format.date + ' ' + 'H:mm:ss';
                const now = moment().format(dateTimeFormat);
                const fromTimeThen = moment(
                  formatDate(date) + ' ' + formatTime(value),
                  settings.format.date + ' hh:mm A',
                ).format(dateTimeFormat);
                const fromTimeDuration = moment(fromTimeThen, dateTimeFormat).diff(
                  moment(now, dateTimeFormat),
                );
                if (fromTimeDuration < 0) {
                  return translate('error.message.phc.appointment.from.validate.error');
                }
                return true;
            }}}
            render={({field: {onChange}}) => {
              return (
                <DatePicker
                  placeholder={translate('phc.appointment.from.placeholder')}
                  value={fromTime}
                  mode="time"
                  onSetDate={(event, selectedTime) => {
                    setShowFromTimePicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      onChange(selectedTime);
                      setFromTime(selectedTime);
                      setToTime(moment(selectedTime).add(toTimeIncreaseNum, 'minutes').toDate());
                      setValue('toTime', moment(selectedTime).add(toTimeIncreaseNum, 'minutes').toDate());
                    }
                  }}
                  show={showFromTimePicker}
                  rightIcon={{
                    name: 'clock-time-twelve-outline',
                    type: 'material-community',
                    color: '#575757',
                    size: 28,
                  }}
                  onClickIcon={() => setShowFromTimePicker(true)}
                  labelStyle={componentStyles.labelStyle}
                  inputStyle={componentStyles.inputStyle}
                  is24Hour={false}
                />
              );
            }}
          />
          {errors.fromTime && (
            <Text style={componentStyles.errorTextStyle}>{errors.fromTime.message}</Text>
          )}
        </View>
        <View style={styles.formGroup}>
          <Text
              accessibilityLabel={translate('phc.appointment.to')}
              style={componentStyles.labelStyle}
            >
            {translate('phc.appointment.to')}
            <Text style={componentStyles.requiredText}> *</Text>
          </Text>
          <Controller
            control={control}
            name="toTime"
            rules={{validate: (value) => {
                if (!value) { return translate('error.message.phc.appointment.to.required')}
                const dateTimeFormat = settings.format.date + ' ' + 'H:mm:ss';
                const fromTimeThen = moment(
                  formatDate(date) + ' ' + formatTime(fromTime),
                  settings.format.date + ' hh:mm A',
                ).format(dateTimeFormat);
                const toTimeThen = moment(
                  formatDate(date) + ' ' + formatTime(toTime),
                  settings.format.date + ' hh:mm A',
                ).format(dateTimeFormat);
                const toTimeDuration = moment(toTimeThen, dateTimeFormat).diff(
                  moment(fromTimeThen, dateTimeFormat),
                );
                if (toTimeDuration < 0) {
                  return translate('error.message.phc.appointment.to.validate.error');
                }
                return true;
            }}}
            render={({field: {onChange}}) => {
              return (
                <DatePicker
                  placeholder={translate('phc.appointment.to.placeholder')}
                  value={toTime}
                  mode="time"
                  onSetDate={(event, selectedTime) => {
                    setShowToTimePicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      onChange(selectedTime);
                      setToTime(selectedTime);
                    }
                  }}
                  show={showToTimePicker}
                  rightIcon={{
                    name: 'clock-time-twelve-outline',
                    type: 'material-community',
                    color: '#575757',
                    size: 28,
                  }}
                  onClickIcon={() => setShowToTimePicker(true)}
                  labelStyle={componentStyles.labelStyle}
                  inputStyle={componentStyles.inputStyle}
                  is24Hour={false}
                />
              );
            }}
          />
          {errors.toTime && (
            <Text style={componentStyles.errorTextStyle}>{errors.toTime.message}</Text>
          )}
        </View>
        <View>
          <Controller
            control={control}
            name="note"
            render={({field: {value, onChange}}) => (
              <TextField
                label={translate('phc.appointment.note')}
                placeholder={translate('phc.appointment.note.placeholder')}
                variant="filled"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                labelStyle={componentStyles.labelStyle}
                inputStyle={componentStyles.inputStyle}
              />
            )}
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
              disabled={loading}
            />
            <Button
              title={translate('common.submit')}
              containerStyle={styles.appointmentOverlayRightButtonContainer}
              onPress={handleSubmit(onSubmit)}
              disabled={!isDirty || loading}
            />
          </View>
        </View>
        <Spinner
          visible={loading}
          overlayColor="rgba(0, 0, 0, 0.18)"
          textStyle={styles.textLight}
        />
      </View>
    </CommonOverlay>
  );
};

const componentStyles = StyleSheet.create({
  labelStyle: {
    fontSize: 12,
    marginBottom: 8,
    color: theme.colors.grey1,
    fontWeight: '200',
  },
  errorTextStyle: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: '500',
    marginTop: -5,
  },
  inputStyle: {
    fontSize: 12,
  },
  requiredText: {
    color: theme.colors.danger,
  },
});

export default CreateOrEditAppointment;
