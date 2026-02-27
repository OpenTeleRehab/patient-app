import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Text, ListItem, withTheme, Button} from 'react-native-elements';
import {ScrollView, View, StyleSheet, Alert} from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import {
  activateDeactivateAccount,
  deletePatientRequest,
} from '../../../store/patient/actions';
import TreatmentStatusBadge from './TreatmentStatusBadge';
import {ROUTES} from '../../../variables/constants';
import {useShowToast} from '../../../hook/useShowToast';
import Badge from '../../../components/Common/Badge';
import {getTransferStatus} from '../../../utils/patient';
import {
  TRANSFER_STATUS,
  REFERRAL_STATUS,
  THERAPIST_TYPES,
} from '../../../variables/constants';
import {useNetInfo} from '@react-native-community/netinfo';
import {mutation} from '../../../store/patient/mutations';
import variables from '../../../assets/styles/variables';
import {referralStatusText, showDateOfBirth} from './PatientCard';
import Notification from '../../../components/Notification';

const PatientDetail = ({navigation, route, theme}) => {
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const {showToast} = useShowToast();
  const localize = useSelector((state) => state.localize);
  const {profile} = useSelector((state) => state.user);
  const translate = getTranslate(localize);
  const {patientId} = route.params;
  const {patientsForPhcWorker} = useSelector((state) => state.patient);
  const [showMore, setShowMore] = useState(false);
  const [patientDetail, setPatientDetail] = useState();
  const [treatmentPlan, setTreatmentPlan] = useState();
  const [referralTherapists, setReferralTherapists] = useState();

  const status = patientDetail?.referral_status;
  const referralReason = patientDetail?.referral_reject_reason ?? patientDetail?.referral_request_reason;
  const showReferralReason = [REFERRAL_STATUS.INVITED, REFERRAL_STATUS.DECLINED].includes(status);
  const referralReasonColor = status === REFERRAL_STATUS.INVITED ? theme.colors.orangeDark : theme.colors.danger;

  useEffect(() => {
    const detailInfo = patientsForPhcWorker.find(
      (item) => item.id === patientId,
    );
    setPatientDetail(detailInfo);
    const treatmentPlanInfo = detailInfo?.ongoingTreatmentPlan?.length
      ? detailInfo?.ongoingTreatmentPlan[0]
      : detailInfo?.upcomingTreatmentPlan
      ? detailInfo?.upcomingTreatmentPlan
      : detailInfo?.lastTreatmentPlan;
    setTreatmentPlan(treatmentPlanInfo);
    setReferralTherapists(detailInfo?.referral_therapists);
  }, [patientId, patientsForPhcWorker]);

  const localNumber = patientDetail?.phone.startsWith(patientDetail?.dial_code)
    ? patientDetail?.phone.slice(patientDetail?.dial_code.length)
    : patientDetail?.phone;

  const displayPhone = `(+${patientDetail?.dial_code}) ${localNumber}`;

  const data = [
    {label: translate('phc.patient.phone'), value: displayPhone || ''},
    {
      label: translate('date.of.birth'),
      value: showDateOfBirth(patientDetail?.date_of_birth),
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
      value: patientDetail?.referral_status &&
        <Badge
          color={
            patientDetail.referral_status === REFERRAL_STATUS.INVITED
              ? theme.colors.orangeDark
              : patientDetail.referral_status === REFERRAL_STATUS.DECLINED
              ? theme.colors.danger
              : theme.colors.primary
          }
          value={translate(
            `phc.patient.referral_status.${referralStatusText(patientDetail.referral_status)}`,
          )}
        />,
      description: showReferralReason &&
        <View style={componentStyles.referralReasonContainer}>
          <Text style={{...componentStyles.value, color:referralReasonColor}}>{referralReason}</Text>
        </View>
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
      activateDeactivateAccount(patientDetail.id, !patientDetail?.enabled),
    ).then((response) => {
      if (response.success) {
        showToast(
          translate(
            patientDetail?.enabled
              ? 'phc.patient.message.account_deactivated'
              : 'phc.patient.message.account_activated',
          ),
          translate(
            patientDetail?.enabled
              ? 'phc.patient.deactivate_account'
              : 'phc.patient.activate_account',
          ),
        );
        const patientListUpdate = patientsForPhcWorker.map((item) =>
          item.id === patientDetail.id
            ? {...item, enabled: !patientDetail?.enabled ? 1 : 0}
            : item,
        );
        setPatientDetail({
          ...patientDetail,
          enabled: !patientDetail?.enabled ? 1 : 0,
        });
        dispatch(mutation.patientsForPhcWorkerFetchSuccess(patientListUpdate));
      } else {
        showToast(
          translate(translate(response.message)),
          translate(
            patientDetail?.enabled
              ? 'phc.patient.deactivate_account'
              : 'phc.patient.activate_account',
          ),
        );
      }
    });
  };

  const handleDeletePatientConfirm = () => {
    dispatch(deletePatientRequest(patientDetail.id)).then((response) => {
      if (response.success) {
        const patientListUpdate = patientsForPhcWorker.filter(
          (item) => item.id !== patientDetail.id,
        );
        dispatch(mutation.patientsForPhcWorkerFetchSuccess(patientListUpdate));
        showToast(
          translate('phc.patient.message.patient_account_deleted'),
          translate('phc.patient.delete_account'),
        );
        navigation.goBack();
      } else {
        showToast(
          translate(translate(response.message)),
          translate('phc.patient.delete_account'),
        );
      }
    });
  };

  const handleDeactivateActivate = () => {
    Alert.alert(
      translate(
        patientDetail?.enabled
          ? 'phc.patient.deactivate_account'
          : 'phc.patient.activate_account',
      ),
      translate(
        patientDetail?.enabled
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
    navigation.navigate(ROUTES.CREATE_EDIT_PATIENT, {
      patientId,
    });
  };

  const handleGoback = () => {
    setShowMore(false);
    navigation.goBack();
  };

  return (
    <>
      <HeaderBar
        title={translate('phc.patient.detail')}
        onGoBack={handleGoback}
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
              <ListItem.Content>
                <View style={componentStyles.row}>
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
                </View>
                {item?.description}
              </ListItem.Content>
            </ListItem>
          ))}
          <Notification patientDetail={patientDetail}/>
        </View>
        <View style={componentStyles.buttonContainer}>
          <Button
            containerStyle={styles.marginBottom}
            buttonStyle={componentStyles.interviewButtonStyle}
            title={translate('phc.patient.button.interview_patient')}
            onPress={() => {
              navigation.navigate(ROUTES.INTERVIEW_STACK, {
                patientId,
              });
            }}
          />
          <Button
            type="outline"
            disabled={
              !netInfo.isConnected ||
              patientDetail?.referral_status === REFERRAL_STATUS.INVITED ||
              patientDetail?.referral_status === REFERRAL_STATUS.ACCEPTED ||
              patientDetail?.phc_worker_id !== profile.id
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
            disabled={
              !netInfo.isConnected || patientDetail?.phc_worker_id !== profile.id
            }
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
                disabled={patientDetail?.phc_worker_id !== profile.id}
                containerStyle={styles.marginBottom}
                title={translate('phc.patient.button.edit_patient')}
                onPress={handleEdit}
              />
              <Button
                buttonStyle={
                  patientDetail?.enabled
                    ? componentStyles.buttonStyle
                    : componentStyles.buttonActivateStyle
                }
                titleStyle={
                  patientDetail?.enabled
                    ? componentStyles.titleButtonStyle
                    : componentStyles.titleActivateButtonStyle
                }
                containerStyle={styles.marginBottom}
                title={translate(
                  patientDetail?.enabled
                    ? 'phc.patient.button.deactivate_account'
                    : 'phc.patient.button.activate_account',
                )}
                disabled={
                  !netInfo.isConnected ||
                  patientDetail?.phc_worker_id !== profile.id
                }
                onPress={handleDeactivateActivate}
              />
              <Button
                type="clear"
                titleStyle={componentStyles.titleButtonStyle}
                containerStyle={styles.marginBottom}
                title={translate('phc.patient.button.delete_account')}
                disabled={
                  !netInfo.isConnected ||
                  !!patientDetail?.enabled ||
                  patientDetail?.phc_worker_id !== profile.id
                }
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
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
  buttonActivateStyle: {
    borderWidth: 0,
    backgroundColor: variables.blueLight4,
  },
  titleActivateButtonStyle: {
    color: variables.white,
  },
  titleButtonStyle: {
    color: variables.danger,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'flex-end',
    flex: 1,
  },
  referralReasonContainer: {
    marginTop: 6,
  },
});

export default withTheme(PatientDetail);
