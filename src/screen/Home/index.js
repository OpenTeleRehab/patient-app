/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState, useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import {Text, Button} from 'react-native-elements';
import moment from 'moment/min/moment-with-locales';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import colors from '../../assets/styles/variables/colors';
import {useDispatch, useSelector} from 'react-redux';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {getTranslate} from 'react-localize-redux';
import {getTreatmentPlanRequest} from '../../store/activity/actions';
import {getAppointmentsListRequest} from '../../store/appointment/actions';
import AppointmentCard from '../Appointment/_Partials/AppointmentCard';
import {
  getTherapistRequest,
  getPhcWorkerRequest,
} from '../../store/therapist/actions';
import {getLanguageRequest} from '../../store/language/actions';
import _ from 'lodash';
import settings from '../../../config/settings';
import {APPOINTMENT_STATUS, ROUTES} from '../../variables/constants';
import quackerWave from '../../assets/images/quacker-waving.gif';
import {updateIndicatorList} from '../../store/indicator/actions';
import {getAssistiveTechnologiesRequest} from '../../store/assistiveTechnology/actions';
import {getClinicRequest} from '../../store/clinic/actions';
import {getPhcServiceRequest} from '../../store/phcService/actions';
import useMomentLocale from '../../hook/useMomentLocale';
import useCanFetch from '../../hook/useCanFetch';

const kidThemeImageStyle = {
  width: 300,
  height: 255,
};

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const canFetch = useCanFetch();
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
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [todaySummary, setTodaySummary] = useState({
    all: 0,
    completed: 0,
  });

  useMomentLocale(languages, profile.language_id);

  useEffect(() => {
    if (canFetch) {
      dispatch(getAppointmentsListRequest({}));
      dispatch(getTreatmentPlanRequest());
      dispatch(getAssistiveTechnologiesRequest());
    }
  }, [dispatch, canFetch]);

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
      } else {
        // Today's activities were removed from the plan
        setTodaySummary({all: 0, completed: 0});
        setCompletedPercentage(0);
      }
    } else {
      setTodaySummary({all: 0, completed: 0});
      setCompletedPercentage(0);
    }
  }, [treatmentPlan, offlineQuestionnaireAnswers, offlineActivities, offlineGoals]);

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
      dispatch(getPhcWorkerRequest());
      dispatch(getClinicRequest(profile.clinic_id));
      dispatch(getPhcServiceRequest(profile.phc_service_id));
    }
  }, [dispatch, profile]);

  // Derived from the stored list (it may be stale offline), so drop the ones already over or rejected
  const {upcomingAppointment, hasAppointmentToday} = useMemo(() => {
    const now = moment();
    const upcomingAppointments = appointments.filter(
      (a) =>
        moment.utc(a.end_date).isAfter(now) &&
        ![a.therapist_status, a.patient_status].includes(
          APPOINTMENT_STATUS.REJECTED,
        ),
    );

    return {
      // Don't rely on the list order: pages loaded from the Appointment screen are appended
      upcomingAppointment: _.minBy(upcomingAppointments, (a) =>
        moment.utc(a.start_date).valueOf(),
      ),
      // Dates are UTC, so compare against today in local time
      hasAppointmentToday: upcomingAppointments.some((a) =>
        moment.utc(a.end_date).local().isSame(now, 'day'),
      ),
    };
  }, [appointments]);

  useEffect(() => {
    dispatch(
      updateIndicatorList({
        hasActivity: todaySummary.all && todaySummary.completed !== todaySummary.all,
        hasAppointment: hasAppointmentToday,
      }),
    );
  }, [dispatch, hasAppointmentToday, todaySummary]);

  return (
    <>
      <HeaderBar
        achievement={{
          hasAchievement: profile.kid_theme,
          onGoAchievement: () => navigation.navigate(ROUTES.ACHIEVEMENT),
        }}
        setting={{
          hasSetting: true,
          onGoSetting: () => navigation.toggleDrawer(),
        }}
        leftContent={{hasLogo: true}}
      />
      <ScrollView
        style={styles.mainContainerPrimary}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.flexGrow, styles.justifyContentCenter]}>
        <View
          style={[
            styles.mainContainerPrimary,
            styles.flexCenter,
            styles.flexColumn,
            styles.justifyContentCenter,
          ]}>
          {profile.kid_theme ? (
            <TouchableOpacity
              accessibilityLabel={translate('common.home.mascot')}
              onPress={() => navigation.navigate(ROUTES.ACTIVITY)}>
              <Image source={quackerWave} style={kidThemeImageStyle} />
            </TouchableOpacity>
          ) : todaySummary.all ? (
            <>
              <TouchableOpacity
                accessibilityLabel={translate('common.activities.progress')}
                onPress={() => navigation.navigate(ROUTES.ACTIVITY)}>
                <AnimatedCircularProgress
                  size={250}
                  width={20}
                  fill={completedPercentage}
                  lineCap="round"
                  tintColor={colors.white}
                  rotation={0}
                  backgroundColor={colors.blueLight}>
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
            <Text accessible={false} />
          )}
          <Text style={[styles.textLightBold, styles.marginTopMd]}>
            {translate('common.hi')}, {profile.first_name}!
          </Text>
          {todaySummary.all ? (
            <>
              <Text style={styles.textLightBold}>
                {translate('home.activity.completed', {
                  number: todaySummary.completed + '/' + todaySummary.all,
                })}
              </Text>
              <Button
                title={translate('common.start')}
                titleStyle={[styles.textPrimary, styles.fontWeightBold]}
                onPress={() => navigation.navigate(ROUTES.ACTIVITY)}
                containerStyle={[styles.marginTopMd]}
                buttonStyle={styles.bgLight}
              />
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
                <Text
                  style={[
                    styles.textLight,
                    styles.marginTop,
                    styles.headerLeftTitleLight,
                  ]}>
                  {translate('home.no.activity.for.today')}
                </Text>
              )}
            </>
          )}
        </View>

        {upcomingAppointment && (
          <View style={[styles.mainContainerPrimary, styles.marginBottomMd]}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.APPOINTMENT_DETAIL, {
                  appointment: upcomingAppointment,
                })
              }>
              <AppointmentCard appointment={upcomingAppointment} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Home;
