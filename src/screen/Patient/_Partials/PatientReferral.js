import React, {useCallback, useEffect, useMemo, useState} from 'react';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Alert, ScrollView, View} from 'react-native';
import styles from '../../../assets/styles';
import {Text} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import SelectPicker from '../../../components/Common/SelectPicker';
import {Button} from 'react-native-elements';
import colors from '../../../assets/styles/variables/colors';
import HelperText from '../../../components/ScreeningQuestionnaire/HelperText';
import {
  getPatientRequest,
  getPatientsListRequest,
} from '../../../store/patient/actions';
import {getRegionsRequest} from '../../../store/region/actions';
import {getProvincesByUserCountryRequest} from '../../../store/province/actions';
import {getClinicListRequest} from '../../../store/clinic/actions';
import {createReferralRequest} from '../../../store/referral/actions';
import {ROUTES} from '../../../variables/constants';
import Spinner from 'react-native-loading-spinner-overlay';

const PatientReferral = ({navigation, route}) => {
  const localize = useSelector((state) => state.localize);
  const dispatch = useDispatch();
  const translate = getTranslate(localize);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const {profile} = useSelector((state) => state.user);
  const {patientId} = route.params;
  const {patients} = useSelector((state) => state.patient);
  const {regions} = useSelector((state) => state.region);
  const {provincesByUserCountry} = useSelector((state) => state.province);
  const {clinicList} = useSelector((state) => state.clinic);
  const {loading} = useSelector((state) => state.referral);

  const patient = useMemo(() => {
    return patients.find((p) => p.id === patientId) || {};
  }, [patients, patientId]);

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
    watch,
  } = useForm({
    defaultValues: {
      region_id: profile.region_id,
      province_id: profile.province_id,
    },
  });

  useEffect(() => {
    dispatch(getPatientRequest(patientId));
    dispatch(getRegionsRequest());
    dispatch(getProvincesByUserCountryRequest());
    dispatch(getClinicListRequest(profile.country_id));
  }, [dispatch, patientId, profile.country_id]);

  const regionId = watch('region_id');
  const provinceId = watch('province_id');

  const regionOptions = useMemo(() => {
    return (regions ?? []).map((p) => ({label: p.name, value: p.id}));
  }, [regions]);

  const provinceOptions = useMemo(() => {
    const list = provincesByUserCountry?.data ?? [];
    return list
      .filter((p) => p.region_id === regionId)
      .map((p) => ({label: p.name, value: p.id}));
  }, [provincesByUserCountry, regionId]);

  const clinicOptions = useMemo(() => {
    return clinicList
      .filter((c) => c?.province?.id === provinceId)
      .map((c) => ({label: c.name, value: c.id}));
  }, [clinicList, provinceId]);

  const onSubmit = async (data) => {
    const dataPayload = {
      patient_id: patientId,
      to_clinic_id: data.to_clinic_id,
    };
    const res = await dispatch(createReferralRequest(dataPayload));
    if (res) {
      Alert.alert(
        translate('phc.patient.button.patient_referral').toString(),
        translate('success_message.referral.create').toString(),
        [
          {
            text: translate('common.ok').toString(),
            onPress: () => {
              setIsSubmitSuccessful(true);
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    }
  };

  const onBack = useCallback(() => {
    navigation.navigate(ROUTES.PATIENT_DETAIL, {
      patientId: patient.id,
      treatmentPlan: patient.ongoingTreatmentPlan.length
        ? patient.ongoingTreatmentPlan[0]
        : patient.upcomingTreatmentPlan
        ? patient.upcomingTreatmentPlan
        : patient.lastTreatmentPlan,
      referralTherapists: patient.referral_therapists,
    });
  }, [navigation, patient]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({});
      setIsSubmitSuccessful(false);
      dispatch(getPatientRequest(patient.id));
      dispatch(
        getPatientsListRequest({
          page_size: 10,
          page: 1,
          filters: [],
        }),
      );
      onBack();
    }
  }, [isSubmitSuccessful, reset, navigation, patient, dispatch, onBack]);

  return (
    <>
      <HeaderBar
        onGoBack={() => {
          reset();
          onBack();
        }}
        title={translate('phc.patient.referral')}
        backgroundPrimary={true}
      />
      <ScrollView contentContainerStyle={styles.mainContainerLightPaddingMd}>
        <View style={styles.rowGap10}>
          <Text>{patient.identity}</Text>
          <Text style={[styles.fontWeightBold, styles.fontSizeLg]}>
            {patient?.last_name} {patient?.first_name}
          </Text>
          <Text>{translate('phc.referral_patient_description')}</Text>
          <SelectPickerField
            control={control}
            errors={errors.region_id}
            name="region_id"
            title={translate('phc.patient.region')}
            placeholderTitle={translate('phc.select_region')}
            isRequire={true}
            itemList={regionOptions}
          />
          <SelectPickerField
            control={control}
            errors={errors.province_id}
            name="province_id"
            title={translate('phc.patient.province')}
            placeholderTitle={translate('phc.select_province')}
            itemList={provinceOptions}
          />
          <SelectPickerField
            control={control}
            errors={errors.to_clinic_id}
            name="to_clinic_id"
            title={translate('phc.rehab_service')}
            placeholderTitle={translate('phc.select_rehab_service')}
            isRequire={true}
            itemList={clinicOptions}
          />
        </View>
        <View style={[styles.rowGap10, styles.marginTopMd]}>
          <Button
            title={translate('phc.refer')}
            onPress={handleSubmit(onSubmit)}
          />
          <Button
            title={translate('common.cancel')}
            type="outline"
            onPress={() => {
              reset();
              onBack();
            }}
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

export default PatientReferral;

export const SelectPickerField = ({
  control,
  errors,
  name,
  title,
  itemList,
  placeholderTitle,
  isRequire,
}) => {
  return (
    <View>
      <Text accessibilityLabel={title} style={styles.marginBottom}>
        {title}
        {isRequire && <Text style={styles.textDanger}> *</Text>}
      </Text>
      <View style={styles.selectPickerContainerStyle}>
        <Controller
          control={control}
          name={name}
          rules={{
            required: isRequire ? 'This is required' : false,
          }}
          render={({field: {value, onChange}}) => (
            <SelectPicker
              placeholder={{
                label: `${placeholderTitle}`,
                value: null,
                color: colors.grey,
              }}
              value={value ?? ''}
              items={itemList}
              onValueChange={(val) => onChange(val)}
            />
          )}
        />
      </View>
      {errors && <HelperText message={errors.message} />}
    </View>
  );
};
