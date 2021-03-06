/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState, useEffect} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import moment from 'moment/min/moment-with-locales';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import colors from '../../assets/styles/variables/colors';
import {useDispatch, useSelector} from 'react-redux';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {getTranslate} from 'react-localize-redux';
import {useIsDrawerOpen} from '@react-navigation/drawer';
import {getTreatmentPlanRequest} from '../../store/activity/actions';
import {getAppointmentsListRequest} from '../../store/appointment/actions';
import AppointmentCard from '../Appointment/_Partials/AppointmentCard';
import {getTherapistRequest} from '../../store/therapist/actions';
import {getLanguageRequest} from '../../store/language/actions';
import _ from 'lodash';
import settings from '../../../config/settings';
import {useNetInfo} from '@react-native-community/netinfo';
import {APPOINTMENT_STATUS, ROUTES} from '../../variables/constants';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {profile} = useSelector((state) => state.user);
  const {languages} = useSelector((state) => state.language);
  const {appointments} = useSelector((state) => state.appointment);
  const {
    treatmentPlan,
    isLoading,
    offlineQuestionnaireAnswers,
    offlineActivities,
    offlineGoals,
  } = useSelector((state) => state.activity);
  const isDrawerOpen = useIsDrawerOpen();
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [upComingAppointment, setUpComingAppointment] = useState();
  const [todaySummary, setTodaySummary] = useState({
    all: 0,
    completed: 0,
  });
  const isOnline = useNetInfo().isConnected;

  useEffect(() => {
    if (languages.length) {
      const language = languages.find((l) => l.id === profile.language_id);
      moment.locale(language ? language.code : '');
    }
  }, [languages, profile]);

  useEffect(() => {
    const tabNav = navigation.dangerouslyGetParent();
    if (isDrawerOpen) {
      tabNav.setOptions({tabBarVisible: false});
    }
    return () => {
      tabNav.setOptions({tabBarVisible: true});
    };
  }, [isDrawerOpen, navigation]);

  useEffect(() => {
    if (isOnline) {
      dispatch(getAppointmentsListRequest({page_size: 10}));
      dispatch(getTreatmentPlanRequest());
    }
  }, [dispatch, isOnline, offlineQuestionnaireAnswers]);

  useEffect(() => {
    if (!_.isEmpty(treatmentPlan)) {
      const activities = treatmentPlan.activities.filter(
        (a) =>
          moment(a.date).format(settings.format.date) ===
          moment().format(settings.format.date),
      );

      const countAll = activities.length;
      if (countAll) {
        const countCompleted = activities.filter((a) => a.completed).length;
        const countOfflineCompleted = _.intersectionBy(
          activities,
          offlineQuestionnaireAnswers,
          'id',
        ).length;
        const countOfflineActivitiesCompleted = _.intersectionBy(
          activities,
          offlineActivities,
          'id',
        ).length;
        const countOfflineGoalsCompleted = _.intersectionWith(
          activities,
          offlineGoals,
          (a, o) =>
            a.activity_id === o.activity_id &&
            a.day === o.day &&
            a.week === o.week,
        ).length;

        const totalCompletedCount =
          countOfflineCompleted +
          countCompleted +
          countOfflineActivitiesCompleted +
          countOfflineGoalsCompleted;
        setTodaySummary({all: countAll, completed: totalCompletedCount});
        setCompletedPercentage((totalCompletedCount * 100) / countAll);
      }
    } else {
      setTodaySummary({all: 0, completed: 0});
      setCompletedPercentage(0);
    }
  }, [
    treatmentPlan,
    offlineQuestionnaireAnswers,
    offlineActivities,
    offlineGoals,
  ]);

  useEffect(() => {
    if (profile) {
      const primaryTherapistIds = [profile.therapist_id];
      const secondaryTherapistIds = profile.secondary_therapists;
      dispatch(
        getTherapistRequest({
          ids: JSON.stringify(
            primaryTherapistIds.concat(secondaryTherapistIds),
          ),
        }),
      );
      dispatch(getLanguageRequest());
    }
  }, [profile, dispatch]);

  useEffect(() => {
    // Filter up-coming appointments for offline data reason
    const upComingAppointments = appointments.filter(
      (a) =>
        moment.utc(a.end_date) > moment.utc() &&
        ![a.therapist_status, a.patient_status].includes(
          APPOINTMENT_STATUS.REJECTED,
        ),
    );
    if (upComingAppointments.length) {
      setUpComingAppointment(upComingAppointments[0]);
    }
  }, [appointments]);

  return (
    <>
      <HeaderBar
        leftContent={{hasLogo: true}}
        rightContent={{
          icon: 'setting',
          iconType: 'antdesign',
          iconSize: 28,
          label: '',
          onPress: () => navigation.toggleDrawer(),
        }}
      />
      <View
        style={[
          styles.mainContainerPrimary,
          styles.flexCenter,
          styles.flexColumn,
          styles.justifyContentCenter,
        ]}>
        <Text style={styles.textLightBold}>
          {translate('common.hi')}, {profile.first_name}!
        </Text>
        {todaySummary.all ? (
          <>
            <Text h4 style={[styles.textLight, styles.marginTop]}>
              {translate('home.activities.today')}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.ACTIVITY)}>
              <AnimatedCircularProgress
                size={250}
                width={20}
                fill={completedPercentage}
                lineCap="round"
                tintColor={colors.white}
                rotation={0}
                backgroundColor={colors.blueLight}
                style={styles.marginTopMd}>
                {() => (
                  <>
                    <Text style={styles.leadText}>
                      {translate('common.completed')}
                    </Text>
                    <Text style={styles.progressTextStyle}>
                      <Text
                        style={[
                          styles.progressTextStyle,
                          styles.fontWeightBold,
                        ]}>
                        {todaySummary.completed}
                      </Text>
                      /{todaySummary.all}
                    </Text>
                  </>
                )}
              </AnimatedCircularProgress>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {isLoading === true ? (
              <ActivityIndicator
                size={60}
                color="white"
                style={styles.marginTopLg}
              />
            ) : (
              <Text h4 style={[styles.textLight, styles.marginTop]}>
                {translate('home.no.activity.for.today')}
              </Text>
            )}
          </>
        )}
      </View>

      {upComingAppointment && (
        <View style={styles.mainContainerPrimary}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.APPOINTMENT)}>
            <AppointmentCard appointment={upComingAppointment} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default Home;
