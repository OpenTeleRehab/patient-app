import {Alert, ScrollView, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text} from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import styles from '../../../assets/styles';
import {SelectPickerField} from './PatientReferral';
import {useForm} from 'react-hook-form';
import {getPhcWorkersRequest} from '../../../store/phcService/actions';
import {Button} from 'react-native-elements';
import {ROUTES} from '../../../variables/constants';
import {
  createTransferPatientRequest,
  getTransfersRequest,
} from '../../../store/transfer/actions';
import Spinner from 'react-native-loading-spinner-overlay';

const PatientTransfer = ({navigation, route}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const {profile} = useSelector((state) => state.user);
  const {patientId} = route.params;
  const {patientsForPhcWorker} = useSelector((state) => state.patient);
  const {phcWorkers} = useSelector((state) => state.phcService);
  const {loading} = useSelector((state) => state.transfer);

  const patient = useMemo(() => {
    return patientsForPhcWorker.find((p) => p.id === patientId) || {};
  }, [patientsForPhcWorker, patientId]);

  useEffect(() => {
    dispatch(getPhcWorkersRequest(profile?.phc_service_id));
  }, [dispatch, profile?.phc_service_id]);

  const phcWorkerOptions = useMemo(
    () =>
      (phcWorkers ?? [])
        .filter((pw) => pw.id !== profile.id)
        .map((pw) => ({
          label: `${pw.last_name} ${pw.first_name}`,
          value: pw.id,
        })),
    [phcWorkers, profile],
  );

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {to_therapist_id: null},
  });

  const onSubmit = async (data) => {
    const dataPayload = {
      patient_id: patientId,
      phc_service_id: profile.phc_service_id,
      from_therapist_id: profile.id,
      therapist_type: 'lead',
      to_therapist_id: data.to_therapist_id,
    };
    const res = await dispatch(createTransferPatientRequest(dataPayload));
    if (res.success) {
      Alert.alert(
        translate('phc.patient.transfer').toString(),
        translate('success_message.transfer.create').toString(),
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
    return null;
  };

  const onBack = useCallback(() => {
    navigation.navigate(ROUTES.PATIENT_DETAIL, {
      patientId: patient.id,
    });
  }, [navigation, patient]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({});
      setIsSubmitSuccessful(false);
      dispatch(getTransfersRequest());
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
        title={translate('phc.patient.transfer')}
        backgroundPrimary={true}
      />
      <ScrollView contentContainerStyle={styles.mainContainerLightPaddingMd}>
        <View style={styles.rowGap10}>
          <Text>{patient.identity}</Text>
          <Text style={[styles.fontWeightBold, styles.fontSizeLg]}>
            {patient?.last_name} {patient?.first_name}
          </Text>
          <Text>{translate('phc.transfer_patient_description')}</Text>
          <SelectPickerField
            control={control}
            errors={errors.to_therapist_id}
            name="to_therapist_id"
            title={translate('phc.phc_worker')}
            placeholderTitle={translate('phc.select_phc_worker')}
            isRequire={true}
            itemList={phcWorkerOptions}
          />
        </View>
        <View style={[styles.rowGap10, styles.marginTopMd]}>
          <Button
            title={translate('phc.patient.button.patient_transfer')}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          />
          <Button
            disabled={loading}
            title={translate('common.cancel')}
            type="outline"
            onPress={() => {
              reset();
              onBack();
            }}
          />
        </View>
      </ScrollView>
      <Spinner
        visible={loading}
        overlayColor="rgba(0, 0, 0, 0.5)"
        textStyle={styles.textLight}
      />
    </>
  );
};

export default PatientTransfer;
