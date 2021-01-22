/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useRef, useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Card} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../variables/constants';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import settings from '../../../config/settings';

const calendarHeaderStyle = {
  ...styles.textWhite,
  marginBottom: 10,
};

const calendarContainer = {
  height: 99,
  paddingTop: 10,
};

const Activity = ({navigation}) => {
  const localize = useSelector((state) => state.localize);
  const {activities} = useSelector((state) => state.activity);
  const translate = getTranslate(localize);
  let calendarRef = useRef();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [markedDates, setMarkDates] = useState([]);

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

  const handleTodayPress = () => {
    calendarRef.setSelectedDate(moment());
  };

  useEffect(() => {
    if (activities) {
      setMarkDates([
        {
          date: moment('21-01-2021', settings.format.date),
          dots: [
            {
              color: 'white',
              selectedColor: 'black',
            },
          ],
        },
        {
          date: moment('22-01-2021', settings.format.date),
          dots: [
            {
              color: 'white',
              selectedColor: 'black',
            },
          ],
        },
      ]);
    }
  }, [activities]);

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
        {activities.map((activity) => (
          <Card key={activity.id}>
            <Card.Title>{activity.title}</Card.Title>
            <Card.Divider />
            <Button
              title="Detail"
              onPress={() =>
                navigation.navigate(ROUTES.ACTIVITY_DETAIL, {id: activity.id})
              }
            />
          </Card>
        ))}
      </ScrollView>
    </>
  );
};

export default Activity;
