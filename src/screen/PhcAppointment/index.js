/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {BottomSheet, Icon, Divider, withTheme} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import HeaderBar from '../../components/Common/HeaderBar';
import AppointmentList from './_Partials/AppointmentList';
import NewRequestedAppointmentList from './_Partials/NewRequestedAppointmentList';
import {
  getAppointmentsWithPatientRequest,
  getAppointmentsRequest,
  updateAppointmentWithPatientUnreadStatus,
  updateAppointmentUnreadStatus
} from '../../store/phcAppointment/actions';
import {getTranslate} from 'react-localize-redux';
import Filter from './_Partials/Filter';
import moment from 'moment/moment';
import styles from '../../assets/styles';
import CreateOrEditAppointment from './_Partials/CreateOrEdit';
import {getAllPatientsRequest} from '../../store/patient/actions';
import {getPhcWorkersRequest} from '../../store/phcService/actions';
import {getReferralTherapistsRequest} from '../../store/therapist/actions';
import _ from 'lodash';
import variables from '../../assets/styles/variables';

const PhcAppointment = ({navigation, theme}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {phcAppointmentsWithPatient, phcAppointments, filters} = useSelector((state) => state.phcAppointment);
  const {profile} = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(0);
  const [currentFilters, setCurrentFilters] = useState(filters);
  const [showFilter, setShowFilter] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const tabs = ['appointments', 'new_requested_appointments'];

  const sortByStartDate = (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime();

  const appointments = [
    ...(phcAppointmentsWithPatient?.approves ?? []),
    ...(phcAppointments?.approves ?? []),
  ].sort(sortByStartDate);

  const newAppointments = [
    ...(phcAppointmentsWithPatient?.newAppointments ?? []),
    ...(phcAppointments?.newAppointments ?? []),
  ].sort(sortByStartDate);

  useEffect(() => {
    if (!_.isEmpty(currentFilters)) {
      dispatch(getAppointmentsWithPatientRequest(currentFilters));
      dispatch(getAppointmentsRequest(currentFilters));
    } else {
      const now = new Date();
      const formattedNow = moment(now).utc().locale('en').format('YYYY-MM-DD HH:mm:ss');
      const formattedDate = moment(now).utc().locale('en').format('DD/MM/YYYY');
      dispatch(getAppointmentsWithPatientRequest({date: formattedDate, now: formattedNow}));
      dispatch(getAppointmentsRequest({date: formattedDate, now: formattedNow}));
    }
  }, [currentFilters, dispatch]);

  useEffect(() => {
    dispatch(getAllPatientsRequest({page_size: 1000, enabled: true}));
    dispatch(getPhcWorkersRequest(profile?.phc_service_id));
    dispatch(getReferralTherapistsRequest());
  }, [dispatch, profile?.phc_service_id]);

  useEffect(() => {
    if (phcAppointmentsWithPatient?.unreadAppointments?.length > 0) {
      dispatch(updateAppointmentWithPatientUnreadStatus(_.map(phcAppointmentsWithPatient.unreadAppointments, 'id')));
    }
    if (phcAppointments?.unreadAppointments?.length > 0) {
      dispatch(updateAppointmentUnreadStatus(_.map(phcAppointments.unreadAppointments, 'id')));
    }
  }, [dispatch, phcAppointmentsWithPatient, phcAppointments]);

  return (
    <>
      <HeaderBar
        setting={{
          hasSetting: true,
          onGoSetting: () => navigation.toggleDrawer(),
        }}
        leftContent={{hasLogo: true}}
      />
      <View style={componentStyles.contentContainer}>
        <View style={componentStyles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTab(index)}
              style={[componentStyles.tab, activeTab === index ? componentStyles.activeTab : null]}
              activeOpacity={0.7}
            >
              <View style={componentStyles.titleContainer}>
                <Text
                  style={[
                    componentStyles.title,
                    activeTab === index
                      ? componentStyles.activeTitle
                      : componentStyles.inactiveTitle,
                  ]}
                >
                  {translate(`phc.appointment.${tab}`)}
                </Text>
                {tab === 'new_requested_appointments' && (phcAppointmentsWithPatient?.newAppointments?.length > 0 || phcAppointments?.newAppointments?.length > 0) && (
                   <View style={componentStyles.badge}>
                    <Text style={componentStyles.badgeText}>{phcAppointmentsWithPatient?.newAppointments?.length + phcAppointments?.newAppointments?.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={componentStyles.buttonContainer}>
          <TouchableOpacity onPress={() => setShowForm(true)}>
           <Icon name="add-circle" size={35} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilter(true)}>
            <Icon name="tune" size={25} color={theme.colors.primary} />
            {filters.selected_from_date && (
              <View style={componentStyles.indicatorStyle} />
            )}
          </TouchableOpacity>
        </View>
        <Divider style={styles.marginTop} />
        {activeTab === 0 ? (
          <AppointmentList navigation={navigation} appointments={appointments} />
        ) : (
          <NewRequestedAppointmentList navigation={navigation} appointments={newAppointments}/>
        )}
      </View>
      <BottomSheet isVisible={showFilter}>
        <Filter filters={currentFilters} setFilters={setCurrentFilters} setShowFilter={setShowFilter} />
      </BottomSheet>
      {showForm && (
        <CreateOrEditAppointment visible={showForm} setVisible={setShowForm} navigation={navigation} />
      )}
    </>
  );
};

const componentStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: variables.primary,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
  },
  activeTitle: {
    color: variables.primary,
    fontWeight: 'bold',
  },
  inactiveTitle: {
    color: variables.black,
  },
  badge: {
    backgroundColor: variables.danger,
    borderRadius: 5,
    paddingHorizontal: 5,
    marginLeft: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: variables.white,
    fontSize: 10,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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

export default withTheme(PhcAppointment);
