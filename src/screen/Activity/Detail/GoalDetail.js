/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
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

import {completeGoal} from '../../../store/activity/actions';
import {ACTIVITY_TYPES, ROUTES} from '../../../variables/constants';
import _ from 'lodash';
import HeaderBar from '../../../components/Common/HeaderBar';

const styleButtonContainer = {
  position: 'absolute',
  bottom: 0,
  width: '100%',
};

const AssessmentForm = ({theme, route, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {activity_id, activityNumber, day} = route.params;
  const {treatmentPlan} = useSelector((state) => state.activity);
  const [goal, setGoal] = useState(undefined);
  const [satisfactionLevel, setSatisfactionLevel] = useState(5);
  const type = ACTIVITY_TYPES.GOAL;

  useEffect(() => {
    if (activity_id && treatmentPlan.activities.length) {
      const selectedGoal = _.find(treatmentPlan.activities, {
        activity_id,
        type,
        day,
      });

      if (selectedGoal) {
        setGoal(selectedGoal);
      }
    }
  }, [activity_id, treatmentPlan, type, day]);

  useEffect(() => {
    if (goal && goal.completed) {
      setSatisfactionLevel(goal.satisfaction);
    }
  }, [goal]);

  const handleSubmit = () => {
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
    navigation.navigate(ROUTES.ACTIVITY);
  };

  return (
    <>
      <HeaderBar
        leftContent={
          <Text numberOfLines={1} h4 style={styles.textLight}>
            {goal && goal.title}
            {goal && !!goal.completed && (
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
      <View
        style={[
          styles.bgPrimary,
          styles.paddingX,
          styles.paddingY,
          styles.listHeight,
        ]}>
        <Text style={styles.textWhite}>
          {translate('activity.goal.detail.question')}
        </Text>
      </View>
      <View>
        <Card containerStyle={styles.activityCardContainer}>
          <View
            style={[
              styles.cardWithIconHeader,
              {backgroundColor: theme.colors.blueLight3},
            ]}>
            <View style={styles.cardWithIconWrapper}>
              <Icon
                name="trending-up"
                color={theme.colors.blueDark}
                size={100}
                type="material"
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
          </View>
        </Card>
      </View>
      <View
        style={[styles.marginTopLg, styles.paddingXMd, styles.marginBottom]}>
        <View style={[styles.marginBottomMd]}>
          <Text h4 numberOfLines={3}>
            {goal ? goal.title : ''}
          </Text>
        </View>
        <View
          style={[
            styles.flexRow,
            styles.justifyContentSpaceBetween,
            styles.marginBottomMd,
          ]}>
          <View>
            <Text h5 style={styles.textPrimary}>
              {translate('activity.satisfaction_level.no_satisfaction')}
            </Text>
          </View>
          <View>
            <Text h5 style={styles.textPrimary}>
              {translate('activity.satisfaction_level.extreme_satisfaction')}
            </Text>
          </View>
        </View>
        <Slider
          value={satisfactionLevel}
          onValueChange={(value) => setSatisfactionLevel(value)}
          minimumValue={1}
          maximumValue={10}
          step={1}
          disabled={goal && !!goal.completed}
        />
      </View>
      <View style={styleButtonContainer}>
        <Divider />
        <View style={[styles.questionnaireButtonWrapper]}>
          <Button
            containerStyle={[styles.questionnaireButtonContainer]}
            icon={{
              name: 'check',
              type: 'font-awesome-5',
              color: theme.colors.white,
            }}
            title={translate(
              goal && goal.completed
                ? 'activity.completed_task_number'
                : 'activity.complete_task_number',
              {
                number: activityNumber,
              },
            )}
            titleStyle={styles.textUpperCase}
            onPress={handleSubmit}
            disabled={goal && !!goal.completed}
          />
        </View>
      </View>
    </>
  );
};

export default withTheme(AssessmentForm);
