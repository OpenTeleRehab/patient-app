/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useRef, useState, useEffect} from 'react';
import {ScrollView, View, Dimensions} from 'react-native';
import {Button, Text, Icon, withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import CalendarStrip from '@webessentials/react-native-calendar-strip';
import moment from 'moment';
import settings from '../../../config/settings';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {getTreatmentPlanRequest} from '../../store/activity/actions';
import _ from 'lodash';
import RenderActivityCard from './_Patials/RenderActivityCard';

const calendarHeaderStyle = {
  ...styles.textWhite,
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

const renderPaginateDots = (activities, activeIndex, theme) =>
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
  ));

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
  const [activePaginationIndex, setActivePaginationIndex] = useState(0);

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
        rightContent={{
          label: translate('common.today'),
          onPress: handleTodayPress,
        }}
      />
      <View style={styles.bgPrimary}>
        <CalendarStrip
          ref={(ref) => (calendarRef = ref)}
          selectedDate={selectedDate}
          markedDates={markedDates}
          scrollable={true}
          dateNumberStyle={styles.textWhite}
          dateNameStyle={styles.textWhite}
          weekendDateNameStyle={styles.textWhite}
          weekendDateNumberStyle={styles.textWhite}
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
                renderPaginateDots(activities, activeIndex, theme)
              }
            />
            {activities.length === 1 && (
              <View style={styles.activityPaginationContainer}>
                {renderPaginateDots(activities, 0, theme)}
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
              renderItem={(props) =>
                RenderActivityCard(props, theme, navigation, translate)
              }
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
