import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Text, ListItem, withTheme, Button} from 'react-native-elements';
import {ScrollView, StatusBar, View, StyleSheet, Alert} from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import {formatDate} from '../../../utils/helper';
import {
  getPatientRequest,
  activateDeactivateAccount,
  deletePatientRequest,
} from '../../../store/patient/actions';
import TreatmentStatusBadge from './TreatmentStatusBadge';
import {ROUTES} from '../../../variables/constants';
import {useShowToast} from '../../../hook/useShowToast';
import {theme} from '../../../../App';
import Badge from '../../../components/Common/Badge';
import {getTransferStatus} from '../../../utils/patient';
import {
  TRANSFER_STATUS,
  REFERRAL_STATUS,
  THERAPIST_TYPES,
} from '../../../variables/constants';

const PatientDetail = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {showToast} = useShowToast();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {patientId, patientDetail, treatmentPlan, referralTherapists} =
    route.params;
  const [showMore, setShowMore] = useState(false);

  const data = [
    {label: translate('phc.patient.phone'), value: patientDetail?.phone || ''},
    {
      label: translate('date.of.birth'),
      value:
        patientDetail?.status === 'pending'
          ? patientDetail?.date_of_birth
          : patientDetail?.date_of_birth
          ? formatDate(patientDetail.date_of_birth)
          : '',
    },
    {
      label: translate('phc.patient.therapist'),
      value: referralTherapists,
    },
    {
      label: translate('phc.patient.treatment_status'),
      value: <TreatmentStatusBadge treatmentPlan={treatmentPlan} />,
    },
    {
      label: translate('phc.patient.referral_status'),
      value: patientDetail?.referral_status ? (
        <Badge
          color={
            patientDetail.referral_status === REFERRAL_STATUS.INVITED
              ? theme.colors.orangeDark
              : patientDetail.referral_status === REFERRAL_STATUS.DECLINED
              ? theme.colors.danger
              : theme.colors.primary
          }
          value={translate(
            `phc.patient.referral_status.${patientDetail.referral_status}`,
          )}
        />
      ) : (
        ''
      ),
    },
    {
      label: translate('phc.patient.transfer_status'),
      value: getTransferStatus(patientId) ? (
        <Badge
          color={
            getTransferStatus(patientId) === TRANSFER_STATUS.DECLINED
              ? theme.colors.danger
              : theme.colors.orangeDark
          }
          value={translate(
            `phc.patient.transfer_status.${getTransferStatus(patientId)}`,
          )}
        />
      ) : (
        ''
      ),
    },
  ];

  const handleActivateDeactivateConfirm = () => {
    dispatch(
      activateDeactivateAccount(patientDetail.id, !patientDetail.enabled),
    ).then((response) => {
      if (response.success) {
        showToast(
          translate(
            patientDetail.enabled
              ? 'phc.patient.message.account_deactivated'
              : 'phc.patient.message.account_activated',
          ),
          translate('phc.patient.title'),
        );
        dispatch(getPatientRequest(patientDetail.id));
      } else {
        showToast(
          translate(translate(response.message)),
          translate('phc.patient.title'),
        );
      }
    });
  };

  const handleDeletePatientConfirm = () => {
    dispatch(deletePatientRequest(patientDetail.id)).then((response) => {
      if (response.success) {
        showToast(
          translate('phc.patient.message.patient_account_deleted'),
          translate('phc.patient.title'),
        );
        navigation.goBack();
      } else {
        showToast(
          translate(translate(response.message)),
          translate('phc.patient.title'),
        );
      }
    });
  };

  const handleDeactivateActivate = () => {
    Alert.alert(
      translate(
        patientDetail.enabled
          ? 'phc.patient.deactivate_account'
          : 'phc.patient.activate_account',
      ),
      translate(
        patientDetail.enabled
          ? 'phc.patient.message.confirm_deactivate_account'
          : 'phc.patient.message.confirm_activate_account',
      ),
      [
        {
          text: translate('phc.patient.button.cancel'),
          style: 'cancel',
        },
        {
          text: translate('phc.patient.button.confirm'),
          onPress: handleActivateDeactivateConfirm,
        },
      ],
      {cancelable: false},
    );
  };

  const handleDeletePatient = () => {
    Alert.alert(
      translate('phc.patient.delete_account'),
      translate('phc.patient.message.confirm_delete_account'),
      [
        {
          text: translate('phc.patient.button.cancel'),
          style: 'cancel',
        },
        {
          text: translate('phc.patient.button.confirm'),
          onPress: handleDeletePatientConfirm,
        },
      ],
      {cancelable: false},
    );
  };

  const handleEdit = () => {
    setShowMore(false);
    navigation.navigate(ROUTES.CREATE_EDIT_PATIENT, {patientDetail});
  };

  const handleGoback = () => {
    setShowMore(false);
    navigation.goBack();
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <HeaderBar
        onGoBack={handleGoback}
        title={translate('phc.patient.detail')}
        backgroundPrimary={true}
      />
      <ScrollView contentContainerStyle={styles.mainContainerLight}>
        <Text style={componentStyles.titleTextStyle}>
          {patientDetail?.identity}
        </Text>
        <Text style={componentStyles.titleTextBoldStyle}>
          {patientDetail?.last_name} {patientDetail?.first_name}
        </Text>
        <View>
          {data.map((item, index) => (
            <ListItem bottomDivider key={index}>
              <ListItem.Content style={componentStyles.row}>
                <Text style={componentStyles.label}>{item.label}</Text>
                {Array.isArray(item.value) ? (
                  <View style={componentStyles.badgeContainer}>
                    {item.value.map((value, itemIndex) => (
                      <Badge
                        key={itemIndex}
                        value={`${value.last_name} ${value.first_name}`}
                        color={
                          value.type === THERAPIST_TYPES.LEAD
                            ? theme.colors.primary
                            : theme.colors.orangeDark2
                        }
                      />
                    ))}
                  </View>
                ) : (
                  <Text style={componentStyles.value}>{item.value}</Text>
                )}
              </ListItem.Content>
            </ListItem>
          ))}
        </View>
        <View style={componentStyles.buttonContainer}>
          <Button
            containerStyle={styles.marginBottom}
            buttonStyle={componentStyles.interviewButtonStyle}
            title={translate('phc.patient.button.interview_patient')}
            onPress={() => {
              navigation.navigate(ROUTES.INTERVIEW_STACK, {
                patientId,
                patientDetail,
              });
            }}
          />
          <Button
            type="outline"
            disabled={
              patientDetail?.referral_status === REFERRAL_STATUS.INVITED ||
              patientDetail?.referral_status === REFERRAL_STATUS.ACCEPTED
            }
            containerStyle={styles.marginBottom}
            title={translate('phc.patient.button.patient_referral')}
            onPress={() => {
              navigation.navigate(ROUTES.PATIENT_REFERRAL, {
                patientId,
              });
            }}
          />
          <Button
            type="outline"
            containerStyle={styles.marginBottom}
            title={translate('phc.patient.button.patient_transfer')}
            onPress={() => {
              navigation.navigate(ROUTES.PATIENT_TRANSFER, {
                patientId,
              });
            }}
          />
          {!showMore && (
            <Button
              type="clear"
              containerStyle={styles.marginBottom}
              title={translate('phc.patient.button.more')}
              onPress={() => setShowMore(true)}
            />
          )}
          {showMore && (
            <>
              <Button
                containerStyle={styles.marginBottom}
                title={translate('phc.patient.button.edit_patient')}
                onPress={handleEdit}
              />
              <Button
                type="outline"
                buttonStyle={componentStyles.buttonStyle}
                titleStyle={componentStyles.titleButtonStyle}
                containerStyle={styles.marginBottom}
                title={translate(
                  patientDetail.enabled
                    ? 'phc.patient.button.deactivate_account'
                    : 'phc.patient.button.activate_account',
                )}
                onPress={handleDeactivateActivate}
              />
              <Button
                type="clear"
                titleStyle={componentStyles.titleButtonStyle}
                containerStyle={styles.marginBottom}
                title={translate('phc.patient.button.delete_account')}
                disabled={!!patientDetail.enabled}
                onPress={handleDeletePatient}
              />
            </>
          )}
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
  buttonStyle: {
    borderWidth: 0,
    backgroundColor: '#fae3e3ff',
  },
  titleButtonStyle: {
    color: theme.colors.danger,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'flex-end',
    flex: 1,
  },
});

export default withTheme(PatientDetail);
