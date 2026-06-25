import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Text, withTheme, Button, Icon} from 'react-native-elements';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import {useForm, Controller} from 'react-hook-form';
import SelectPicker from '../../../components/Common/SelectPicker';
import DatePicker from '../../../components/Common/DatePicker';
import TextField from '../../../components/Common/TextField';
import {getDefinedCountries} from '../../../store/country/actions';
import {MultiSelect} from 'react-native-element-dropdown';
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
  deletePendingSupplementary,
  getPatientByPhoneRequest,
  createPatientOfflineRequest,
  getPatientsListForPhcWorkerRequest,
  updatePatientOfflineRequest,
  updateListItem,
  removePendingSupplementaryOfflineRequest
} from '../../../store/patient/actions';
import {ageCalculation} from '../../../utils/age';
import {_} from 'lodash';
import {formatDate, isValidDateFormat} from '../../../utils/helper';
import {useShowToast} from '../../../hook/useShowToast';
import Spinner from 'react-native-loading-spinner-overlay';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment/moment';
import {
  OFFLINE_STATUS,
  ROUTES,
  TRANSFER_STATUS,
} from '../../../variables/constants';
import {useNetInfo} from '@react-native-community/netinfo';
import {mutation} from '../../../store/patient/mutations';
import {mutation as questionnaireMutation} from '../../../store/screeningQuestionnaire/mutations';
import {syncOfflineScreeningQuestionnaires} from '../../../store/screeningQuestionnaire/actions';
import variables from '../../../assets/styles/variables';
import AppKeyboardView from '../../../components/Common/AppKeyboardView';

const CreateOrEditPatient = ({theme, navigation, route}) => {
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
  const [dateValue, setDateValue] = useState('');
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [errorPhoneExist, setErrorPhoneExist] = useState(false);
  const [selectedSupplementary, setSelectedSupplementary] = useState([]);
  const {patientsForPhcWorker, offlineRemovePendingSupplementary} = useSelector((state) => state.patient);
  const {offlineInterviews} = useSelector(
    (state) => state.screeningQuestionnaire,
  );
  const {patientId} = route.params || {};
  const [patientDetail, setPatientDetail] = useState();
  const [highlightPhone, setHighlightPhone] = useState(false);

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
    watch,
    formState: {isDirty, errors},
  } = useForm({defaultValues});

  const supplementaryPhcWorkers = watch('supplementary_phc_workers');

  useEffect(() => {
    dispatch(getCountryRequest());
    dispatch(getRegionsRequest());
    dispatch(getProvincesRequest());
    dispatch(getPhcServicesRequest());
    dispatch(getPhcWorkersRequest({phc_service_id: profile?.phc_service_id}));
  }, [dispatch, profile?.phc_service_id]);

  useEffect(() => {
    dispatch(getDefinedCountries());
  }, [dispatch]);

  useEffect(() => {
    const detailInfo = patientsForPhcWorker.find(
      (item) => item.id === patientId,
    );
    setPatientDetail(detailInfo);
  }, [patientId, patientsForPhcWorker]);

  useFocusEffect(
    React.useCallback(() => {
      if (patientDetail) {
        reset(patientDetail);
        const formattedDOB = patientDetail.date_of_birth
          ? isValidDateFormat(patientDetail.date_of_birth)
            ? moment(patientDetail.date_of_birth, 'DD/MM/YYYY', true).toDate()
            : moment(patientDetail.date_of_birth).toDate()
          : '';
        setDateValue(formattedDOB);
        setValue('date_of_birth', formattedDOB ? formatDate(formattedDOB) : '');
        setValue(
          'phone',
          patientDetail.phone?.replace(patientDetail.dial_code, ''),
        );
        setValue('note',patientDetail.note?? '');
        setCountryPhoneCode(patientDetail.dial_code ?? '855');
        if (
          patientDetail.status === OFFLINE_STATUS.DUPLICATE_CREATE ||
          patientDetail.status === OFFLINE_STATUS.DUPLICATE_UPDATE
        ) {
          setHighlightPhone(true);
        } else {
          setHighlightPhone(false);
        }
      } else {
        reset(defaultValues);
        setDateValue('');
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
        setPendingTransfers([]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientDetail, reset, setValue, definedCountries, countries, profile]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (patientId && transfers && transfers.length) {
        const pending = transfers.filter(
          (transfer) =>
            transfer.patient_id === patientId &&
            transfer.therapist_type === 'supplementary' && !((offlineRemovePendingSupplementary ?? []).includes(transfer.id)),
        );
        const newPending = pending.map((transfer) => ({
          id: transfer.id,
          therapist_id: transfer.to_therapist.id,
          first_name: transfer.to_therapist.first_name,
          last_name: transfer.to_therapist.last_name,
          status: transfer.status,
        }));
        setPendingTransfers((prev) => {
          const therapistIds = new Set(prev.map((i) => i.therapist_id));
          return [...prev, ...newPending.filter((i) => !therapistIds.has(i.therapist_id))];
        });
      } else {
        setPendingTransfers([]);
      }
    }, [transfers, patientId, offlineRemovePendingSupplementary])
  );

  const onSubmit = (data) => {
    const payload = {
      ...data,
      phone: `${data.dial_code}${data.phone}`,
      supplementary_phc_workers: !_.isEmpty(selectedSupplementary) ? selectedSupplementary : (supplementaryPhcWorkers ?? []),
    };

    if (!netInfo.isConnected) {
      if (patientDetail) {
        dispatch(updatePatientOfflineRequest(patientDetail.id, payload));
      } else {
        dispatch(
          createPatientOfflineRequest({...payload, phc_worker_id: profile.id}),
        );
      }

      showToast(translate('phc.patient.message.create_offline_success'));

      handleGoback();
      return;
    }

    dispatch(
      getPatientByPhoneRequest(
        payload.phone,
        patientDetail ? patientDetail.id : null,
      ),
    ).then((response) => {
      if (response.success) {
        if (response.data) {
          setErrorPhoneExist(true);
          return;
        } else {
          setErrorPhoneExist(false);
          if (patientDetail) {
            if (patientDetail.status === OFFLINE_STATUS.DUPLICATE_CREATE) {
              const updatePayload = Object.fromEntries(
                Object.entries(payload).filter(
                  ([key]) => key !== 'id' && key !== 'status',
                ),
              );
              dispatch(createPatientRequest(updatePayload)).then((res) => {
                if (res.success) {
                  const updatePatientList = updateListItem(
                    patientsForPhcWorker,
                    (patient) => patient.id === patientDetail.id,
                    {
                      status: 'success',
                    },
                  );
                  dispatch(
                    mutation.patientsForPhcWorkerFetchSuccess(
                      updatePatientList,
                    ),
                  );
                  showToast(
                    translate('phc.patient.message.create_success'),
                    translate('phc.patient.create'),
                  );

                  if (offlineInterviews?.length > 0) {
                    const updateOfflineInterviews = updateListItem(
                      offlineInterviews,
                      (interview) => interview.userId === payload.id,
                      {userId: res.data.id, status: 'pending'},
                    );
                    dispatch(
                      questionnaireMutation.submitScreeningQuestionnaireOfflineSuccess(
                        updateOfflineInterviews,
                      ),
                    );
                    dispatch(
                      syncOfflineScreeningQuestionnaires(
                        updateOfflineInterviews,
                      ),
                    ).then(() => {
                      dispatch(getPatientsListForPhcWorkerRequest());
                    });
                  } else {
                    dispatch(getPatientsListForPhcWorkerRequest());
                  }

                  handleGoback();
                } else {
                  showToast(
                    translate(translate(res.message)),
                    translate('phc.patient.create'),
                  );
                }
              });

              return;
            } else if (
              patientDetail.status === OFFLINE_STATUS.DUPLICATE_UPDATE
            ) {
              dispatch(updatePatientRequest(patientDetail.id, payload)).then(
                (res) => {
                  if (res.success) {
                    const updatePatientList = updateListItem(
                      patientsForPhcWorker,
                      (patient) => patient.id === patientDetail.id,
                      {
                        status: OFFLINE_STATUS.SUCCESS,
                      },
                    );
                    dispatch(
                      mutation.patientsForPhcWorkerFetchSuccess(
                        updatePatientList,
                      ),
                    );
                    dispatch(getPatientsListForPhcWorkerRequest());
                    showToast(
                      translate('phc.patient.message.update_success'),
                      translate('phc.patient.edit'),
                    );
                    handleGoback();
                  } else {
                    showToast(
                      translate(translate(res.message)),
                      translate('phc.patient.edit'),
                    );
                  }
                },
              );

              return;
            }
            dispatch(updatePatientRequest(patientDetail.id, payload)).then(
              (res) => {
                if (res.success) {
                  showToast(
                    translate('phc.patient.message.update_success'),
                    translate('phc.patient.edit'),
                  );
                  const updatedPatients = patientsForPhcWorker.map((item) =>
                    item.id === payload.id ? payload : item,
                  );
                  dispatch(
                    mutation.patientsForPhcWorkerFetchSuccess(updatedPatients),
                  );
                  handleGoback(payload);
                } else {
                  showToast(
                    translate(translate(res.message)),
                    translate('phc.patient.edit'),
                  );
                }
              },
            );
            return;
          }

          dispatch(createPatientRequest(payload)).then((res) => {
            if (res.success) {
              reset(defaultValues);
              setDateValue('');
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

  const handleRemovePendingSupplementary = (therapistId, id) => {
    setPendingTransfers(
      pendingTransfers.filter((item) => item.therapist_id !== therapistId),
    );
    setSelectedSupplementary(
      selectedSupplementary.filter((item) => item !== therapistId),
    );

    setValue('supplementary_phc_workers', supplementaryPhcWorkers.filter((item) => item !== therapistId));

    // Update patient supplementary phc worker in patient list
    const updatedPatients = patientsForPhcWorker.map((item) =>
      item.id === patientDetail.id ? {...item, supplementary_phc_workers:supplementaryPhcWorkers.filter((supplementaryId) => supplementaryId !== therapistId)} : item,
    );
    dispatch(
      mutation.patientsForPhcWorkerFetchSuccess(updatedPatients),
    );

    if (id) {
      if (netInfo.isConnected) {
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
      } else {
        dispatch(removePendingSupplementaryOfflineRequest(id));
        showToast(
          translate(
            'phc.patient.message.pending_supplementary_phc_worker_removed',
          ),
          translate('phc.patient.pending_supplementary'),
        );
      }
    }
  };

  const handleGoback = () => {
    setPendingTransfers([]);
    setDateValue('');
    setErrorPhoneExist(false);
    setSelectedSupplementary([]);
    patientDetail &&
    patientDetail.status !== OFFLINE_STATUS.DUPLICATE_CREATE &&
    patientDetail.status !== OFFLINE_STATUS.DUPLICATE_UPDATE
      ? navigation.navigate(ROUTES.PATIENT_DETAIL, {
          patientId: patientDetail.id,
        })
      : navigation.goBack();
  };

  return (
    <>
      <HeaderBar
        title={translate(
          patientDetail ? 'phc.patient.edit' : 'phc.patient.create',
        )}
        onGoBack={() => handleGoback()}
      />
      <AppKeyboardView>
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
                      onChangeText={(text) => {
                        onChange(text);
                        if (highlightPhone) {
                          setHighlightPhone(false);
                        }
                      }}
                      errorMessage={
                        errors?.phone?.message ||
                        (errorPhoneExist
                          ? translate('error.message.phc.patient.phone_exist')
                          : undefined)
                      }
                      renderErrorMessage={!!errors.phone || errorPhoneExist}
                      inputStyle={[
                        componentStyles.inputStyle,
                        highlightPhone && styles.textDanger,
                      ]}
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
                <Text
                  accessibilityLabel={translate('phc.patient.date_of_birth')}
                  style={componentStyles.labelStyle}>
                  {translate('phc.patient.date_of_birth')}
                  <Text style={componentStyles.requiredText}> *</Text>
                </Text>
                <Controller
                  control={control}
                  name="date_of_birth"
                  rules={{
                    required: translate(
                      'error.message.phc.patient.date_of_birth.required',
                    ),
                  }}
                  render={({field: {onChange}}) => {
                    return (
                      <DatePicker
                        placeholder={translate(
                          'phc.patient.date_of_birth.placeholder',
                        )}
                        value={dateValue}
                        maximumDate={new Date()}
                        labelStyle={componentStyles.labelStyle}
                        inputStyle={componentStyles.inputStyle}
                        onSetDate={(value) => {
                          onChange(formatDate(value));
                          setDateValue(moment(value).toDate());
                        }}
                      />
                    );
                  }}
                />
                {errors.date_of_birth && (
                  <Text style={componentStyles.errorTextStyle}>
                    {errors.date_of_birth.message}
                  </Text>
                )}
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
                <Text style={componentStyles.requiredText}> *</Text>
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
                          ) && worker.id !== profile.id
                          &&
                            !(patientDetail?.supplementary_phc_workers ?? []).includes(worker.id),
                      )
                      .map((worker) => ({
                        label: `${worker.last_name} ${worker.first_name}`,
                        value: worker.id,
                      }))
                      .concat(
                        pendingTransfers.length ===
                          phcWorkers.filter((worker) => worker.id !== profile.id && !(patientDetail?.supplementary_phc_workers ?? []).includes(worker.id))
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
                      setSelectedSupplementary((prev) => [
                        ...new Set([...prev, ...selected]),
                      ]);
                      onChange(updatedAssigned);
                    }}
                  />
                )}
              />
              {supplementaryPhcWorkers?.length > 0 && (
                <View style={componentStyles.badgeContainer}>
                  {supplementaryPhcWorkers
                    .filter(
                      (id) =>
                        !pendingTransfers.some(
                          (transfer) => transfer.therapist_id === id,
                        ),
                    )
                    .map((id) => {
                      const worker = phcWorkers.find(
                        (phcWorker) => phcWorker.id === id,
                      );

                      if (!worker) return null;

                      return (
                        <View
                          key={id}
                          style={componentStyles.selectedStyle}
                        >
                          <Text style={componentStyles.selectedTextStyle}>
                            {translate('common.user.full_name', {
                              firstName: worker.first_name,
                              lastName: worker.last_name,
                            })}
                          </Text>

                          <Icon
                            name="highlight-off"
                            type="material"
                            size={20}
                            color={theme.colors.white}
                            onPress={() =>
                              handleRemovePendingSupplementary(
                                worker.id,
                              )
                            }
                            containerStyle={styles.marginLeftSm}
                          />
                        </View>
                      );
                    })}
                </View>
              )}
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
                          {translate('common.user.full_name', {
                            firstName: item.first_name,
                            lastName: item.last_name,
                          })}
                        </Text>
                        <Icon
                          name="highlight-off"
                          type="material"
                          size={20}
                          color={theme.colors.white}
                          onPress={() =>
                            handleRemovePendingSupplementary(
                              item.therapist_id,
                              item.id,
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
                patientDetail
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
              onPress={() => handleGoback()}
              disabled={loading}
            />
          </View>
          <Spinner
            visible={loading}
            overlayColor="rgba(0, 0, 0, 0.5)"
            textStyle={styles.textLight}
          />
        </ScrollView>
      </AppKeyboardView>
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
    color: variables.white,
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
    backgroundColor: variables.primary,
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
    color: variables.grey1,
    fontWeight: '200',
  },
  buttonContainer: {
    paddingHorizontal: 15,
    marginTop: 25,
    marginBottom: 20,
  },
  errorTextStyle: {
    color: variables.danger,
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
    color: variables.danger,
  },
  declineBackgroundStyle: {
    backgroundColor: variables.danger,
  },
  pendingBackgroundStyle: {
    backgroundColor: variables.primary,
  },
});

export default withTheme(CreateOrEditPatient);
