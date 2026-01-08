import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Text, withTheme, Button, Icon} from 'react-native-elements';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import {useForm, Controller} from 'react-hook-form';
import SelectPicker from '../../../components/Common/SelectPicker';
import DatePicker from '../../../components/Common/DatePicker';
import TextField from '../../../components/Common/TextField';
import {getDefinedCountries} from '../../../store/country/actions';
import {MultiSelect} from 'react-native-element-dropdown';
import {theme} from '../../../../App';
import {getRegionsRequest} from '../../../store/region/actions';
import {getProvincesRequest} from '../../../store/province/actions';
import {
  getPhcServicesRequest,
  getPhcWorkersRequest,
} from '../../../store/phcService/actions';
import {getCountryRequest} from '../../../store/country/actions';
import {getCountryName} from '../../../utils/country';
import {
  getRegionName,
  getProvinceName,
  getPhcServiceName,
} from '../../../utils/patient';
import {
  createPatientRequest,
  updatePatientRequest,
  getPatientsListRequest,
  deletePendingSupplementary,
  getPatientByPhoneRequest,
  createPatientOfflineRequest,
  getPatientsListForPhcWorkerRequest,
} from '../../../store/patient/actions';
import {ageCalculation} from '../../../utils/age';
import {_} from 'lodash';
import {formatDate, isValidDateFormat} from '../../../utils/helper';
import {useShowToast} from '../../../hook/useShowToast';
import Spinner from 'react-native-loading-spinner-overlay';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment/moment';
import {TRANSFER_STATUS} from '../../../variables/constants';
import {useNetInfo} from '@react-native-community/netinfo';

const CreateOrEditPatient = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {showToast} = useShowToast();
  const netInfo = useNetInfo();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {profile} = useSelector((state) => state.user);
  const {phcWorkers} = useSelector((state) => state.phcService);
  const {transfers} = useSelector((state) => state.transfer);
  const {loading} = useSelector((state) => state.patient);
  const {definedCountries, countries} = useSelector((state) => state.country);
  const [countryPhoneCode, setCountryPhoneCode] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [errorPhoneExist, setErrorPhoneExist] = useState(false);
  const [selectedSupplementary, setSelectedSupplementary] = useState([]);
  const {patient} = route.params || {};
  const defaultValues = {
    dial_code: '',
    phone: '',
    date_of_birth: '',
    first_name: '',
    last_name: '',
    gender: '',
    location: '',
    note: '',
    supplementary_phc_workers: [],
  };
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: {isDirty, errors},
  } = useForm({defaultValues});

  useEffect(() => {
    dispatch(getCountryRequest());
    dispatch(getRegionsRequest());
    dispatch(getProvincesRequest());
    dispatch(getPhcServicesRequest());
    dispatch(getPhcWorkersRequest(profile?.phc_service_id));
  }, [dispatch, profile?.phc_service_id]);

  useEffect(() => {
    dispatch(getDefinedCountries());
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      if (patient) {
        reset(patient);
        const formattedDOB = patient.date_of_birth
          ? isValidDateFormat(patient.date_of_birth)
            ? patient.date_of_birth
            : moment(patient.date_of_birth).toDate()
          : '';
        setDateValue(formattedDOB);
        setValue(
          'date_of_birth',
          patient.date_of_birth ? formatDate(patient.date_of_birth) : '',
        );
        setValue('phone', patient.phone?.replace(patient.dial_code, ''));
        setCountryPhoneCode(patient.dial_code);
      } else {
        reset(defaultValues);
        if (definedCountries.length) {
          const userCountryCode = countries.find(
            (country) => country.id === profile?.country_id,
          )?.iso_code;
          let defaultCountry = definedCountries[0];

          if (userCountryCode) {
            const userCountry = _.find(definedCountries, {
              iso_code: userCountryCode,
            });
            if (userCountry) {
              defaultCountry = userCountry;
            }
          }
          setCountryPhoneCode(defaultCountry.phone_code);
          setValue('dial_code', defaultCountry.phone_code);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patient, reset, setValue, definedCountries, countries, profile]),
  );

  useEffect(() => {
    if (transfers && transfers.length && patient) {
      const pending = transfers.filter(
        (transfer) =>
          transfer.patient_id === patient.id &&
          transfer.therapist_type === 'supplementary',
      );
      setPendingTransfers(
        pending.map((transfer) => ({
          id: transfer.id,
          therapist_id: transfer.to_therapist.id,
          first_name: transfer.to_therapist.first_name,
          last_name: transfer.to_therapist.last_name,
          status: transfer.status,
        })),
      );
    }
  }, [transfers, patient]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      phone: `${data.dial_code}${data.phone}`,
      supplementary_phc_workers: selectedSupplementary,
    };

    if (!netInfo.isConnected) {
      if (patient) {
        dispatch(updatePatientRequest(patient.id, payload));
      } else {
        dispatch(createPatientOfflineRequest(payload));
      }

      showToast(
        translate('phc.patient.message.saved_offline'),
        translate('common.offline'),
      );

      handleGoback();
      return;
    }

    dispatch(
      getPatientByPhoneRequest(payload.phone, patient ? patient.id : null),
    ).then((response) => {
      if (response.success) {
        if (response.data) {
          setErrorPhoneExist(true);
          return;
        } else {
          setErrorPhoneExist(false);
          if (patient) {
            dispatch(updatePatientRequest(patient.id, payload)).then((res) => {
              if (res.success) {
                showToast(
                  translate('phc.patient.message.update_success'),
                  translate('phc.patient.edit'),
                );
                dispatch(getPatientsListRequest());
                handleGoback();
              } else {
                showToast(
                  translate(translate(res.message)),
                  translate('phc.patient.edit'),
                );
              }
            });
            return;
          }
          dispatch(createPatientRequest(payload)).then((res) => {
            if (res.success) {
              dispatch(getPatientsListForPhcWorkerRequest());
              showToast(
                translate('phc.patient.message.create_success'),
                translate('phc.patient.create'),
              );
              handleGoback();
            } else {
              showToast(
                translate(translate(res.message)),
                translate('phc.patient.create'),
              );
            }
          });
        }
      }
    });
  };

  const handleRemovePendingSupplementary = (id, therapistId) => {
    setPendingTransfers(
      pendingTransfers.filter((item) => item.therapist_id !== therapistId),
    );
    if (id) {
      dispatch(deletePendingSupplementary(id)).then((response) => {
        if (response.success) {
          showToast(
            translate(
              'phc.patient.message.pending_supplementary_phc_worker_removed',
            ),
            translate('phc.patient.pending_supplementary'),
          );
        } else {
          showToast(
            translate(translate(response.message)),
            translate('phc.patient.pending_supplementary'),
          );
        }
      });
    }
  };

  const handleGoback = () => {
    setPendingTransfers([]);
    setDateValue('');
    setErrorPhoneExist(false);
    setSelectedSupplementary([]);
    navigation.goBack();
  };

  const renderSelectedItem = (item, unSelect) => {
    return (
      <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
        <View style={componentStyles.selectedStyle}>
          <Text style={componentStyles.selectedTextStyle}>{item.label}</Text>
          <Icon
            name="highlight-off"
            type="material"
            size={20}
            color={theme.colors.white}
            onPress={() =>
              handleRemovePendingSupplementary(item.id, item.therapist_id)
            }
            containerStyle={styles.marginLeftSm}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <HeaderBar
        onGoBack={handleGoback}
        title={translate(patient ? 'phc.patient.edit' : 'phc.patient.create')}
        backgroundPrimary={true}
      />
      <ScrollView
        contentContainerStyle={[styles.mainContainerLight, styles.paddingXMd]}>
        <View>
          <Text
            accessibilityLabel={translate('phc.patient.phone')}
            style={componentStyles.labelStyle}>
            {translate('phc.patient.phone')}
            <Text style={componentStyles.requiredText}> *</Text>
          </Text>
          <View style={componentStyles.twoColumnContainer}>
            <View
              style={[
                styles.formSelectPickerContainer,
                componentStyles.phoneCodeContainer,
              ]}>
              <Controller
                control={control}
                name="dial_code"
                render={({field: {value, onChange}}) => (
                  <SelectPicker
                    placeholder={{}}
                    value={countryPhoneCode}
                    items={
                      countryPhoneCode
                        ? definedCountries.map((country) => ({
                            label: `${country.name} (+${country.phone_code})`,
                            value: country.phone_code,
                            inputLabel: `+${country.phone_code}`,
                          }))
                        : []
                    }
                    onValueChange={() => {
                      onChange(value);
                      setCountryPhoneCode(value);
                    }}
                    accessibilityLabel={translate('phc.patient.dial_code')}
                    customeFontSize={13}
                  />
                )}
              />
            </View>
            <View style={componentStyles.columnContainer}>
              <Controller
                control={control}
                name="phone"
                rules={{
                  required: translate(
                    'error.message.phc.patient.phone.required',
                  ),
                }}
                render={({field: {value, onChange}}) => (
                  <TextField
                    placeholder={translate('phc.patient.phone.placeholder')}
                    variant="filled"
                    value={value}
                    onChangeText={onChange}
                    errorMessage={
                      errors?.phone?.message ||
                      (errorPhoneExist
                        ? translate('error.message.phc.patient.phone_exist')
                        : undefined)
                    }
                    renderErrorMessage={!!errors.phone || errorPhoneExist}
                    inputStyle={componentStyles.inputStyle}
                    keyboardType="phone-pad"
                    maxLength={12}
                  />
                )}
              />
            </View>
          </View>
          <View style={componentStyles.twoColumnContainer}>
            <View
              style={[
                componentStyles.columnContainer,
                componentStyles.columnContainerHeight,
              ]}>
              <TextField
                variant="filled"
                value={getCountryName()}
                label={translate('phc.patient.country')}
                disabled
                labelStyle={componentStyles.labelStyle}
                inputStyle={componentStyles.inputStyle}
              />
            </View>
            <View
              style={[
                componentStyles.columnContainer,
                componentStyles.columnContainerHeight,
              ]}>
              <TextField
                variant="filled"
                value={getRegionName()}
                label={translate('phc.patient.region')}
                disabled
                labelStyle={componentStyles.labelStyle}
                inputStyle={componentStyles.inputStyle}
              />
            </View>
          </View>
          <View style={componentStyles.twoColumnContainer}>
            <View
              style={[
                componentStyles.columnContainer,
                componentStyles.columnContainerHeight,
              ]}>
              <TextField
                variant="filled"
                value={getProvinceName()}
                label={translate('phc.patient.province')}
                disabled
                labelStyle={componentStyles.labelStyle}
                inputStyle={componentStyles.inputStyle}
              />
            </View>
            <View
              style={[
                componentStyles.columnContainer,
                componentStyles.columnContainerHeight,
              ]}>
              <TextField
                variant="filled"
                value={getPhcServiceName()}
                label={translate('phc.patient.phc_service')}
                disabled
                labelStyle={componentStyles.labelStyle}
                inputStyle={componentStyles.inputStyle}
              />
            </View>
          </View>
          <View style={componentStyles.twoColumnContainer}>
            <View style={componentStyles.columnContainer}>
              <Text
                accessibilityLabel={translate('phc.patient.gender')}
                style={componentStyles.labelStyle}>
                {translate('phc.patient.gender')}
                <Text style={componentStyles.requiredText}> *</Text>
              </Text>
              <View style={styles.formSelectPickerContainer}>
                <Controller
                  control={control}
                  name="gender"
                  rules={{
                    required: translate(
                      'error.message.phc.patient.gender.required',
                    ),
                  }}
                  render={({field: {value, onChange}}) => (
                    <SelectPicker
                      placeholder={{
                        label: translate('phc.patient.gender.placeholder'),
                        value: null,
                      }}
                      value={value}
                      items={[
                        {
                          label: translate('phc.patient.gender.male'),
                          value: 'male',
                        },
                        {
                          label: translate('phc.patient.gender.female'),
                          value: 'female',
                        },
                        {
                          label: translate('phc.patient.gender.other'),
                          value: 'other',
                        },
                      ]}
                      onValueChange={onChange}
                      accessibilityLabel={translate('phc.patient.gender')}
                      customeFontSize={13}
                    />
                  )}
                />
              </View>
              {errors.gender && (
                <Text style={componentStyles.errorTextStyle}>
                  {errors.gender.message}
                </Text>
              )}
            </View>
            <View style={componentStyles.columnContainer}>
              <Controller
                control={control}
                name="date_of_birth"
                render={({field: {onChange}}) => {
                  return (
                    <DatePicker
                      label={translate('phc.patient.date_of_birth')}
                      placeholder={translate(
                        'phc.patient.date_of_birth.placeholder',
                      )}
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
                      maximumDate={new Date()}
                    />
                  );
                }}
              />
              <Text
                accessibilityLabel={translate('phc.patient.age')}
                style={componentStyles.labelStyle}>
                {translate('phc.patient.age', {
                  value: ageCalculation(dateValue, translate),
                })}
              </Text>
            </View>
          </View>
          <View style={componentStyles.twoColumnContainer}>
            <View style={componentStyles.columnContainer}>
              <Text
                accessibilityLabel={translate('phc.patient.last_name')}
                style={componentStyles.labelStyle}>
                {translate('phc.patient.last_name')}
                <Text style={componentStyles.requiredText}> *</Text>
              </Text>
              <Controller
                control={control}
                name="last_name"
                rules={{
                  required: translate(
                    'error.message.phc.patient.last_name.required',
                  ),
                }}
                render={({field: {value, onChange}}) => (
                  <TextField
                    placeholder={translate('phc.patient.last_name.placeholder')}
                    variant="filled"
                    value={value}
                    onChangeText={onChange}
                    errorMessage={
                      errors ? errors.last_name?.message : undefined
                    }
                    renderErrorMessage={!!errors.last_name}
                    labelStyle={componentStyles.labelStyle}
                    inputStyle={componentStyles.inputStyle}
                  />
                )}
              />
            </View>
            <View style={componentStyles.columnContainer}>
              <Text
                accessibilityLabel={translate('phc.patient.first_name')}
                style={componentStyles.labelStyle}>
                {translate('phc.patient.first_name')}
                <Text style={componentStyles.requiredText}> *</Text>
              </Text>
              <Controller
                control={control}
                name="first_name"
                rules={{
                  required: translate(
                    'error.message.phc.patient.first_name.required',
                  ),
                }}
                render={({field: {value, onChange}}) => (
                  <TextField
                    placeholder={translate(
                      'phc.patient.first_name.placeholder',
                    )}
                    variant="filled"
                    value={value}
                    onChangeText={onChange}
                    errorMessage={
                      errors ? errors.first_name?.message : undefined
                    }
                    renderErrorMessage={!!errors.first_name}
                    labelStyle={componentStyles.labelStyle}
                    inputStyle={componentStyles.inputStyle}
                  />
                )}
              />
            </View>
          </View>
          <View>
            <Text
              accessibilityLabel={translate('phc.patient.location')}
              style={componentStyles.labelStyle}>
              {translate('phc.patient.location')}
              <Text style={theme.colors.error}> *</Text>
            </Text>
            <View style={styles.formSelectPickerContainer}>
              <Controller
                control={control}
                name="location"
                rules={{
                  required: translate(
                    'error.message.phc.patient.location.required',
                  ),
                }}
                render={({field: {value, onChange}}) => (
                  <SelectPicker
                    placeholder={{
                      label: translate('phc.patient.location.placeholder'),
                      value: null,
                    }}
                    value={value}
                    items={[
                      {
                        label: translate('phc.patient.location.rural_area'),
                        value: 'rural_area',
                      },
                      {
                        label: translate('phc.patient.location.urban_area'),
                        value: 'urban_area',
                      },
                      {
                        label: translate('phc.patient.location.n/a'),
                        value: 'n/a',
                      },
                    ]}
                    onValueChange={onChange}
                    accessibilityLabel={translate('phc.patient.location')}
                    customeFontSize={13}
                  />
                )}
              />
            </View>
            {errors.location && (
              <Text style={componentStyles.errorTextStyle}>
                {errors.location.message}
              </Text>
            )}
          </View>
          <View style={[styles.marginBottom, styles.marginTop]}>
            <Text style={componentStyles.labelStyle}>
              {translate('phc.patient.supplementary_phc_workers')}
            </Text>
            <Controller
              control={control}
              name="supplementary_phc_workers"
              render={({field: {onChange, value}}) => (
                <MultiSelect
                  style={componentStyles.dropdown}
                  placeholder={translate(
                    'phc.patient.supplementary_phc_workers.placeholder',
                  )}
                  placeholderStyle={componentStyles.placeholderStyle}
                  selectedTextStyle={componentStyles.selectedTextStyle}
                  iconStyle={componentStyles.iconStyle}
                  data={(phcWorkers ?? [])
                    .filter(
                      (worker) =>
                        !pendingTransfers.some(
                          (pt) => pt.therapist_id === worker.id,
                        ) && worker.id !== profile.id,
                    )
                    .map((worker) => ({
                      label: `${worker.last_name} ${worker.first_name}`,
                      value: worker.id,
                    }))
                    .concat(
                      pendingTransfers.length ===
                        phcWorkers.filter((worker) => worker.id !== profile.id)
                          .length
                        ? [
                            {
                              label: translate('phc.patient.no_more_option'),
                              value: null,
                            },
                          ]
                        : [],
                    )}
                  labelField="label"
                  valueField="value"
                  value={value}
                  onChange={(selected) => {
                    if (selected.includes(null)) {
                      return;
                    }
                    const newlySelected = selected.filter(
                      (id) => !value.includes(id),
                    );
                    const newPending = newlySelected.map((id) => {
                      const worker = phcWorkers.find(
                        (phcWorker) => phcWorker.id === id,
                      );
                      return {
                        therapist_id: worker.id,
                        first_name: worker.first_name,
                        last_name: worker.last_name,
                        status: TRANSFER_STATUS.INVITED,
                      };
                    });
                    if (newPending.length) {
                      setPendingTransfers((prev) => [...prev, ...newPending]);
                    }
                    const updatedAssigned = value.filter((id) =>
                      selected.includes(id),
                    );
                    setSelectedSupplementary([...value, ...selected]);
                    onChange(updatedAssigned);
                  }}
                  renderSelectedItem={renderSelectedItem}
                />
              )}
            />
            {pendingTransfers.length > 0 && (
              <>
                <Text style={[componentStyles.labelStyle, styles.marginTop]}>
                  {translate(
                    'phc.patient.supplementary_phc_workers.pending_accept_decline',
                  )}
                </Text>
                <View style={componentStyles.badgeContainer}>
                  {pendingTransfers.map((item, index) => (
                    <View
                      key={index}
                      style={
                        item.id && item.status === TRANSFER_STATUS.DECLINED
                          ? [
                              componentStyles.declineBackgroundStyle,
                              componentStyles.pendingBadge,
                            ]
                          : [
                              componentStyles.pendingBackgroundStyle,
                              componentStyles.pendingBadge,
                            ]
                      }>
                      <Text style={componentStyles.selectedTextStyle}>
                        {item.last_name} {item.first_name}
                      </Text>
                      <Icon
                        name="highlight-off"
                        type="material"
                        size={20}
                        color={theme.colors.white}
                        onPress={() =>
                          handleRemovePendingSupplementary(
                            item.id,
                            item.therapist_id,
                          )
                        }
                        containerStyle={styles.marginLeftSm}
                      />
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
          <View>
            <Controller
              control={control}
              name="note"
              render={({field: {value, onChange}}) => (
                <TextField
                  label={translate('phc.patient.note')}
                  placeholder={translate('phc.patient.note.placeholder')}
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
        </View>
        <View style={componentStyles.buttonContainer}>
          <Button
            containerStyle={styles.marginBottom}
            title={translate(
              patient
                ? 'phc.patient.button.confirm_change'
                : 'phc.patient.button.create',
            )}
            onPress={handleSubmit(onSubmit)}
            disabled={!isDirty || loading}
          />
          <Button
            type="outline"
            containerStyle={styles.marginBottom}
            title={translate('phc.patient.button.cancel')}
            onPress={() => navigation.goBack()}
            disabled={loading}
          />
        </View>
        <Spinner
          visible={loading}
          overlayColor="rgba(0, 0, 0, 0.5)"
          textStyle={styles.textLight}
        />
      </ScrollView>
    </>
  );
};

const componentStyles = StyleSheet.create({
  twoColumnContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  phoneCodeContainer: {
    flex: 0.4,
  },
  columnContainer: {
    flex: 1,
  },
  dropdown: {
    backgroundColor: '#E6E8EA',
    borderRadius: 8,
    padding: 16,
  },
  placeholderStyle: {
    color: '#999',
    fontSize: 12,
  },
  selectedTextStyle: {
    fontSize: 12,
    color: theme.colors.white,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 10,
    marginRight: 8,
  },
  columnContainerHeight: {
    height: 90,
  },
  labelStyle: {
    fontSize: 12,
    marginBottom: 8,
    color: theme.colors.grey1,
    fontWeight: '200',
  },
  buttonContainer: {
    paddingHorizontal: 15,
    marginTop: 25,
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
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginTop: 4,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  requiredText: {
    color: theme.colors.danger,
  },
  declineBackgroundStyle: {
    backgroundColor: theme.colors.danger,
  },
  pendingBackgroundStyle: {
    backgroundColor: theme.colors.primary,
  },
});

export default withTheme(CreateOrEditPatient);
