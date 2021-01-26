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
import moment from 'moment';

const CompleteTask = ({route, navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {id, date, activityNumber} = route.params;
  const {treatmentPlan} = useSelector((state) => state.activity);
  const [activity, setActivity] = useState(undefined);

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
