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
} from 'react-native';
import {Button, Text, Icon, withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import CalendarStrip from '@webessentials/react-native-calendar-strip';
import moment from 'moment';
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

const calendarHeaderStyle = {
  ...styles.textLight,
  marginBottom: 10,
};

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75);
const calendarContainer = {
  height: 120,
  paddingTop: 10,
};

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
  const {
    treatmentPlan,
    offlineQuestionnaireAnswers,
    offlineActivities,
    offlineGoals,
  } = useSelector((state) => state.activity);
  const {accessToken} = useSelector((state) => state.user);
  const translate = getTranslate(localize);
  let calendarRef = useRef();
  let carouselRef = useRef();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [markedDates, setMarkDates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activePaginationIndex, setActivePaginationIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const netInfo = useNetInfo();

  const customDatesStylesFunc = (date) => {
    if (
      date.format(settings.format.date) ===
      selectedDate.format(settings.format.date)
    ) {
      return {
        dateContainerStyle: styles.dateContainerSelected,
      };
    }

    if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
      // Saturdays and Sundays
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
    const materials = treatment.activities.filter(
      (activity) =>
        activity.type === ACTIVITY_TYPES.MATERIAL &&
        activity.file &&
        activity.file.fileGroupType !== 'common.type.image',
    );
    materials.forEach((material) => {
      RNFS.downloadFile({
        fromUrl: settings.adminApiBaseURL + `/file/${material.file.id}`,
        toFile: `${location}/${material.title}_${material.file.fileName}`,
      });
    });

    RNFS.downloadFile({
      fromUrl: settings.apiBaseURL + '/treatment-plan/export/on-going',
      toFile: `${location}/${treatment.name}.pdf`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).promise.then(() => {
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
    });
  };

  useEffect(() => {
    if (!_.isEmpty(treatmentPlan)) {
      let marks = [];
      _.uniqBy(treatmentPlan.activities, 'date').map((day) => {
        marks.push({
          date: moment(day.date),
          dots: [
            {
              color: 'white',
              selectedColor: 'black',
            },
          ],
        });
      });
      setMarkDates(marks);
    }
  }, [treatmentPlan]);

  useEffect(() => {
    if (selectedDate && !_.isEmpty(treatmentPlan)) {
      const selectedActivities = treatmentPlan.activities.filter(
        (day) =>
          moment(day.date).format(settings.format.date) ===
          selectedDate.format(settings.format.date),
      );
      setActivities(selectedActivities ? selectedActivities : []);
    }
  }, [selectedDate, treatmentPlan]);

  useEffect(() => {
    if (activities?.length && selectedDate) {
      carouselRef.snapToItem(0);
      setActivePaginationIndex(0);
    }
  }, [activities, selectedDate]);

  return (
    <>
      <HeaderBar
        leftContent={{
          label: _.isEmpty(treatmentPlan)
            ? translate('tab.activities')
            : treatmentPlan.name,
        }}
        rightContent={
          _.isEmpty(treatmentPlan)
            ? null
            : {
                label: translate('common.download'),
                icon: 'download',
                iconType: 'font-awesome-5',
                onPress: () => handleDownload(treatmentPlan),
                disabled: downloading || !netInfo.isConnected,
              }
        }
      />
      <View style={styles.bgPrimary}>
        <Button
          type="outline"
          title={translate('common.today')}
          titleStyle={styles.textLight}
          buttonStyle={styles.headerButton(true)}
          containerStyle={styles.todayButton}
          onPress={handleTodayPress}
        />
        <CalendarStrip
          ref={(ref) => (calendarRef = ref)}
          selectedDate={selectedDate}
          markedDates={markedDates}
          scrollable={true}
          dateNumberStyle={styles.textLight}
          dateNameStyle={styles.textLight}
          weekendDateNameStyle={styles.textLight}
          weekendDateNumberStyle={styles.textLight}
          highlightDateNumberStyle={styles.textDefault}
          highlightDateNameStyle={styles.textDefault}
          style={calendarContainer}
          calendarHeaderStyle={calendarHeaderStyle}
          customDatesStyles={customDatesStylesFunc}
          leftSelector={[]}
          rightSelector={[]}
          onDateSelected={(date) => setSelectedDate(date)}
        />
      </View>
      {activities?.length ? (
        <ScrollView style={[styles.mainContainerLight, styles.noPadding]}>
          <View style={[styles.mainContainerLight, styles.noPadding]}>
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
            <View style={styles.activityTotalNumberContainer}>
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
            </View>
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
          <Text h4 style={styles.marginTop}>
            {translate('activity.no.task.for.this.day')}
          </Text>
        </View>
      )}
    </>
  );
};

export default withTheme(Activity);
