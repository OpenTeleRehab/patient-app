/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ButtonGroup, Icon, Text, withTheme} from 'react-native-elements';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../../variables/constants';
import _ from 'lodash';
import TaskDetail from '../_Partials/TaskDetail';
import AssessmentForm from '../_Partials/AssessmentForm';

const ExerciseDetail = ({theme, route, navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {id, activityNumber} = route.params;
  const {treatmentPlan, offlineActivities} = useSelector(
    (state) => state.activity,
  );
  const [activity, setActivity] = useState(undefined);
  const [tabIndex, setTabIndex] = useState(0);
  const [isCompletedOffline, setIsCompletedOffline] = useState(false);

  useEffect(() => {
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    };
  }, [navigation]);

  useEffect(() => {
    if (id && treatmentPlan.activities.length) {
      const selectedActivity = _.find(treatmentPlan.activities, {
        id,
      });

      if (selectedActivity) {
        setActivity(selectedActivity);
      }
    }
  }, [id, treatmentPlan]);

  useEffect(() => {
    if (activity) {
      if (!activity.completed) {
        const offlineActivity = offlineActivities.find((item) => {
          return item.id === activity.id;
        });
        if (offlineActivity) {
          setIsCompletedOffline(true);
        }
      }
    }
  }, [activity, offlineActivities]);

  if (!activity) {
    return (
      <HeaderBar
        leftContent={{label: ''}}
        rightContent={{
          label: translate('common.close'),
          onPress: () => navigation.navigate(ROUTES.ACTIVITY),
        }}
      />
    );
  }

  return (
    <>
      <HeaderBar
        leftContent={
          <Text numberOfLines={1} h4 style={styles.textLight}>
            {activity.title}
            {(!!activity.completed || isCompletedOffline) && (
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

      {(!!activity.completed || isCompletedOffline) &&
        (activity.include_feedback || activity.get_pain_level) && (
          <ButtonGroup
            onPress={(index) => setTabIndex(index)}
            buttons={[
              translate('activity.task_detail'),
              translate('activity.results'),
            ]}
            selectedIndex={tabIndex}
          />
        )}

      {tabIndex === 0 && (
        <TaskDetail
          activity={activity}
          activityNumber={activityNumber}
          navigation={navigation}
          isCompletedOffline={isCompletedOffline}
        />
      )}
      {tabIndex === 1 && (
        <AssessmentForm activity={activity} navigation={navigation} />
      )}
    </>
  );
};

export default withTheme(ExerciseDetail);
