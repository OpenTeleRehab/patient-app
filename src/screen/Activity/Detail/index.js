/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Icon, Text, withTheme} from 'react-native-elements';
import {SliderBox} from 'react-native-image-slider-box';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../../variables/constants';
import _ from 'lodash';
import {completeActive} from '../../../store/activity/actions';

const paginationBoxStyle = {
  bottom: -30,
};

const ActivityDetail = ({theme, route, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {id} = route.params;
  const {activities, isLoading} = useSelector((state) => state.activity);
  const [activityNumber, setActivityNumber] = useState(undefined);
  const [activity, setActivity] = useState(undefined);

  useEffect(() => {
    if (id && activities.length) {
      const activityIndex = _.findIndex(activities, {id});
      if (activityIndex >= 0) {
        setActivityNumber(activityIndex + 1);
        setActivity(activities[activityIndex]);
      }
    }
  }, [id, activities]);

  const handleCompleteTask = () => {
    if (!activity.include_feedback && !activity.get_pain_level) {
      dispatch(completeActive(activity.id)).then((res) => {
        if (res) {
          navigation.navigate(ROUTES.ACTIVITY);
        }
      });
    } else {
      navigation.navigate(ROUTES.ACTIVITY_COMPLETE_TASK, {id: activity.id});
    }
  };

  if (!activity) {
    return (
      <>
        <HeaderBar
          leftContent={{label: ''}}
          rightContent={{
            label: translate('common.close'),
            onPress: () => navigation.navigate(ROUTES.ACTIVITY),
          }}
        />
      </>
    );
  }

  return (
    <>
      <HeaderBar
        leftContent={
          <Text h4 style={styles.textLight}>
            {translate('activity.activity_number', {number: activityNumber})}
            {activity.completed && (
              <Icon
                name="check"
                type="font-awesome-5"
                color={theme.colors.white}
                size={18}
                style={styles.marginLeft}
              />
            )}
          </Text>
        }
        rightContent={{
          label: translate('common.close'),
          onPress: () => navigation.navigate(ROUTES.ACTIVITY),
        }}
      />
      <ScrollView style={styles.mainContainerLight}>
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

        {activity.additional_fields.map((additionalField, index) => (
          <View key={index} style={styles.marginBottomMd}>
            <Text h4 style={styles.underlineHeader}>
              {additionalField.field}
            </Text>
            <Text>{additionalField.value}</Text>
          </View>
        ))}

        {!activity.completed && (
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
            disabled={isLoading}
          />
        )}
      </ScrollView>
    </>
  );
};

export default withTheme(ActivityDetail);
