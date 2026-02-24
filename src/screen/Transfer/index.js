/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import HeaderBar from '../../components/Common/HeaderBar';
import {componentStyles} from '../Patient';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {getPatientsByIds} from '../../store/patient/actions';
import styles from '../../assets/styles';
import TransferPatientCard from './_Partials/TransferPatientCard';
import {TRANSFER_STATUS} from '../../variables/constants';

const Transfer = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {transfers} = useSelector((state) => state.transfer);
  const {profile} = useSelector((state) => state.user);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (transfers.length) {
      const receiveTransfers = transfers.filter(
        (item) =>
          item.to_therapist_id === profile.id &&
          item.status === TRANSFER_STATUS.INVITED,
      );
      const patientIds = _.map(receiveTransfers, 'patient_id');

      dispatch(getPatientsByIds({patient_ids: patientIds})).then((data) => {
        setPatients(data);
      });
    } else {
      setPatients([]);
    }
  }, [dispatch, transfers, profile.id]);

  const filteredTransfers = transfers
    .filter(
      (t) =>
        t.to_therapist_id === profile.id &&
        t.status === TRANSFER_STATUS.INVITED,
    )
    .map((t) => ({
      ...t,
      patient: patients.find((p) => p.id === t.patient_id),
    }));

  return (
    <>
      <HeaderBar
        setting={{
          hasSetting: true,
          onGoSetting: () => navigation.toggleDrawer(),
        }}
        leftContent={{hasLogo: true}}
      />
      <View style={styles.mainContainerLight}>
        <View style={componentStyles.topContainer}>
          <View style={componentStyles.titleContainerStyle}>
            <Text style={componentStyles.titleTextStyle}>
              {translate('phc.transfer.list')}
            </Text>
          </View>
        </View>

        <FlatList
          data={filteredTransfers}
          keyExtractor={(item) => item?.id?.toString()}
          style={componentStyles.listContainer}
          contentContainerStyle={[componentStyles.contentContainer]}
          renderItem={({item}) => (
            <View style={styles.marginBottom}>
              <TransferPatientCard transferInfo={item} />
            </View>
          )}
        />
      </View>
    </>
  );
};

export default Transfer;
