/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ButtonGroup, withTheme} from 'react-native-elements';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../../variables/constants';
import _ from 'lodash';
import TaskDetail from '../_Partials/TaskDetail';
import AssessmentForm from '../_Partials/AssessmentForm';
import {View} from 'react-native';

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
  const [steps, setSteps] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    navigation.getParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.getParent().setOptions({tabBarVisible: true});
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
        rightContent={{
          label: translate('common.close'),
          onPress: () => navigation.navigate(ROUTES.ACTIVITY),
        }}
      />

      {(!!activity.completed || isCompletedOffline) &&
        (activity.include_feedback || activity.get_pain_level) && (
          <View style={[styles.paddingX, styles.bgLight]}>
            <ButtonGroup
              onPress={(index) => setTabIndex(index)}
              buttons={[
                translate('activity.task_detail'),
                translate('activity.results'),
              ]}
              selectedIndex={tabIndex}
            />
          </View>
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
        <AssessmentForm
          activity={activity}
          navigation={navigation}
          step={step}
          setStep={setStep}
          steps={steps}
          setSteps={setSteps}
        />
      )}
    </>
  );
};

export default withTheme(ExerciseDetail);
