/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import _ from 'lodash';

import HeaderBar from '../../../components/Common/HeaderBar';
import AssessmentForm from '../_Partials/AssessmentForm';

const CompleteTask = ({route, navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {id, activityNumber} = route.params;
  const {treatmentPlan} = useSelector((state) => state.activity);
  const [activity, setActivity] = useState(undefined);

  useEffect(() => {
    if (id && treatmentPlan.activities.length) {
      const selectedActivity = _.find(treatmentPlan.activities, {id});

      if (selectedActivity) {
        setActivity(selectedActivity);
      }
    }
  }, [id, treatmentPlan]);

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={translate('activity.complete_task_number', {
          number: activityNumber,
        })}
      />
      <AssessmentForm activity={activity} navigation={navigation} />
    </>
  );
};

export default CompleteTask;
