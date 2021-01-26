/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {ButtonGroup, Icon, Text, withTheme} from 'react-native-elements';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../../variables/constants';
import _ from 'lodash';
import TaskDetail from '../_Patials/TaskDetail';
import AssessmentForm from '../_Patials/AssessmentForm';
import moment from 'moment';

const ActivityDetail = ({theme, route, navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {id, date, activityNumber} = route.params;
  const {treatmentPlan} = useSelector((state) => state.activity);
  const [activity, setActivity] = useState(undefined);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (id && date && treatmentPlan.activities.length) {
      const selectedActivity = _.find(treatmentPlan.activities, {
        date: moment(date).format('YYYY-MM-DD'),
        id,
      });

      if (selectedActivity) {
        setActivity(selectedActivity);
      }
    }
  }, [id, date, treatmentPlan]);

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
        {!!activity.completed &&
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
            date={date}
          />
        )}
        {tabIndex === 1 && (
          <AssessmentForm activity={activity} navigation={navigation} />
        )}
      </ScrollView>
    </>
  );
};

export default withTheme(ActivityDetail);
