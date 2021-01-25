/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useRef, useState, useEffect} from 'react';
import {ScrollView, View, Dimensions, TouchableOpacity} from 'react-native';
import {Button, Card, Text, Icon, withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../variables/constants';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import settings from '../../../config/settings';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import {getTreatmentPlanRequest} from '../../store/activity/actions';
import _ from 'lodash';

const calendarHeaderStyle = {
  ...styles.textWhite,
  marginBottom: 10,
};

const calendarContainer = {
  height: 99,
  paddingTop: 10,
};

const Activity = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const {treatmentPlan} = useSelector((state) => state.activity);
  const translate = getTranslate(localize);
  let calendarRef = useRef();
  let carouselRef = useRef();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [markedDates, setMarkDates] = useState([]);
  const [activities, setActivities] = useState([]);
  const SLIDER_WIDTH = Dimensions.get('window').width;
  const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.75);
  const [activePaginationIndex, setActivePaginationIndex] = useState(0);
  const [activityNumber, setActivityNumber] = useState(
    activePaginationIndex + 1,
  );

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
        dateNameStyle: styles.textWhite,
        dateNumberStyle: styles.textWhite,
        dateContainerStyle: styles.dateContainerWeekend,
      };
    }

    return {
      dateNameStyle: styles.textWhite,
      dateNumberStyle: styles.textWhite,
      dateContainerStyle: styles.dateContainer,
    };
  };

  useEffect(() => {
    dispatch(getTreatmentPlanRequest());
  }, [dispatch]);

  const handleTodayPress = () => {
    calendarRef.setSelectedDate(moment());
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
      const incompleteActivity = activities.find(
        (activity) => activity.completed === false,
      );
      const index = incompleteActivity
        ? activities.map((e) => e.id).indexOf(incompleteActivity.id)
        : 0;
      carouselRef.snapToItem(index);
      setActivePaginationIndex(index);
    }
  }, [activities, selectedDate]);

  const RenderActivityCard = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          navigation.navigate(ROUTES.ACTIVITY_DETAIL, {
            id: item.id,
            date: selectedDate,
            activityNumber: index + 1,
          })
        }>
        <Card containerStyle={styles.activityCardContainer}>
          {item.completed ? (
            <Grayscale>
              <Card.Image
                source={{
                  uri: item.files.length
                    ? settings.adminApiBaseURL + '/file/' + item.files[0].id
                    : 'https://source.unsplash.com/1024x768/?nature',
                }}
                style={[styles.activityCardImage]}
              />
            </Grayscale>
          ) : (
            <Card.Image
              source={{
                uri: item.files.length
                  ? settings.adminApiBaseURL + '/file/' + item.files[0].id
                  : 'https://source.unsplash.com/1024x768/?nature',
              }}
              style={[styles.activityCardImage]}
            />
          )}
          <Text
            style={[styles.activityCardTitle, styles.textDefaultBold]}
            numberOfLines={3}>
            {item.title}
          </Text>
          <Text style={styles.activityCardText}>30 sets-10 reps</Text>
          <Card.Divider style={styles.activityCardDivider} />
          <View
            style={[
              styles.activityCardFooterContainer,
              {
                backgroundColor: item.completed
                  ? theme.colors.primary
                  : theme.colors.grey5,
              },
            ]}>
            <Text>
              {item.completed ? (
                <Icon
                  name="done"
                  color={theme.colors.white}
                  size={25}
                  type="material"
                />
              ) : (
                ''
              )}
            </Text>
            {item.completed ? (
              <Text
                style={[
                  {color: theme.colors.white},
                  styles.activityCardFooterText,
                ]}>
                Completed
              </Text>
            ) : (
              <Text
                style={[
                  {color: theme.colors.black},
                  styles.activityCardFooterText,
                ]}>
                To-do
              </Text>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <HeaderBar
        leftContent={{label: translate('tab.activities')}}
        rightContent={{
          label: 'Today',
          onPress: handleTodayPress,
        }}
      />
      <ScrollView style={[styles.mainContainerLight, styles.noPadding]}>
        <View style={[styles.mainContainerPrimary, styles.noPadding]}>
          <CalendarStrip
            ref={(ref) => (calendarRef = ref)}
            selectedDate={selectedDate}
            markedDates={markedDates}
            scrollable={true}
            dateNumberStyle={styles.textWhite}
            dateNameStyle={styles.textWhite}
            highlightDateNumberStyle={styles.textDark}
            highlightDateNameStyle={styles.textDark}
            style={calendarContainer}
            calendarHeaderStyle={calendarHeaderStyle}
            customDatesStyles={customDatesStylesFunc}
            leftSelector={[]}
            rightSelector={[]}
            onDateSelected={(date) => setSelectedDate(date)}
          />
        </View>
        <View style={[styles.mainContainerLight, styles.noPadding]}>
          {activities?.length ? (
            <>
              <Pagination
                dotsLength={activities.length}
                activeDotIndex={activePaginationIndex}
                containerStyle={styles.activityPaginationContainer}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                renderDots={(activeIndex) =>
                  activities.map((activity, i) => (
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
                        type={activity.completed ? 'solid' : 'outline'}
                        buttonStyle={styles.activityPaginationButton}
                      />
                    </View>
                  ))
                }
              />
              <View style={styles.activityTotalNumberContainer}>
                <Text
                  style={[
                    {color: theme.colors.orangeDark},
                    styles.activityTotalNumberText,
                  ]}>
                  {activityNumber}
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
                renderItem={RenderActivityCard}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                onSnapToItem={(index) => {
                  setActivePaginationIndex(index);
                  setActivityNumber(index + 1);
                }}
                useScrollView={false}
                activeSlideAlignment="center"
                inactiveSlideScale={1}
                firstItem={0}
              />
            </>
          ) : (
            <View style={[styles.flexCenter]}>
              <Text style={styles.marginTop}>
                {translate('activity.no_task_for_this_day')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(Activity);
