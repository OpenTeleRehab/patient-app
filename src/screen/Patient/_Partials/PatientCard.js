import React from 'react';
import {withTheme} from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon } from 'react-native-elements';
import { formatDate } from '../../../utils/helper';
import TreatmentStatusBadge from './TreatmentStatusBadge';

const PatientCard = ({patient, theme}) => {
  return (
    <Card containerStyle={componentStyles.cardContainer}>
      <View style={componentStyles.contentContainer}>
        <View style={componentStyles.leftSideContainer}>
          <Text style={componentStyles.contentTextBold}>{patient.last_name} {patient.first_name}</Text>
          <Text style={componentStyles.contentText}>{patient.date_of_birth ? `(${formatDate(patient.date_of_birth)})` : ''}</Text>
        </View>
        <View style={componentStyles.rightContainer}>
          <TreatmentStatusBadge treatmentPlan={patient.ongoingTreatmentPlan.length ? patient.ongoingTreatmentPlan[0] : patient.upcomingTreatmentPlan ? patient.upcomingTreatmentPlan : patient.lastTreatmentPlan} />
          <Icon name="chevron-right" type="feather" size={25} color={theme.colors.black} />
        </View>
      </View>
    </Card>
  );
};

const componentStyles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    margin: 0,
    borderColor: 0,
    backgroundColor: '#f4fdfdff',
    elevation: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 12,
    marginLeft: 10,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
});

export default withTheme(PatientCard);
