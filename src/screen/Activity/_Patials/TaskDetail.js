/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {View} from 'react-native';
import {Button, Text, withTheme} from 'react-native-elements';
import {SliderBox} from 'react-native-image-slider-box';
import styles from '../../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../../variables/constants';
import {completeActive} from '../../../store/activity/actions';

const paginationBoxStyle = {
  bottom: -30,
};

const TaskDetail = ({theme, activity, activityNumber, navigation, date}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {isLoading} = useSelector((state) => state.activity);

  const handleCompleteTask = () => {
    if (!activity.include_feedback && !activity.get_pain_level) {
      dispatch(completeActive(activity.id)).then((res) => {
        if (res) {
          navigation.navigate(ROUTES.ACTIVITY);
        }
      });
    } else {
      navigation.navigate(ROUTES.ACTIVITY_COMPLETE_TASK, {
        id: activity.id,
        activityNumber: activityNumber,
        date: date,
      });
    }
  };

  return (
    <>
      <View style={styles.marginBottomMd}>
        <SliderBox
          dotColor={theme.colors.primary}
          inactiveDotColor={theme.colors.grey}
          paginationBoxStyle={paginationBoxStyle}
          images={[
            'https://source.unsplash.com/1024x768/?nature',
            'https://source.unsplash.com/1024x768/?water',
            'https://source.unsplash.com/1024x768/?girl',
            'https://source.unsplash.com/1024x768/?tree',
          ]}
        />
      </View>
      <View style={[styles.flexCenter, styles.marginY]}>
        <Text h4>{activity.title}</Text>
      </View>

      {activity.additional_fields?.map((additionalField, index) => (
        <View key={index} style={styles.marginBottomMd}>
          <Text h4 style={styles.underlineHeader}>
            {additionalField.field}
          </Text>
          <Text>{additionalField.value}</Text>
        </View>
      ))}

      <Button
        icon={{
          name: 'check',
          type: 'font-awesome-5',
          color: theme.colors.white,
        }}
        title={translate('activity.complete_task_number', {
          number: activityNumber,
        })}
        titleStyle={styles.textUpperCase}
        onPress={handleCompleteTask}
        disabled={isLoading || activity.completed}
      />
    </>
  );
};

export default withTheme(TaskDetail);
