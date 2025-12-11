import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { Text, ListItem, withTheme, Button } from 'react-native-elements';
import { ScrollView, StatusBar, View, StyleSheet } from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import { formatDate } from '../../../utils/helper';
import { getPatientRequest } from '../../../store/patient/actions';
import TreatmentStatusBadge from './TreatmentStatusBadge';


const PatientDetail = ({theme, navigation, route}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {patientId, treatmentPlan} = route.params;
  const {patient} = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getPatientRequest(patientId));
  }, [dispatch, patientId]);

  const data = [
    { label: translate('phc.patient.phone'), value: patient?.phone || '' },
    { label: translate('date.of.birth'), value: patient?.date_of_birth ? formatDate(patient.date_of_birth) : '' },
    { label: translate('phc.patient.therapist'), value: '' },
    { label: translate('phc.patient.treatment_status'), value: <TreatmentStatusBadge treatmentPlan={treatmentPlan} /> },
    { label: translate('phc.patient.referral_status'), value: '' },
    { label: translate('phc.patient.transfer_status'), value: '' },
  ];

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={translate('phc.patient.detail')}
        backgroundPrimary={true}
      />
      <ScrollView contentContainerStyle={styles.mainContainerLight}>
        <Text style={componentStyles.titleTextStyle}>{patient?.identity}</Text>
        <Text style={componentStyles.titleTextBoldStyle}>{patient?.last_name} {patient?.first_name}</Text>
        <View>
          {data.map((item, index) => (
            <ListItem bottomDivider key={index}>
              <ListItem.Content style={componentStyles.row}>
                <Text style={componentStyles.label}>{item.label}</Text>
                <Text style={componentStyles.value}>{item.value}</Text>
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
        <View style={componentStyles.buttonContainer}>
          <Button
            containerStyle={styles.marginBottom}
            buttonStyle={componentStyles.interviewButtonStyle}
            title={translate('phc.patient.interview_patient')}
          />
          <Button type="outline" containerStyle={styles.marginBottom} title={translate('phc.patient.patient_referral')} />
          <Button type="outline" containerStyle={styles.marginBottom} title={translate('phc.patient.patient_referral')} />
        </View>
      </ScrollView>
    </>
  );
};

const componentStyles = StyleSheet.create({
  titleTextStyle: {
    fontSize: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 5,
  },
  titleTextBoldStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
    fontSize: 13,
  },
  value: {
    fontSize: 12,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    marginTop: 25,
  },
  interviewButtonStyle: {
    backgroundColor: '#024b68ff',
  },
});

export default withTheme(PatientDetail);
