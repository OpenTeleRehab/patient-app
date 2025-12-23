import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Text, Button, Icon, Divider} from 'react-native-elements';
import {StyleSheet, View, Platform} from 'react-native';
import styles from '../../../assets/styles';
import {useForm, Controller} from 'react-hook-form';
import SelectPicker from '../../../components/Common/SelectPicker';
import DatePicker from '../../../components/Common/DatePicker';
import TextField from '../../../components/Common/TextField';
import {theme} from '../../../../App';
import {formatDate} from '../../../utils/helper';
import moment from 'moment/moment';

const Filter = ({filters, setFilters, setShowFilter}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
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
    if (filters && filters.length > 0) { 
      const formValues = {};
      filters.forEach((filter) => {
        if (filter.columnName === 'date_of_birth_range') {
          const from = moment(filter.from, 'DD/MM/YYYY').toDate();
          const to = moment(filter.to, 'DD/MM/YYYY').toDate();
          formValues.date_of_birth_from = filter.from;
          formValues.date_of_birth_to = filter.to;
          setFromDateValue(from);
          setToDateValue(to);
        } else {
          formValues[filter.columnName] = filter.value;
        }
      });
      reset(formValues);
     }
  }, [filters, reset]);

  const onSubmit = (data) => {
    const filterData = Object.entries(data)
    .filter(([key, value]) => value !== '' && value !== null && value !== undefined && key !== 'date_of_birth_from' && key !== 'date_of_birth_to')
    .map(([key, value]) => ({
      columnName: key,
      value: value,
    }));

    if (data.date_of_birth_from && data.date_of_birth_to) {
      filterData.push({
        columnName: 'date_of_birth_range',
        from: data.date_of_birth_from,
        to: data.date_of_birth_to,
      });
    }
    setFilters(filterData);
    setShowFilter(false);
  };

  const handleReset = () => {
    reset();
    setFilters([]);
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
              rules={{validate: (toDate) => {
                if (!fromDateValue) return true;
                if (!toDate) return  translate('phc.patient.date_of_birth_to.error');
              }}}
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
                    disabled={!fromDateValue}
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
            <Text style={theme.colors.error}> *</Text>
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
                    {label: translate('phc.patient.treatment_status.finished'), value: 1},
                    {label: translate('phc.patient.treatment_status.planned'), value: 2},
                    {label: translate('phc.patient.treatment_status.ongoing'), value: 3},
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
                    {label: translate('phc.patient.referral_status.invited'), value: 'invited'},
                    {label: translate('phc.patient.referral_status.accepted'), value: 'accepted'},
                    {label: translate('phc.patient.referral_status.declined'), value: 'declined'},
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
    color: theme.colors.grey1,
    fontWeight: '200',
  },
  inputStyle: {
    fontSize: 12,
  },
  textBold: {
    fontWeight: 'bold',
  },
  errorTextStyle: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: '500',
    marginTop: -7,
  },
});

export default Filter;
