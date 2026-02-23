/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {BottomSheet, Icon} from 'react-native-elements';
import {theme} from '../../../App';
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

const Patient = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {patientsForPhcWorker, filters} = useSelector((state) => state.patient);
  const {phcAppointmentsWithPatient, phcAppointments} = useSelector((state) => state.phcAppointment);
  const [currentFilters, setCurrentFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [patientList, setPatientList] = useState([]);
  const {profile} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCountryRequest());
    dispatch(getRegionsRequest());
    dispatch(getProvincesRequest());
    dispatch(getPhcServicesRequest());
    dispatch(getPhcWorkersRequest(profile?.phc_service_id));
  }, [dispatch, profile?.phc_service_id]);

  useEffect(() => {
    const todayAppointments = phcAppointments?.approves?.filter((appointment) =>
      moment(appointment.end_date).isSame(moment(), 'day')
    );
    const todayAppointmentWithPatients = phcAppointmentsWithPatient?.approves?.filter((appointment) =>
      moment(appointment.end_date).isSame(moment(), 'day')
    );
    const todayAppointmentsCount = (todayAppointments?.length || 0) + (todayAppointmentWithPatients?.length || 0);

    dispatch(
      updateIndicatorList({
        hasAppointment: todayAppointmentsCount  > 0,
      }),
    );
  }, [dispatch, phcAppointments, phcAppointmentsWithPatient]);

  useEffect(() => {
    dispatch(getTransfersRequest());
    dispatch(getPatientsListForPhcWorkerRequest());
    dispatch(getScreeningQuestionnaireListRequest());
  }, [dispatch]);

  useEffect(() => {
    if (patientsForPhcWorker) {
      setPatientList(patientsForPhcWorker);
    }
  }, [patientsForPhcWorker]);

  useEffect(() => {
    setCurrentFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (currentFilters && !_.isEmpty(currentFilters)) {
      const patientData = patientsForPhcWorker.filter((patient) => {
        if (currentFilters.first_name) {
          const filterValue = currentFilters.first_name.toLowerCase();
          if (!patient.first_name.toLowerCase().includes(filterValue)) {
            return false;
          }
        }

        if (currentFilters.last_name) {
          const filterValue = currentFilters.last_name.toLowerCase();
          if (!patient.last_name.toLowerCase().includes(filterValue)) {
            return false;
          }
        }

        if (
          currentFilters.date_of_birth_from ||
          currentFilters.date_of_birth_to
        ) {
          if (!patient.date_of_birth) {
            return false;
          }

          const patientDob = moment(
            patient.date_of_birth,
            'YYYY-MM-DD HH:mm:ss',
          );

          if (currentFilters.date_of_birth_from) {
            const dobFrom = moment(
              currentFilters.date_of_birth_from,
              'DD/MM/YYYY',
            ).startOf('day');
            if (patientDob.isBefore(dobFrom)) return false;
          }

          if (currentFilters.date_of_birth_to) {
            const dobTo = moment(
              currentFilters.date_of_birth_to,
              'DD/MM/YYYY',
            ).endOf('day');
            if (patientDob.isAfter(dobTo)) return false;
          }
        }

        if (currentFilters.treatment_status) {
          const treatmentStatus = getTreatmentStatus(
            patient?.ongoingTreatmentPlan?.length
              ? patient.ongoingTreatmentPlan[0]
              : patient.upcomingTreatmentPlan
              ? patient.upcomingTreatmentPlan
              : patient.lastTreatmentPlan,
          );
          if (treatmentStatus !== currentFilters.treatment_status) {
            return false;
          }
        }

        if (
          currentFilters.referral_status &&
          patient.referral_status !== currentFilters.referral_status
        ) {
          return false;
        }

        return true;
      });
      setPatientList(patientData);
    } else {
      setPatientList(patientsForPhcWorker);
    }
  }, [currentFilters, dispatch, patientsForPhcWorker]);

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
            <TouchableOpacity onPress={() => setShowFilter(true)}>
              <Icon name="tune" size={25} color={theme.colors.primary} />
              {!_.isEmpty(currentFilters) && (
                <View style={componentStyles.indicatorStyle} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        {patientList?.length > 0 ? (
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
              {!currentFilters || Object.keys(currentFilters).length === 0
                ? translate('phc.patient.list_no_data')
                : translate('phc.patient.not_match_filter')}
            </Text>
          </View>
        )}
      </View>
      <BottomSheet isVisible={showFilter} modalProps={{}}>
        <Filter filters={currentFilters} setShowFilter={setShowFilter} />
      </BottomSheet>
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
    color: theme.colors.white,
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
    backgroundColor: theme.colors.danger,
  },
});

export default Patient;
