import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Text, Button, Icon, Divider, withTheme} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';
import styles from '../../../assets/styles';
import {useForm, Controller} from 'react-hook-form';
import DatePicker from '../../../components/Common/DatePicker';
import {formatDate} from '../../../utils/helper';
import moment from 'moment/moment';
import {_} from 'lodash';
import variables from '../../../assets/styles/variables';
import {updateFilters} from '../../../store/phcAppointment/actions';
import {useDispatch} from 'react-redux';

const Filter = ({theme, filters, handleClose}) => {
  const localize = useSelector((state) => state.localize);
  const dispatch = useDispatch();
  const translate = getTranslate(localize);
  const [dateValue, setDateValue] = useState();
  const defaultValues = {
    date: '',
  };
  const {
    control,
    reset,
    handleSubmit,
    formState: {isDirty},
  } = useForm({defaultValues});

  useEffect(() => {
    if (!_.isEmpty(filters)) {
      reset({date: filters.selected_to_date ? moment.utc(moment(filters.selected_to_date, 'YYYY-MM-DD HH:mm:ss')).format('DD/MM/YYYY') : ''});
      setDateValue(filters.selected_to_date ? moment.utc(moment(filters.selected_to_date, 'YYYY-MM-DD HH:mm:ss')).toDate() : '');
    }
  }, [filters, reset]);

  const onSubmit = (data) => {
    if (data.date) {
      const now = moment().utc().locale('en').format('YYYY-MM-DD HH:mm:ss');
      const date = moment().utc().locale('en').format('DD/MM/YYYY');
      const selected_from_date = data.date ? moment.utc(moment(data.date, 'DD/MM/YYYY').startOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null;
      const selected_to_date = data.date ? moment.utc(moment(data.date, 'DD/MM/YYYY').endOf('day')).locale('en').format('YYYY-MM-DD HH:mm:ss') : null;
      dispatch(updateFilters({date, now, selected_from_date, selected_to_date}));
    }
    handleClose();
  };

  const handleReset = () => {
    reset();
    setDateValue();
    dispatch(updateFilters({}));
    handleClose();
  };

  return (
      <View style={styles.mainContainerLight}>
      <View style={componentStyles.titleContainer}>
        <Icon name="filter-outline" type="material-community" size={30} color={theme.colors.primary} />
        <Text style={componentStyles.titleTextStyle}>{translate('phc.appointment.filter')}</Text>
      </View>
      <Divider />
      <View style={styles.paddingMd}>
        <Controller
          control={control}
          name="date"
          render={({field: {onChange}}) => {
            return (
              <DatePicker
                label={translate('phc.appointment.date')}
                placeholder={translate('phc.appointment.date.placeholder')}
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
      </View>
      <View style={styles.paddingXMd}>
        <Button
          containerStyle={styles.marginBottom}
          title={translate('phc.appointment.button.apply')}
          onPress={handleSubmit(onSubmit)}
          disabled={!isDirty}
        />
        <Button
          containerStyle={styles.marginBottom}
          title={translate('phc.appointment.button.reset')}
          onPress={handleReset}
        />
        <Button type="outline" containerStyle={styles.marginBottom} title={translate('phc.appointment.button.cancel')} onPress={handleClose} />
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
