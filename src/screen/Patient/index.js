/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {Icon} from 'react-native-elements';
import {theme} from '../../../App';
import {ROUTES} from '../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import {useSelector, useDispatch} from 'react-redux';
import {getPatientsListRequest} from '../../store/patient/actions';
import PatientCard from './_Partials/PatientCard';

const Patient = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {patients, listInfo, loading} = useSelector((state) => state.patient);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setCurrentPage(listInfo.current_page);
  }, [listInfo.current_page]);

  useEffect(() => {
    dispatch(getPatientsListRequest({page_size: pageSize}));
  }, [dispatch, pageSize]);

  const loadMore = () => {
    if (loading) {
      return;
    }
    if (currentPage < listInfo.last_page) {
      dispatch(
        getPatientsListRequest({
          page_size: pageSize,
          page: currentPage + 1,
        }),
      );
    }
  };

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return (
      <View style={componentStyles.loadingStyle}>
        <ActivityIndicator size={30} color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <>
      <HeaderBar
        backgroundPrimary={true}
        setting={{
          hasSetting: true,
          onGoSetting: () => navigation.toggleDrawer(),
        }}
        leftContent={{hasLogo: true}}
      />
      <View style={styles.mainContainerLight}>
        <View style={componentStyles.titleContainerStyle}>
          <Text style={componentStyles.titleTextStyle}>
            {translate('phc.patient.list')}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.CREATE_EDIT_PATIENT)}
            style={componentStyles.buttonStyle}>
            <Icon name="add" size={20} color={theme.colors.white} />
            <Text style={componentStyles.buttonTitleStyle}>
              {translate('phc.patient.new')}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id.toString()}
          style={componentStyles.listContainer}
          contentContainerStyle={[componentStyles.contentContainer]}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.PATIENT_DETAIL, {
                  patientId: item.id,
                  treatmentPlan: item.ongoingTreatmentPlan.length
                    ? item.ongoingTreatmentPlan[0]
                    : item.upcomingTreatmentPlan
                    ? item.upcomingTreatmentPlan
                    : item.lastTreatmentPlan,
                })
              }
              activeOpacity={0.7}
              style={styles.marginBottom}>
              <PatientCard patient={item} />
            </TouchableOpacity>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.01}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

const componentStyles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  titleContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  buttonTitleStyle: {
    color: theme.colors.white,
    fontSize: 12,
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#024b68ff',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: 5,
  },
  titleTextStyle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingStyle: {
    paddingVertical: 20,
  },
});

export default Patient;
