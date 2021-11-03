/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {
  Button,
  Card,
  Divider,
  Icon,
  Slider,
  Text,
  withTheme,
} from 'react-native-elements';

import styles from '../../../assets/styles';

import {
  completeGoal,
  completeGoalOffline,
} from '../../../store/activity/actions';
import {ACTIVITY_TYPES, ROUTES} from '../../../variables/constants';
import _ from 'lodash';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useNetInfo} from '@react-native-community/netinfo';
import GoalChart from '../_Partials/GoalChart';
import moment from 'moment';
import quackerGoal from '../../../assets/images/quacker-goal.png';

const sliderThumbStyle = {
  width: 20,
  height: 20,
  borderRadius: 0,
};

const trackStyle = {
  height: 1,
};

const GoalDetail = ({theme, route, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {activity_id, activityNumber, day, week} = route.params;
  const {profile} = useSelector((state) => state.user);
  const {treatmentPlan, offlineGoals} = useSelector((state) => state.activity);
  const [goal, setGoal] = useState(undefined);
  const [satisfactionLevel, setSatisfactionLevel] = useState(5);
  const [isCompletedOffline, setIsCompletedOffline] = useState(false);
  const netInfo = useNetInfo();
  const type = ACTIVITY_TYPES.GOAL;
  const screenWidth = Dimensions.get('window').width;
  const painLevelValueWidth = 20;
  const left =
    (satisfactionLevel * (screenWidth - (40 - painLevelValueWidth))) / 11;

  useEffect(() => {
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    };
  }, [navigation]);

  useEffect(() => {
    if (activity_id && treatmentPlan.activities.length) {
      const selectedGoal = _.find(treatmentPlan.activities, {
        activity_id,
        type,
        day,
        week,
      });

      if (selectedGoal) {
        setGoal(selectedGoal);
      }
    }
  }, [activity_id, treatmentPlan, type, day, week]);

  useEffect(() => {
    if (goal) {
      if (goal.completed) {
        setSatisfactionLevel(goal.satisfaction);
      } else {
        const offlineGoal = offlineGoals.find((item) => {
          return (
            item.goal_id === goal.activity_id &&
            item.day === day &&
            item.week === week
          );
        });
        if (offlineGoal) {
          setSatisfactionLevel(offlineGoal.satisfaction);
          setIsCompletedOffline(true);
        }
      }
    }
  }, [goal, day, week, offlineGoals]);

  const handleSubmit = () => {
    if (netInfo.isConnected) {
      dispatch(
        completeGoal({
          satisfaction: satisfactionLevel,
          week: goal.week,
          day: goal.day,
          goal_id: goal.activity_id,
          treatment_plan_id: goal.treatment_plan_id,
        }),
      ).then((res) => {
        if (res) {
          navigation.navigate(ROUTES.ACTIVITY);
        }
      });
    } else {
      let offlineGoalsObj = _.cloneDeep(offlineGoals);
      offlineGoalsObj.push({
        satisfaction: satisfactionLevel,
        week: goal.week,
        day: goal.day,
        goal_id: goal.activity_id,
        treatment_plan_id: goal.treatment_plan_id,
        activity_id: goal.activity_id,
      });
      dispatch(completeGoalOffline(offlineGoalsObj));
      navigation.navigate(ROUTES.ACTIVITY);
    }
    navigation.navigate(ROUTES.ACTIVITY);
  };

  return (
    <>
      <HeaderBar
        rightContent={{
          label: translate('common.close'),
          onPress: () => navigation.navigate(ROUTES.ACTIVITY),
        }}
      />
      <View style={[styles.bgPrimary, styles.paddingXMd, styles.paddingY]}>
        <Text style={styles.textLight}>
          {translate('activity.goal.detail.question')}
        </Text>
      </View>
      <ScrollView>
        <Card containerStyle={styles.activityCardContainer}>
          <View
            style={[
              styles.cardWithIconHeader,
              {backgroundColor: theme.colors.blueLight4},
            ]}>
            {profile.kid_theme ? (
              <Card.Image
                source={quackerGoal}
                style={styles.activityCardImage}
                resizeMode={'cover'}
              />
            ) : (
              <>
                <View style={styles.cardWithIconWrapper}>
                  <Icon
                    name="bullseye-arrow"
                    color={theme.colors.blueDark}
                    size={100}
                    type="material-community"
                  />
                  <Text
                    style={[
                      styles.cardWithIconHeaderTitle,
                      {color: theme.colors.blueDark},
                    ]}
                    numberOfLines={1}>
                    {translate('activity.goal.satisfaction')}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.marginLeft,
                    styles.marginY,
                    {color: theme.colors.blueDark},
                  ]}>
                  {goal ? translate('activity.goal.' + goal.frequency) : ''}
                </Text>
              </>
            )}
          </View>
        </Card>

        <View
          style={[styles.marginTopLg, styles.paddingXMd, styles.marginBottom]}>
          <View style={[styles.marginBottomMd]}>
            <Text h4 numberOfLines={3} style={styles.textDefault}>
              {goal ? goal.title : ''}
            </Text>
          </View>

          <View style={[styles.flexRow, styles.fontSizeMd]}>
            <View style={{left: left, width: painLevelValueWidth}}>
              <Text style={styles.textCenter}>{satisfactionLevel}</Text>
            </View>
          </View>

          <Slider
            value={satisfactionLevel}
            onValueChange={(value) => setSatisfactionLevel(value)}
            minimumValue={0}
            maximumValue={10}
            step={1}
            thumbStyle={[sliderThumbStyle, styles.bgPrimary]}
            disabled={goal && (!!goal.completed || isCompletedOffline)}
            allowTouchTrack={
              !(goal && (!!goal.completed || isCompletedOffline))
            }
            trackStyle={[trackStyle]}
          />

          <View style={[styles.flexRow, styles.justifyContentSpaceBetween]}>
            <Text>
              {translate('activity.satisfaction_level.no_satisfaction')}
            </Text>
            <Text>
              {translate('activity.satisfaction_level.extreme_satisfaction')}
            </Text>
          </View>

          {goal && <GoalChart goal={goal} />}
        </View>
      </ScrollView>

      <Divider />
      <View style={styles.stickyButtonWrapper}>
        <Button
          containerStyle={styles.stickyButtonContainer}
          title={translate(
            goal && (goal.completed || isCompletedOffline)
              ? 'activity.completed_task_number'
              : 'activity.complete_task_number',
            {
              number: activityNumber,
            },
          )}
          onPress={handleSubmit}
          disabled={
            goal &&
            (!!goal.completed ||
              isCompletedOffline ||
              moment().isBefore(goal.date, 'day'))
          }
          disabledTitleStyle={styles.stickyDisabledTitleStyle}
        />
      </View>
    </>
  );
};

export default withTheme(GoalDetail);
