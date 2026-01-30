import React from 'react';
import {getTranslate} from 'react-localize-redux';
import {Alert, View} from 'react-native';
import {Card, Icon, Text, withTheme} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {formatDate} from '../../../utils/helper';
import {componentStyles} from '../../Patient/_Partials/PatientCard';
import styles from '../../../assets/styles';
import colors from '../../../assets/styles/variables/colors';
import {
  acceptTransferPatientRequest,
  declineTransferPatientRequest,
  getTransfersRequest,
} from '../../../store/transfer/actions';
import Spinner from 'react-native-loading-spinner-overlay';
import {getPatientsListForPhcWorkerRequest} from '../../../store/patient/actions';
import {useShowToast} from '../../../hook/useShowToast';
import {THERAPIST_TYPES} from '../../../variables/constants';

const TransferPatientCard = ({transferInfo, theme}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {showToast} = useShowToast();
  const dispatch = useDispatch();
  const {loading} = useSelector((state) => state.transfer);
  const handleAcceptTransfer = async () => {
    Alert.alert(
      translate('phc.transfer.accept').toString(),
      translate('phc.transfer.accept_confirm_message').toString(),
      [
        {
          text: translate('common.ok').toString(),
          onPress: async () => {
            const res = await dispatch(
              acceptTransferPatientRequest(transferInfo),
            );
            if (res?.success) {
              showToast(translate('phc.transfer.message.accept_success'));
              dispatch(getTransfersRequest());
              dispatch(getPatientsListForPhcWorkerRequest());
            }
          },
        },
        {
          text: translate('common.cancel').toString(),
          onPress: () => {},
        },
      ],
      {
        cancelable: false,
      },
    );
  };
  const handelDeclineTransfer = () => {
    Alert.alert(
      translate('phc.transfer.decline').toString(),
      translate('phc.transfer.decline_confirm_message').toString(),
      [
        {
          text: translate('common.ok').toString(),
          onPress: async () => {
            const res = await dispatch(
              declineTransferPatientRequest(transferInfo),
            );
            if (res?.success) {
              showToast(translate('phc.transfer.message.decline_success'));
              dispatch(getTransfersRequest());
              dispatch(getPatientsListForPhcWorkerRequest());
            }
          },
        },
        {
          text: translate('common.cancel').toString(),
          onPress: () => {},
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  return (
    <Card containerStyle={componentStyles.cardContainer}>
      <View style={componentStyles.contentContainer}>
        <View>
          <View style={componentStyles.leftSideContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={componentStyles.contentTextBold}>
              {transferInfo?.patient?.last_name}{' '}
              {transferInfo?.patient?.first_name}
            </Text>
            <Text style={componentStyles.contentText}>
              {transferInfo?.patient?.date_of_birth
                ? transferInfo?.patient?.status === 'pending'
                  ? `(${transferInfo?.patient?.date_of_birth})`
                  : `(${formatDate(transferInfo?.patient?.date_of_birth)})`
                : ''}
            </Text>
          </View>
          <View>
            <Text>
              {transferInfo?.therapist_type===THERAPIST_TYPES.SUPPLEMENTARY?
              translate('phc.supplementary_by', {
                therapist_lastName: transferInfo?.from_therapist.last_name,
                therapist_firstName: transferInfo?.from_therapist.first_name,
              })
              :
              translate('phc.transfer_by', {
                therapist_lastName: transferInfo?.from_therapist.last_name,
                therapist_firstName: transferInfo?.from_therapist.first_name,
              })
              }
            </Text>
          </View>
        </View>
        <View style={componentStyles.rightContainer}>
          <View style={[styles.flexRow]}>
            <Icon
              reverse
              name="check"
              type="font-awesome"
              color={colors.primary}
              size={15}
              onPress={handleAcceptTransfer}
            />
            <Icon
              reverse
              name="close"
              type="font-awesome"
              color={colors.danger}
              size={15}
              onPress={handelDeclineTransfer}
            />
          </View>
        </View>
        <Spinner
          visible={loading}
          overlayColor="rgba(0, 0, 0, 0.5)"
          textStyle={styles.textLight}
        />
      </View>
    </Card>
  );
};

export default withTheme(TransferPatientCard);
