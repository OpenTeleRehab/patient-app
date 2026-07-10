/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {Icon, withTheme} from 'react-native-elements';
import {OFFLINE_STATUS, ROUTES} from '../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {getPatientsListForPhcWorkerRequest} from '../../store/patient/actions';
import PatientCard from './_Partials/PatientCard';
import {getTransfersRequest} from '../../store/transfer/actions';
import Filter from './_Partials/Filter';
import _ from 'lodash';
import moment from 'moment';
import {getTreatmentStatus} from '../../utils/patient';
import {getScreeningQuestionnaireListRequest} from '../../store/screeningQuestionnaire/actions';
import {getCountryRequest} from '../../store/country/actions';
import {getRegionsRequest} from '../../store/region/actions';
import {getProvincesRequest} from '../../store/province/actions';
import {
  getPhcServicesRequest,
  getPhcWorkersRequest,
} from '../../store/phcService/actions';
import {updateIndicatorList} from '../../store/indicator/actions';
import variables from '../../assets/styles/variables';
import {getAppointmentsRequest, getAppointmentsWithPatientRequest} from '../../store/phcAppointment/actions';
import BottomSheet, {BottomSheetScrollView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import Spinner from 'react-native-loading-spinner-overlay';

const Patient = ({navigation, theme}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {patientsForPhcWorker, filters, loading} = useSelector((state) => state.patient);
  const {phcAppointmentsWithPatient, phcAppointments} = useSelector((state) => state.phcAppointment);
  const [patientList, setPatientList] = useState([]);
  const {profile} = useSelector((state) => state.user);
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    dispatch(getCountryRequest());
    dispatch(getRegionsRequest());
    dispatch(getProvincesRequest());
    dispatch(getPhcServicesRequest());
    dispatch(getPhcWorkersRequest({phc_service_id: profile?.phc_service_id}));
  }, [dispatch, profile?.phc_service_id]);

  useEffect(() => {
      const now = new Date();
      const formattedNow = moment(now).utc().locale('en').format('YYYY-MM-DD HH:mm:ss');
      const formattedDate = moment(now).utc().locale('en').format('DD/MM/YYYY');
      dispatch(getAppointmentsWithPatientRequest({date: formattedDate, now: formattedNow}));
      dispatch(getAppointmentsRequest({date: formattedDate, now: formattedNow}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      updateIndicatorList({
        hasAppointment: phcAppointments?.upcomingAppointments + phcAppointmentsWithPatient?.upcomingAppointments  > 0,
      }),
    );
  }, [dispatch, phcAppointments, phcAppointmentsWithPatient]);

  useEffect(() => {
    dispatch(getTransfersRequest());
    dispatch(getPatientsListForPhcWorkerRequest());
    dispatch(getScreeningQuestionnaireListRequest());
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      setPatientList([]);
      return;
    }
    if (filters && !_.isEmpty(filters)) {
      const patientData = patientsForPhcWorker.filter((patient) => {
        if (filters.first_name) {
          const filterValue = filters.first_name.toLowerCase();
          if (!patient.first_name.toLowerCase().includes(filterValue)) {
            return false;
          }
        }

        if (filters.last_name) {
          const filterValue = filters.last_name.toLowerCase();
          if (!patient.last_name.toLowerCase().includes(filterValue)) {
            return false;
          }
        }

        if (
          filters.date_of_birth_from ||
          filters.date_of_birth_to
        ) {
          if (!patient.date_of_birth) {
            return false;
          }

          const patientDob = moment(
            patient.date_of_birth,
            'YYYY-MM-DD HH:mm:ss',
          );

          if (filters.date_of_birth_from) {
            const dobFrom = moment(
              filters.date_of_birth_from,
              'DD/MM/YYYY',
            ).startOf('day');
            if (patientDob.isBefore(dobFrom)) return false;
          }

          if (filters.date_of_birth_to) {
            const dobTo = moment(
              filters.date_of_birth_to,
              'DD/MM/YYYY',
            ).endOf('day');
            if (patientDob.isAfter(dobTo)) return false;
          }
        }

        if (filters.treatment_status) {
          const treatmentStatus = getTreatmentStatus(
            patient?.ongoingTreatmentPlan?.length
              ? patient.ongoingTreatmentPlan[0]
              : patient.upcomingTreatmentPlan
              ? patient.upcomingTreatmentPlan
              : patient.lastTreatmentPlan,
          );
          if (treatmentStatus !== filters.treatment_status) {
            return false;
          }
        }

        if (
          filters.referral_status &&
          patient.referral_status !== filters.referral_status
        ) {
          return false;
        }

        return true;
      });
      setPatientList(patientData);
    } else {
      setPatientList(patientsForPhcWorker);
    }
  }, [filters, patientsForPhcWorker, loading]);

  const handleOpenFilter = () => {
    bottomSheetRef.current?.expand();
  };

  const handleCloseFilter = () => {
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.3}
        pressBehavior="none"
      />
    ),
    []
  );

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
              {translate('phc.patient.list')}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.CREATE_EDIT_PATIENT)}
              style={[componentStyles.buttonStyle, styles.backgroundPrimary]}>
              <Icon name="add" size={20} color={theme.colors.white} />
              <Text style={componentStyles.buttonTitleStyle}>
                {translate('phc.patient.new')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={componentStyles.titleContainerStyle}>
            <TouchableOpacity onPress={handleOpenFilter}>
              <Icon name="tune" size={25} color={theme.colors.primary} />
              {!_.isEmpty(filters) && (
                <View style={componentStyles.indicatorStyle} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        {!loading && patientList?.length > 0 ? (
          <FlatList
            data={patientList}
            keyExtractor={(item) => item?.id?.toString()}
            style={componentStyles.listContainer}
            contentContainerStyle={[componentStyles.contentContainer]}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  item.status === OFFLINE_STATUS.DUPLICATE_CREATE ||
                  item.status === OFFLINE_STATUS.DUPLICATE_UPDATE
                    ? navigation.navigate(ROUTES.CREATE_EDIT_PATIENT, {
                        patientId: item.id,
                      })
                    : navigation.navigate(ROUTES.PATIENT_DETAIL, {
                        patientId: item.id,
                      })
                }
                activeOpacity={0.7}
                style={styles.marginBottom}>
                <PatientCard patient={item} />
              </TouchableOpacity>
            )}
            onEndReachedThreshold={0.01}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View
            style={[
              styles.alignItemsCenter,
              styles.flexColumn,
              styles.justifyContentCenter,
            ]}>
            <Text style={styles.fontSizeBase}>
              {!filters || Object.keys(filters).length === 0
                ? translate('phc.patient.list_no_data')
                : translate('phc.patient.not_match_filter')}
            </Text>
          </View>
        )}
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enableDynamicSizing={true}
        enablePanDownToClose
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustResize"
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView>
          <Filter filters={filters} handleClose={handleCloseFilter} />
        </BottomSheetScrollView>
      </BottomSheet>
      <Spinner
        visible={loading}
        overlayColor="rgba(0, 0, 0, 0.5)"
        textStyle={styles.textLight}
      />
    </>
  );
};

export const componentStyles = StyleSheet.create({
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
    color: variables.white,
    fontSize: 12,
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
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
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicatorStyle: {
    position: 'absolute',
    top: 1,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: variables.danger,
  },
});

export default withTheme(Patient);
