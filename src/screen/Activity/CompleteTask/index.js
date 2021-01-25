/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import _ from 'lodash';

import HeaderBar from '../../../components/Common/HeaderBar';
import AssessmentForm from '../_Patials/AssessmentForm';
import styles from '../../../assets/styles';

const CompleteTask = ({route, navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {id} = route.params;
  const {activities} = useSelector((state) => state.activity);
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

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={translate('activity.complete_task_number', {
          number: activityNumber,
        })}
      />
      <ScrollView style={styles.mainContainerLight}>
        <AssessmentForm activity={activity} navigation={navigation} />
      </ScrollView>
    </>
  );
};

export default CompleteTask;
