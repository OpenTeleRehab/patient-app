import React, {useEffect, useState} from 'react';
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
import {getPatientRequest} from '../../../store/patient/actions';

const PatientReferral = ({navigation, route}) => {
  const localize = useSelector((state) => state.localize);
  const dispatch = useDispatch();
  const translate = getTranslate(localize);
  const {patientId} = route.params;
  const {patient} = useSelector((state) => state.patient);
  console.log('patient', patient);

  useEffect(() => {
    dispatch(getPatientRequest(patientId));
  }, [dispatch, patientId]);

  console.log('Patient ID', patientId);

  const {
    handleSubmit,
    control,
    formState: {errors},
    reset,
  } = useForm();

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const onSubmit = (data) => {
    console.log('Show Submt Data', data);
    //Call to referral api
    //Alert to Show Sucess
    Alert.alert(
      translate('refer.patient').toString(),
      translate('success.message.refer.patient').toString(),
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

    //Alert to Show Error
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({});
      setIsSubmitSuccessful(false);
      navigation.goBack();
    }
  }, [isSubmitSuccessful, reset, navigation]);

  return (
    <>
      <HeaderBar
        onGoBack={() => {
          reset();
          navigation.goBack();
        }}
        title={translate('phc.patient.detail')}
        backgroundPrimary={true}
      />
      <ScrollView contentContainerStyle={styles.mainContainerLightPaddingMd}>
        <View style={styles.rowGap10}>
          <Text>{patient.identity}</Text>
          <Text style={[styles.fontWeightBold, styles.fontSizeLg]}>
            {patient?.last_name} {patient?.first_name}
          </Text>
          <Text>Refer the patient to a rehab service within the country</Text>

          <SelectPickerField
            control={control}
            errors={errors.region}
            name="region"
            title="Region"
            placeholderTitle="Select Region ..."
            isRequire={true}
            itemList={[
              {label: 'Hi', value: 'hi'},
              {label: 'Oo', value: 'Oo'},
            ]}
          />
          <SelectPickerField
            control={control}
            errors={errors.province}
            name="province"
            title="Province"
            placeholderTitle="Select Province ..."
            itemList={[
              {label: 'testing', value: 'testing'},
              {label: 'Option1', value: 'option1'},
              {label: 'Option2', value: 'option2'},
            ]}
          />
          <SelectPickerField
            control={control}
            errors={errors.rehab_service}
            name="rehab_service"
            title="Rehab Service"
            placeholderTitle="Select Rehab Service ..."
            isRequire={true}
            itemList={[
              {label: 'Option A', value: 'A'},
              {label: 'Option B', value: 'B'},
              {label: 'Option C', value: 'C'},
            ]}
          />
        </View>
        <View style={[styles.rowGap10, styles.marginTopMd]}>
          <Button title={'Refer'} onPress={handleSubmit(onSubmit)} />
          <Button
            title={'Cancel'}
            type="outline"
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
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
              items={[
                {label: 'Hi', value: 'hi'},
                {label: 'Oo', value: 'jj'},
              ]}
              onValueChange={(val) => onChange(val)}
            />
          )}
        />
      </View>
      {errors && <HelperText message={errors.message} />}
    </View>
  );
};
