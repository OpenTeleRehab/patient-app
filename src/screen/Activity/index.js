/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useRef, useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  Platform,
  Alert,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {Button, Text, Icon, withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import moment from 'moment/min/moment-with-locales';
import CalendarStrip from '@webessentials/react-native-calendar-strip';
import settings from '../../../config/settings';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import _ from 'lodash';
import RenderExerciseCard from './_Partials/RenderExerciseCard';
import RenderEducationMaterialCard from './_Partials/RenderEducationMaterialCard';
import RenderQuestionnaireCard from './_Partials/RenderQuestionnaireCard';
import RenderGoalCard from './_Partials/RenderGoalCard';
import {ACTIVITY_TYPES} from '../../variables/constants';
import RNFS from 'react-native-fs';
import {getDownloadDirectoryPath} from '../../utils/fileSystem';
import {useNetInfo} from '@react-native-community/netinfo';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75);

const containerPaddingBottom = {
  paddingBottom: 100,
};

const renderPaginateDots = (
  activities,
  activeIndex,
  theme,
  offlineQuestionnaireAnswers,
  offlineActivities,
  offlineGoals,
) =>
  activities.map((activity, i) => {
    let isCompletedOffline = false;
    if (!activity.completed) {
      const offlineQuestionnaireAnswer = offlineQuestionnaireAnswers.find(
        (item) => {
          return activity.id === parseInt(item.id, 10);
        },
      );
      const offlineActivity = offlineActivities.find((item) => {
        return activity.id === parseInt(item.id, 10);
      });

      const offlineGoal = offlineGoals.find((item) => {
        return (
          activity.activity_id === parseInt(item.goal_id, 10) &&
          activity.day === item.day &&
          activity.week === item.week
        );
      });

      if (offlineQuestionnaireAnswer || offlineActivity || offlineGoal) {
        isCompletedOffline = true;
      }
    }

    return (
      <View style={styles.activityPaginationView} key={i}>
        <View style={styles.activityPaginationIconContainer}>
          {i === activeIndex && (
            <Icon
              name="caret-down"
              color={theme.colors.orangeDark}
              type="font-awesome-5"
            />
          )}
        </View>
        <Button
          type={activity.completed || isCompletedOffline ? 'solid' : 'outline'}
          buttonStyle={styles.activityPaginationButton}
        />
      </View>
    );
  });

const Activity = ({theme, navigation}) => {
  const localize = useSelector((state) => state.localize);
  const {languages} = useSelector((state) => state.language);
  const {
    treatmentPlan,
    offlineQuestionnaireAnswers,
    offlineActivities,
    offlineGoals,
  } = useSelector((state) => state.activity);
  const {accessToken, profile} = useSelector((state) => state.user);
  const translate = getTranslate(localize);
  let calendarRef = useRef();
  let carouselRef = useRef();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [markedDates, setMarkDates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activePaginationIndex, setActivePaginationIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const netInfo = useNetInfo();
  const {adminApiBaseURL, apiBaseURL} = useSelector((state) => state.phone);
  // const [locale, setLocale] = useState();

  const customDatesStylesFunc = (date) => {
    if (
      date.format(settings.format.date) ===
      selectedDate.format(settings.format.date)
    ) {
      return {
        dateContainerStyle: styles.dateContainerSelected,
        highlightDateNumberStyle: styles.highlightDateNumberSelected,
      };
    }

    if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
      // Saturdays and Sundays
      return {
        dateContainerStyle: styles.dateContainerWeekend,
      };
    }

    if (
      date.format(settings.format.date) ===
      moment().format(settings.format.date)
    ) {
      // Mark today when not selected
      return {
        dateContainerStyle: styles.dateContainerWeekend,
      };
    }

    return {
      dateContainerStyle: styles.dateContainer,
    };
  };

  const handleTodayPress = () => {
    calendarRef.setSelectedDate(moment());
  };

  const handleDownload = async (treatment) => {
    setDownloading(true);
    const location = await getDownloadDirectoryPath();
    if (location === false) {
      return;
    }

    // Download education material file attached
    const datetime = moment().format('DDMMYYhhmmss');
    const materials = treatment.activities.filter(
      (activity) =>
        activity.type === ACTIVITY_TYPES.MATERIAL &&
        activity.file &&
        activity.file.fileGroupType !== 'common.type.image',
    );

    materials.forEach((material) => {
      const materialFileName = material.file.fileName
        .replace(/\s+/g, '-')
        .toLowerCase();

      RNFS.downloadFile({
        fromUrl: adminApiBaseURL + `/file/${material.file.id}`,
        toFile: `${location}/${datetime}-${material.title}-${materialFileName}`,
        readTimeout: settings.downloadFileReadTimeout,
      });
    });

    // Download ongoing treatment plan
    const treatmentFileName = treatment.name.replace(/\s+/g, '-').toLowerCase();

    RNFS.downloadFile({
      fromUrl: apiBaseURL + '/treatment-plan/on-going/export',
      toFile: `${location}/${datetime}-${treatmentFileName}.pdf`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      background: true,
      readTimeout: settings.downloadFileReadTimeout,
    })
      .promise.then(() => {
        setDownloading(false);
        if (Platform.OS === 'ios') {
          Alert.alert(
            translate('common.download'),
            translate('activity.file_has_been_downloaded_successfully'),
          );
        } else {
          ToastAndroid.show(
            translate('activity.file_has_been_downloaded_successfully'),
            ToastAndroid.SHORT,
          );
        }
      })
      .catch((err) => {
        setDownloading(false);
        if (Platform.OS === 'ios') {
          Alert.alert(translate('common.download'), err);
        } else {
          ToastAndroid.show(err, ToastAndroid.SHORT);
        }
      });
  };

  const handleNext = () => {
    if (carouselRef) {
      carouselRef.snapToNext();
    }
  };

  const handlePrevious = () => {
    if (carouselRef) {
      carouselRef.snapToPrev();
    }
  };

  useEffect(() => {
    if (languages.length && profile) {
      const languageIndex = _.findIndex(languages, {
        id: profile.language_id,
      });

      if (languageIndex > -1) {
        moment.locale(languages[languageIndex].code);

        // setLocale({
        //   name: languages[languageIndex].code,
        //   config: {
        //     months: moment.months(),
        //     weekdays: moment.weekdays(),
        //     weekdaysShort: moment.weekdaysShort(),
        //   },
        // });
      }
    }
  }, [profile, languages]);

  useEffect(() => {
    if (!_.isEmpty(treatmentPlan)) {
      let marks = [];
      _.uniqBy(treatmentPlan.activities, 'date').map((day) => {
        let date = moment(day.date);
        if (
          date.isoWeekday() === 6 ||
          date.isoWeekday() === 7 ||
          date.format(settings.format.date) ===
            moment().format(settings.format.date)
        ) {
          marks.push({
            date: moment(day.date),
            dots: [
              {
                color: theme.colors.white,
                selectedColor: theme.colors.white,
              },
            ],
          });
        } else {
          marks.push({
            date: moment(day.date),
            dots: [
              {
                color: theme.colors.black,
                selectedColor: theme.colors.white,
              },
            ],
          });
        }
      });
      setMarkDates(marks);
    }
  }, [treatmentPlan, theme]);

  useEffect(() => {
    if (selectedDate && !_.isEmpty(treatmentPlan)) {
      const selectedActivities = treatmentPlan.activities.filter((day) => {
        return (
          moment(day.date).format(settings.format.date) ===
          moment(selectedDate.toDate()).format(settings.format.date)
        );
      });
      setActivities(selectedActivities ? selectedActivities : []);
    }
  }, [selectedDate, treatmentPlan, profile]);

  useEffect(() => {
    if (activities?.length && selectedDate) {
      carouselRef.snapToItem(0);
      setActivePaginationIndex(0);
    }
  }, [activities, selectedDate]);

  return (
    <>
      <HeaderBar
        style={styles.textDefault}
        leftContent={{
          label: _.isEmpty(treatmentPlan)
            ? translate('tab.activities')
            : treatmentPlan.name,
        }}
        rightContent={{
          label: translate('common.download'),
          iconType: 'font-awesome-5',
          onPress: () => handleDownload(treatmentPlan),
          disabled:
            _.isEmpty(treatmentPlan) || downloading || !netInfo.isConnected,
        }}
      />
      <View style={styles.backgroundWhite}>
        <Button
          type="outline"
          title={<Text style={[styles.textPrimaryBold]}>{translate('common.today')}</Text>}
          titleStyle={styles.textPrimary}
          buttonStyle={styles.headerButton(true)}
          containerStyle={styles.todayButton}
          onPress={handleTodayPress}
        />
        <CalendarStrip
          ref={(ref) => (calendarRef = ref)}
          selectedDate={selectedDate}
          markedDates={markedDates}
          scrollable={true}
          dateNumberStyle={styles.dateNumber}
          dateNameStyle={styles.dateName}
          weekendDateNameStyle={styles.textLight}
          weekendDateNumberStyle={styles.textLight}
          highlightDateNumberStyle={styles.highlightDateNumber}
          highlightDateNameStyle={styles.textLight}
          style={styles.calendarContainer}
          calendarHeaderStyle={styles.calendarHeader}
          calendarHeaderContainerStyle={styles.calendarHeaderContainer}
          customDatesStyles={customDatesStylesFunc}
          iconLeftStyle={styles.calendarIconStyle}
          iconRightStyle={styles.calendarIconStyle}
          dayComponentHeight={65}
          onDateSelected={(date) => setSelectedDate(date)}
          //TODO: Change locale based on user selected language
          // locale={locale}
        />
      </View>
      {activities?.length ? (
        <ScrollView style={[styles.mainContainerLight, styles.noPadding]} showsVerticalScrollIndicator={false}>
          <View style={[styles.mainContainerLight, styles.noPadding, styles.marginBottomMd]}>
            <View
              style={[
                styles.flexRow,
                styles.flexCenter,
                styles.activityPaginationInfoContainer,
              ]}>
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={activePaginationIndex === 0}>
                <Icon
                  color={
                    activePaginationIndex === 0
                      ? theme.colors.white
                      : theme.colors.black
                  }
                  type="feather"
                  name="chevron-left"
                  size={28}
                />
              </TouchableOpacity>
              <View
                accessible={true}
                style={styles.activityTotalNumberContainer}>
                <Text
                  style={[
                    {color: theme.colors.orangeDark},
                    styles.activityTotalNumberText,
                  ]}>
                  {activePaginationIndex + 1}
                </Text>
                <Text style={styles.activityTotalNumberText}>
                  {translate('common.of_total_number', {
                    number: activities.length,
                  })}
                </Text>
                <Text style={styles.activityTotalNumberText}>
                  {translate('common.tasks_done')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleNext}
                disabled={activePaginationIndex === activities.length - 1}>
                <Icon
                  color={
                    activePaginationIndex === activities.length - 1
                      ? theme.colors.white
                      : theme.colors.black
                  }
                  type="feather"
                  name="chevron-right"
                  size={28}
                />
              </TouchableOpacity>
            </View>
            <Pagination
              dotsLength={activities.length}
              activeDotIndex={activePaginationIndex}
              containerStyle={styles.activityPaginationContainer}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
              renderDots={(activeIndex) =>
                renderPaginateDots(
                  activities,
                  activeIndex,
                  theme,
                  offlineQuestionnaireAnswers,
                  offlineActivities,
                  offlineGoals,
                )
              }
            />
            {activities.length === 1 && (
              <View style={styles.activityPaginationContainer}>
                {renderPaginateDots(
                  activities,
                  0,
                  theme,
                  offlineQuestionnaireAnswers,
                  offlineActivities,
                  offlineGoals,
                )}
              </View>
            )}
            <Carousel
              ref={(ref) => (carouselRef = ref)}
              data={activities}
              renderItem={(props) => {
                if (props.item.type === ACTIVITY_TYPES.MATERIAL) {
                  return (
                    <RenderEducationMaterialCard
                      item={props.item}
                      index={props.index}
                      theme={theme}
                      navigation={navigation}
                      translate={translate}
                      offlineActivities={offlineActivities}
                    />
                  );
                } else if (props.item.type === ACTIVITY_TYPES.EXERCISE) {
                  return (
                    <RenderExerciseCard
                      item={props.item}
                      index={props.index}
                      theme={theme}
                      navigation={navigation}
                      translate={translate}
                      offlineActivities={offlineActivities}
                    />
                  );
                } else if (props.item.type === ACTIVITY_TYPES.QUESTIONNAIRE) {
                  return (
                    <RenderQuestionnaireCard
                      item={props.item}
                      index={props.index}
                      theme={theme}
                      navigation={navigation}
                      translate={translate}
                      offlineQuestionnaireAnswers={offlineQuestionnaireAnswers}
                    />
                  );
                } else if (props.item.type === ACTIVITY_TYPES.GOAL) {
                  return (
                    <RenderGoalCard
                      item={props.item}
                      index={props.index}
                      theme={theme}
                      navigation={navigation}
                      translate={translate}
                      offlineGoals={offlineGoals}
                    />
                  );
                }
              }}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              onSnapToItem={(index) => {
                setActivePaginationIndex(index);
              }}
              useScrollView={false}
              activeSlideAlignment="center"
              inactiveSlideScale={1}
              firstItem={0}
            />
          </View>
        </ScrollView>
      ) : (
        <View
          style={[
            containerPaddingBottom,
            styles.mainContainerLight,
            styles.flexCenter,
            styles.flexColumn,
            styles.justifyContentCenter,
          ]}>
          <Text style={[styles.marginTop, styles.headerLeftTitleDark]}>
            {translate('activity.no.task.for.this.day')}
          </Text>
        </View>
      )}
    </>
  );
};

export default withTheme(Activity);
