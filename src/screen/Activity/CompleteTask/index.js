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
  const [steps, setSteps] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (id && treatmentPlan.activities.length) {
      const selectedActivity = _.find(treatmentPlan.activities, {id});

      if (selectedActivity) {
        setActivity(selectedActivity);
      }
    }
  }, [id, treatmentPlan]);

  const handleGoBack = () => {
    if (step === 2) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <HeaderBar
        onGoBack={handleGoBack}
        title={translate('activity.complete_task_number', {
          number: activityNumber,
        })}
      />
      <AssessmentForm
        activity={activity}
        navigation={navigation}
        step={step}
        setStep={setStep}
        steps={steps}
        setSteps={setSteps}
      />
    </>
  );
};

export default CompleteTask;
