/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Slider, Text} from 'react-native-elements';

import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {ROUTES} from '../../../variables/constants';
import NumericInput from '../../../components/Common/NumericInput';
import {completeActive} from '../../../store/activity/actions';

const styleSetsAndRapsContainer = {
  marginVertical: 72,
};

const CompleteTask = ({route, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {id} = route.params;
  const {activities, isLoading} = useSelector((state) => state.activity);
  const [activityNumber, setActivityNumber] = useState(undefined);
  const [painLevel, setPainLevel] = useState(0);
  const [numberOfSets, setNumberOfSets] = useState(0);
  const [numberOfReps, setNumberOfReps] = useState(0);

  useEffect(() => {
    if (id && activities.length) {
      const activityIndex = _.findIndex(activities, {id});
      if (activityIndex >= 0) {
        setActivityNumber(activityIndex + 1);
      }
    }
  }, [id, activities]);

  const handleSubmit = () => {
    dispatch(
      completeActive(id, {
        paint_level: painLevel,
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
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={translate('activity.complete_task_number', {
          number: activityNumber,
        })}
      />
      <ScrollView style={styles.mainContainerLight}>
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
            maximumValue={10}
            step={1}
          />
        </View>

        <View style={styleSetsAndRapsContainer}>
          <View style={[styles.flexCenter, styles.marginBottomMd]}>
            <Text h3 style={styles.textPrimary}>
              {translate('activity.sets_reps.completed_label')}
            </Text>
          </View>
          <View style={[styles.flexRow, styles.justifyContentSpaceAround]}>
            <View>
              <Text h4>Sets</Text>
              <NumericInput
                value={numberOfSets}
                onChange={(num) => setNumberOfSets(num)}
              />
            </View>
            <View>
              <Text h4>Reps</Text>
              <NumericInput
                value={numberOfReps}
                onChange={(num) => setNumberOfReps(num)}
              />
            </View>
          </View>
        </View>

        <View style={styles.marginTopLg}>
          <Button
            title={translate('common.submit')}
            titleStyle={styles.textUpperCase}
            onPress={handleSubmit}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default CompleteTask;
