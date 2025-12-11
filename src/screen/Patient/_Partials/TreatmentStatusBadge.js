import React from 'react';
import {withTheme} from 'react-native-elements';
import moment from 'moment';
import settings from '../../../../config/settings';
import { TREATMENT_STATUS } from '../../../variables/constants';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../../../../App';
import { getTranslate } from 'react-localize-redux';
import { useSelector } from 'react-redux';

const TreatmentStatusBadge = ({treatmentPlan}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  if (!treatmentPlan) {
    return '';
  }

  const today = moment().startOf('day');
  const start = moment(treatmentPlan.start_date, settings.format.date);
  const end = moment(treatmentPlan.end_date, settings.format.date);
  let status = '';
  let badgeColor = '#f5f3f2';
  if (start.isSameOrBefore(today) && end.isSameOrAfter(today)) {
    status = TREATMENT_STATUS.ONGOING;
    badgeColor = theme.colors.success;
  } else if (start.isAfter(today)) {
    status = TREATMENT_STATUS.PLANNED;
    badgeColor = theme.colors.primary;
  } else if (end.isBefore(today)) {
    status = TREATMENT_STATUS.FINISHED;
  }

  return (
    <View style={[componentStyles.badgeContainer, {backgroundColor: badgeColor}]}>
      <Text style={[componentStyles.badgeText, {color: status === TREATMENT_STATUS.FINISHED ? theme.colors.black : theme.colors.white}]}>{translate(`phc.patient.treatment_status.${status}`)}</Text>
    </View>
  );
};

const componentStyles = StyleSheet.create({
  badgeContainer: {
    borderRadius: 13,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 9,
  },
});

export default withTheme(TreatmentStatusBadge);
