/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Button, Divider, Slider, Text, withTheme} from 'react-native-elements';

import styles from '../../../assets/styles';

import {
  completeActive,
  completeActivityOffline,
} from '../../../store/activity/actions';
import {ROUTES} from '../../../variables/constants';
import {useNetInfo} from '@react-native-community/netinfo';
import _ from 'lodash';
import ScrollPicker from '@webessentials/react-native-picker-scrollview';

const styleSetsAndRapsContainer = {
  marginVertical: 72,
};

const AssessmentForm = ({theme, activity, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {offlineActivities} = useSelector((state) => state.activity);

  const {isLoading} = useSelector((state) => state.activity);
  const [painLevel, setPainLevel] = useState(1);
  const [numberOfSets, setNumberOfSets] = useState(0);
  const [numberOfReps, setNumberOfReps] = useState(0);
  const [isCompletedOffline, setIsCompletedOffline] = useState(false);
  const netInfo = useNetInfo();

  useEffect(() => {
    if (activity) {
      if (activity.completed) {
        setPainLevel(activity.pain_level);
        setNumberOfSets(activity.completed_sets);
        setNumberOfReps(activity.completed_reps);
      } else {
        const offlineActivity = offlineActivities.find((item) => {
          return item.id === activity.id;
        });
        if (offlineActivity) {
          setPainLevel(offlineActivity.pain_level);
          setNumberOfSets(offlineActivity.sets);
          setNumberOfReps(offlineActivity.reps);
          setIsCompletedOffline(true);
        }
      }
    }
  }, [activity, offlineActivities]);

  const handleSubmit = () => {
    if (netInfo.isConnected) {
      dispatch(
        completeActive({
          id: activity.id,
          pain_level: activity.get_pain_level ? painLevel : null,
          sets: activity.include_feedback ? numberOfSets : null,
          reps: activity.include_feedback ? numberOfReps : null,
        }),
      ).then((res) => {
        if (res) {
          navigation.navigate(ROUTES.ACTIVITY);
        }
      });
    } else {
      let offlineActivitiesObj = _.cloneDeep(offlineActivities);
      offlineActivitiesObj.push({
        id: activity.id,
        pain_level: activity.get_pain_level ? painLevel : null,
        sets: activity.include_feedback ? numberOfSets : null,
        reps: activity.include_feedback ? numberOfReps : null,
      });
      dispatch(completeActivityOffline(offlineActivitiesObj));
      navigation.navigate(ROUTES.ACTIVITY);
    }
    navigation.navigate(ROUTES.ACTIVITY);
  };

  return (
    <>
      <ScrollView style={styles.mainContainerLight}>
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
              disabled={!!activity?.completed || isCompletedOffline}
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
                <ScrollPicker
                  dataSource={Array.from({length: 101}, (v, i) => i)}
                  itemHeight={40}
                  wrapperColor={theme.colors.white}
                  selectedIndex={numberOfSets}
                  onValueChange={(data) => setNumberOfSets(data)}
                  disabled={!!activity?.completed || isCompletedOffline}
                />
                <Text style={styles.fontSizeMd}>
                  (recommend {activity.sets})
                </Text>
              </View>
              <View>
                <Text h4>{translate('activity.reps')}</Text>
                <ScrollPicker
                  dataSource={Array.from({length: 101}, (v, i) => i)}
                  itemHeight={40}
                  wrapperColor={theme.colors.white}
                  selectedIndex={numberOfReps}
                  onValueChange={(data) => setNumberOfReps(data)}
                  disabled={!!activity?.completed || isCompletedOffline}
                />
                <Text style={styles.fontSizeMd}>
                  (recommend {activity.reps})
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {!activity?.completed && !isCompletedOffline && (
        <>
          <Divider />
          <View style={styles.stickyButtonWrapper}>
            <Button
              containerStyle={styles.stickyButtonContainer}
              title={translate('common.submit')}
              titleStyle={styles.textUpperCase}
              onPress={handleSubmit}
              disabled={isLoading}
            />
          </View>
        </>
      )}
    </>
  );
};

export default withTheme(AssessmentForm);
