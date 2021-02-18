/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Button, Slider, Text} from 'react-native-elements';

import styles from '../../../assets/styles';
import NumericInput from '../../../components/Common/NumericInput';

import {completeActive} from '../../../store/activity/actions';
import {ROUTES} from '../../../variables/constants';

const styleSetsAndRapsContainer = {
  marginVertical: 72,
};

const AssessmentForm = ({activity, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {isLoading} = useSelector((state) => state.activity);
  const [painLevel, setPainLevel] = useState(1);
  const [numberOfSets, setNumberOfSets] = useState(0);
  const [numberOfReps, setNumberOfReps] = useState(0);

  useEffect(() => {
    if (activity && activity.completed) {
      setPainLevel(activity.pain_level);
      setNumberOfSets(activity.sets);
      setNumberOfReps(activity.reps);
    }
  }, [activity]);

  const handleSubmit = () => {
    dispatch(
      completeActive(activity.id, {
        pain_level: painLevel,
        sets: numberOfSets,
        reps: numberOfReps,
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
      {activity?.get_pain_level && (
        <View style={styles.marginTopLg}>
          <View style={[styles.flexCenter, styles.marginBottomMd]}>
            <Text h3 style={styles.textPrimary}>
              {translate('activity.pain_level.question')}
            </Text>
          </View>
          <View style={[styles.flexRow, styles.justifyContentSpaceBetween]}>
            <Text h4>{translate('activity.pain_level.no_paint')}</Text>
            <Text h4>{translate('activity.pain_level.worst_paint')}</Text>
          </View>
          <Slider
            value={painLevel}
            onValueChange={(value) => setPainLevel(value)}
            minimumValue={1}
            maximumValue={10}
            step={1}
            disabled={!!activity?.completed}
          />
        </View>
      )}
      {activity?.include_feedback && (
        <View style={styleSetsAndRapsContainer}>
          <View style={[styles.flexCenter, styles.marginBottomMd]}>
            <Text h3 style={styles.textPrimary}>
              {translate('activity.sets_reps.completed_label')}
            </Text>
          </View>
          <View style={[styles.flexRow, styles.justifyContentSpaceAround]}>
            <View>
              <Text h4>{translate('activity.sets')}</Text>
              <NumericInput
                value={numberOfSets}
                onChange={(num) => setNumberOfSets(num)}
                disabled={!!activity?.completed}
              />
            </View>
            <View>
              <Text h4>{translate('activity.reps')}</Text>
              <NumericInput
                value={numberOfReps}
                onChange={(num) => setNumberOfReps(num)}
                disabled={!!activity?.completed}
              />
            </View>
          </View>
        </View>
      )}
      {!activity?.completed && (
        <View style={styles.marginTopLg}>
          <Button
            title={translate('common.submit')}
            titleStyle={styles.textUpperCase}
            onPress={handleSubmit}
            disabled={isLoading}
          />
        </View>
      )}
    </>
  );
};

export default AssessmentForm;
