import React from 'react';
import {withTheme} from 'react-native-elements';
import {View, StyleSheet} from 'react-native';
import {Card, Text, Icon} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {formatDate} from '../../../utils/helper';
import TreatmentStatusBadge from './TreatmentStatusBadge';
import Badge from '../../../components/Common/Badge';
import {REFERRAL_STATUS} from '../../../variables/constants';

const PatientCard = ({patient, theme}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <Card containerStyle={componentStyles.cardContainer}>
      <View style={componentStyles.contentContainer}>
        <View style={componentStyles.leftSideContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={componentStyles.contentTextBold}>
            {patient.last_name} {patient.first_name}
          </Text>
          <Text style={componentStyles.contentText}>
            {patient?.date_of_birth
              ? patient?.status === 'pending'
                ? `(${patient?.date_of_birth})`
                : `(${formatDate(patient?.date_of_birth)})`
              : ''}
          </Text>
          {patient?.status === 'pending' && <Text> Pending Submit</Text>}
        </View>
        <View style={componentStyles.rightContainer}>
          <TreatmentStatusBadge
            treatmentPlan={
              patient?.ongoingTreatmentPlan?.length
                ? patient.ongoingTreatmentPlan[0]
                : patient.upcomingTreatmentPlan
                ? patient.upcomingTreatmentPlan
                : patient.lastTreatmentPlan
            }
          />
          <Icon
            name="chevron-right"
            type="feather"
            size={25}
            color={theme.colors.black}
          />
        </View>
      </View>
      {patient.referral_status && (
        <View style={componentStyles.referralBadgeContainer}>
          <Badge
            color={
              patient.referral_status === REFERRAL_STATUS.INVITED
                ? theme.colors.orangeDark
                : patient.referral_status === REFERRAL_STATUS.DECLINED
                ? theme.colors.danger
                : theme.colors.primary
            }
            value={translate(
              `phc.patient.referral_status.${patient.referral_status}`,
            )}
          />
        </View>
      )}
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
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
    marginRight: 10,
  },
  contentTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  contentText: {
    fontSize: 12,
    marginLeft: 5,
    flexShrink: 0,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  referralBadgeContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
});

export default withTheme(PatientCard);
