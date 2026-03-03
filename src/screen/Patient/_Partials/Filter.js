import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Text, Button, Icon, Divider, withTheme} from 'react-native-elements';
import {StyleSheet, View, Platform} from 'react-native';
import {useDispatch} from 'react-redux';
import styles from '../../../assets/styles';
import {useForm, Controller} from 'react-hook-form';
import SelectPicker from '../../../components/Common/SelectPicker';
import DatePicker from '../../../components/Common/DatePicker';
import TextField from '../../../components/Common/TextField';
import {formatDate} from '../../../utils/helper';
import moment from 'moment/moment';
import {REFERRAL_STATUS, TREATMENT_STATUS} from '../../../variables/constants';
import {updateFilters} from '../../../store/patient/actions';
import _ from 'lodash';
import variables from '../../../assets/styles/variables';

const Filter = ({theme, filters, setShowFilter}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [fromDateValue, setFromDateValue] = useState('');
  const [toDateValue, setToDateValue] = useState('');
  const defaultValues = {
    first_name: '',
    last_name: '',
    date_of_birth_from: '',
    date_of_birth_to: '',
    treatment_status: '',
    referral_status: '',
  };
  const {
    control,
    reset,
    handleSubmit,
    formState: {isDirty, errors},
  } = useForm({defaultValues});

  useEffect(() => {
    if (!_.isEmpty(filters)) {
     reset(filters);
      if (filters.date_of_birth_from || filters.date_of_birth_to) {
        const from = filters.date_of_birth_from ? moment(filters.date_of_birth_from, 'DD/MM/YYYY').toDate() : null;
        const to = filters.date_of_birth_to ? moment(filters.date_of_birth_to, 'DD/MM/YYYY').toDate() : null;
        setFromDateValue(from);
        setToDateValue(to);
      }
    }
  }, [filters, reset]);

  const onSubmit = (data) => {
    const filterData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== null && value !== undefined && value !== '')
    );
    dispatch(updateFilters(filterData));
    setShowFilter(false);
  };

  const handleReset = () => {
    reset();
    dispatch(updateFilters({}));
    setShowFilter(false);
  }

  return (
      <View style={styles.mainContainerLight}>
      <View style={componentStyles.titleContainer}>
        <Icon name="filter-outline" type="material-community" size={30} color={theme.colors.primary} />
        <Text style={componentStyles.titleTextStyle}>{translate('phc.patient.filter')}</Text>
      </View>
      <Divider />
      <View style={styles.paddingMd}>
        <View style={componentStyles.twoColumnContainer}>
          <View style={componentStyles.columnContainer}>
            <Text
              accessibilityLabel={translate('phc.patient.last_name')}
              style={componentStyles.labelStyle}
            >
              {translate('phc.patient.last_name')}
            </Text>
            <Controller
              control={control}
              name="last_name"
              render={({field: {value, onChange}}) => (
                <TextField
                  placeholder={translate('phc.patient.last_name.placeholder')}
                  variant="filled"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors ? errors.last_name?.message : undefined}
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
              style={componentStyles.labelStyle}
            >
              {translate('phc.patient.first_name')}
            </Text>
            <Controller
              control={control}
              name="first_name"
              render={({field: {value, onChange}}) => (
                <TextField
                  placeholder={translate('phc.patient.first_name.placeholder')}
                  variant="filled"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors ? errors.first_name?.message : undefined}
                  renderErrorMessage={!!errors.first_name}
                  labelStyle={componentStyles.labelStyle}
                  inputStyle={componentStyles.inputStyle}
                />
              )}
            />
          </View>
        </View>
        <Text style={[componentStyles.labelStyle, componentStyles.textBold, styles.marginTop]}>
          {translate('phc.patient.date_of_birth')}:
        </Text>
        <View style={componentStyles.twoColumnContainer}>
          <View style={componentStyles.columnContainer}>
            <Controller
              control={control}
              name="date_of_birth_from"
              render={({field: {onChange}}) => {
                return (
                  <DatePicker
                    label={translate('phc.patient.from_date')}
                    placeholder={translate('phc.patient.from_date.placeholder')}
                    value={fromDateValue}
                    mode="date"
                    onSetDate={(event, selectedDate) => {
                      setShowFromDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        onChange(formatDate(selectedDate));
                        setFromDateValue(moment(selectedDate).toDate());
                        setToDateValue('');
                      }
                    }}
                    show={showFromDatePicker}
                    onClickIcon={() => setShowFromDatePicker(true)}
                    labelStyle={componentStyles.labelStyle}
                    inputStyle={componentStyles.inputStyle}
                    maximumDate={new Date()}
                  />
                );
              }}
            />
          </View>
          <View style={componentStyles.columnContainer}>
            <Controller
              control={control}
              name="date_of_birth_to"
              render={({field: {onChange}}) => {
                return (
                  <DatePicker
                    label={translate('phc.patient.to_date')}
                    placeholder={translate('phc.patient.to_date.placeholder')}
                    value={toDateValue}
                    mode="date"
                    onSetDate={(event, selectedDate) => {
                      setShowToDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        onChange(formatDate(selectedDate));
                        setToDateValue(moment(selectedDate).toDate());
                      }
                    }}
                    show={showToDatePicker}
                    onClickIcon={() => setShowToDatePicker(true)}
                    labelStyle={componentStyles.labelStyle}
                    inputStyle={componentStyles.inputStyle}
                    maximumDate={new Date()}
                    minimumDate={fromDateValue || undefined}
                  />
                );
              }}
            />
            {errors.date_of_birth_to && (
              <Text style={componentStyles.errorTextStyle}>{errors.date_of_birth_to.message}</Text>
            )}
          </View>
        </View>
        <View style={componentStyles.twoColumnContainer}>
        <View style={componentStyles.columnContainer}>
          <Text
            accessibilityLabel={translate('phc.patient.treatment_status')}
            style={componentStyles.labelStyle}
          >
            {translate('phc.patient.treatment_status')}
          </Text>
          <View style={styles.formSelectPickerContainer}>
            <Controller
              control={control}
              name="treatment_status"
              render={({field: {value, onChange}}) => (
                <SelectPicker
                  placeholder={{
                    label: translate('phc.patient.treatment_status.placeholder'),
                    value: null,
                  }}
                  value={value}
                  items={[
                    {label: translate('phc.patient.treatment_status.finished'), value: TREATMENT_STATUS.FINISHED},
                    {label: translate('phc.patient.treatment_status.planned'), value: TREATMENT_STATUS.PLANNED},
                    {label: translate('phc.patient.treatment_status.ongoing'), value: TREATMENT_STATUS.ONGOING},
                  ]}
                  onValueChange={onChange}
                  accessibilityLabel={translate('phc.patient.treatment_status')}
                  customeFontSize={13}
                />
              )}
            />
          </View>
        </View>
        <View style={componentStyles.columnContainer}>
          <Text
            accessibilityLabel={translate('phc.patient.referral_status')}
            style={componentStyles.labelStyle}
          >
            {translate('phc.patient.referral_status')}
          </Text>
          <View style={styles.formSelectPickerContainer}>
            <Controller
              control={control}
              name="referral_status"
              render={({field: {value, onChange}}) => (
                <SelectPicker
                  placeholder={{
                    label: translate('phc.patient.referral_status.placeholder'),
                    value: null,
                  }}
                  value={value}
                  items={[
                    {label: translate('phc.patient.referral_status.invited'), value: REFERRAL_STATUS.INVITED},
                    {label: translate('phc.patient.referral_status.accepted'), value: REFERRAL_STATUS.ACCEPTED},
                    {label: translate('phc.patient.referral_status.declined'), value: REFERRAL_STATUS.DECLINED},
                  ]}
                  onValueChange={onChange}
                  accessibilityLabel={translate('phc.patient.referral_status')}
                  customeFontSize={13}
                />
              )}
            />
          </View>
        </View>
        </View>
      </View>
      <View style={componentStyles.buttonContainer}>
        <Button
          containerStyle={styles.marginBottom}
          title={translate('phc.patient.button.apply')}
          onPress={handleSubmit(onSubmit)}
          disabled={!isDirty}
        />
        <Button
          containerStyle={styles.marginBottom}
          title={translate('phc.patient.button.reset')}
          onPress={handleReset}
        />
        <Button type="outline" containerStyle={styles.marginBottom} title={translate('phc.patient.button.cancel')} onPress={() => setShowFilter(false)} />
      </View>
    </View>
  );
};

const componentStyles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  twoColumnContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  columnContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    margin: 15,
  },
  titleTextStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  labelStyle: {
    fontSize: 12,
    marginBottom: 8,
    color: variables.grey1,
    fontWeight: '200',
  },
  inputStyle: {
    fontSize: 12,
  },
  textBold: {
    fontWeight: 'bold',
  },
  errorTextStyle: {
    color: variables.danger,
    fontSize: 12,
    fontWeight: '500',
    marginTop: -7,
  },
});

export default withTheme(Filter);
