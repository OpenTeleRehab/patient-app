/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import ScrollPicker from '@webessentials/react-native-picker-scrollview';
import {useNetInfo} from '@react-native-community/netinfo';
import {Dimensions, ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import RNLocalize from 'react-native-localize';
import {
  Button,
  Divider,
  Slider,
  Text,
  withTheme,
  Card,
} from 'react-native-elements';
import _ from 'lodash';

import {
  completeActive,
  completeActivityOffline,
} from '../../../store/activity/actions';
import {ROUTES} from '../../../variables/constants';
import styles from '../../../assets/styles';

import quackerPain012 from '../../../assets/images/quacker-pain-1.png';
import quackerPain34 from '../../../assets/images/quacker-pain-2.png';
import quackerPain56 from '../../../assets/images/quacker-pain-3.png';
import quackerPain78 from '../../../assets/images/quacker-pain-4.png';
import quackerPain910 from '../../../assets/images/quacker-pain-5.png';

const styleSetsAndRapsContainer = {
  marginVertical: 72,
};
const sliderThumbStyle = {
  width: 20,
  height: 20,
  borderRadius: 0,
};
const trackStyle = {
  height: 1,
};

const AssessmentForm = ({
  theme,
  activity,
  navigation,
  steps,
  setSteps,
  step,
  setStep,
}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {offlineActivities} = useSelector((state) => state.activity);

  const {isLoading} = useSelector((state) => state.activity);
  const [painLevel, setPainLevel] = useState(0);
  const [numberOfSets, setNumberOfSets] = useState(0);
  const [numberOfReps, setNumberOfReps] = useState(0);
  const [isCompletedOffline, setIsCompletedOffline] = useState(false);
  const netInfo = useNetInfo();
  const {profile} = useSelector((state) => state.user);
  const [kidTheme, setKidTheme] = useState(false);
  const [painImage, setPainImage] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const painLevelValueWidth = 20;
  const left = (painLevel * (screenWidth - (60 - painLevelValueWidth))) / 11;

  useEffect(() => {
    if (profile) {
      setKidTheme(!!profile.kid_theme);
    }
  }, [profile]);

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
        } else {
          setNumberOfSets(activity.sets);
          setNumberOfReps(activity.reps);
        }
      }
    }
  }, [activity, offlineActivities]);

  useEffect(() => {
    if (activity) {
      if (activity.get_pain_level && activity.include_feedback) {
        setSteps(2);
      } else if (activity.get_pain_level || activity.include_feedback) {
        setSteps(1);
      }
    }
  }, [activity, setSteps]);

  useEffect(() => {
    if (painLevel < 3) {
      setPainImage(quackerPain012);
    } else if (painLevel === 3 || painLevel === 4) {
      setPainImage(quackerPain34);
    } else if (painLevel === 5 || painLevel === 6) {
      setPainImage(quackerPain56);
    } else if (painLevel === 7 || painLevel === 8) {
      setPainImage(quackerPain78);
    } else {
      setPainImage(quackerPain910);
    }
  }, [painLevel]);

  const handleSubmit = () => {
    if (netInfo.isConnected) {
      dispatch(
        completeActive({
          id: activity.id,
          pain_level: activity.get_pain_level ? painLevel : null,
          sets: activity.include_feedback ? numberOfSets : null,
          reps: activity.include_feedback ? numberOfReps : null,
          timezone: RNLocalize.getTimeZone(),
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
        timezone: RNLocalize.getTimeZone(),
      });
      dispatch(completeActivityOffline(offlineActivitiesObj));
      navigation.navigate(ROUTES.ACTIVITY);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  return (
    <>
      <ScrollView style={styles.mainContainerLight}>
        {steps > 1 ? (
          <>
            {activity?.get_pain_level && step === 1 && (
              <View style={[styles.marginTopLg]}>
                <View style={[styles.flexCenter, styles.marginBottomMd]}>
                  <Text style={styles.marginBottom}>
                    {translate('activity.step', {
                      step: step + '/2',
                    }).toUpperCase()}
                  </Text>
                  <Text style={[styles.fontSizeXLg, styles.fontWeightBold]}>
                    {translate('activity.pain_level.question')}
                  </Text>
                  <Text style={[styles.paddingMd, styles.textCenter]}>
                    {translate('activity.pain_level.description')}
                  </Text>
                </View>
                {kidTheme && (
                  <View style={[styles.marginTopLg, styles.marginBottomMd]}>
                    <Card.Image
                      source={painImage}
                      style={styles.activityCardImage}
                      resizeMode={'contain'}
                    />
                  </View>
                )}
                <View style={styles.paddingXMd}>
                  <View style={[styles.flexRow, styles.fontSizeMd]}>
                    <View style={{left: left, width: painLevelValueWidth}}>
                      <Text style={styles.textCenter}>{painLevel}</Text>
                    </View>
                  </View>
                  <Slider
                    value={painLevel}
                    onValueChange={(value) => setPainLevel(value)}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    thumbStyle={[sliderThumbStyle, styles.bgPrimary]}
                    disabled={!!activity?.completed || isCompletedOffline}
                    allowTouchTrack={
                      !(!!activity?.completed || isCompletedOffline)
                    }
                    trackStyle={[trackStyle]}
                  />
                </View>
                <View
                  style={[styles.flexRow, styles.justifyContentSpaceBetween]}>
                  <Text>{translate('activity.pain_level.no_paint')}</Text>
                  <Text>{translate('activity.pain_level.worst_paint')}</Text>
                </View>
              </View>
            )}
            <View
              style={
                activity?.include_feedback && step !== 2 && styles.displayNone
              }>
              <View style={[styles.flexCenter, styles.marginBottomMd]}>
                <Text style={styles.marginBottom}>
                  {translate('activity.step', {
                    step: step + '/2',
                  }).toUpperCase()}
                </Text>
                <Text style={[styles.fontSizeXLg, styles.fontWeightBold]}>
                  {translate('activity.sets_reps.completed_label')}
                </Text>
                <Text style={[styles.paddingMd, styles.textCenter]}>
                  {translate('activity.sets_reps.completed_description')}
                </Text>
              </View>
              <View style={[styles.flexRow, styles.justifyContentSpaceAround]}>
                <View>
                  <Text
                    style={[
                      styles.fontWeightBold,
                      styles.fontSizeMd,
                      styles.textCenter,
                    ]}>
                    {translate('activity.sets')}
                  </Text>
                  <ScrollPicker
                    dataSource={Array.from({length: 101}, (v, i) => i)}
                    itemHeight={50}
                    wrapperColor={theme.colors.white}
                    selectedIndex={numberOfSets}
                    renderItem={(data, index, isSelected) => {
                      return (
                        <View>
                          <Text>{data}</Text>
                        </View>
                      );
                    }}
                    onValueChange={(data) => setNumberOfSets(data)}
                    disabled={!!activity?.completed || isCompletedOffline}
                  />
                  <Text
                    style={[
                      styles.fontSizeMd,
                      styles.marginTop,
                      styles.textLightGrey,
                    ]}>
                    {translate('activity.sets_reps.recommend', {
                      number: activity.sets,
                    })}
                  </Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.fontWeightBold,
                      styles.fontSizeMd,
                      styles.textCenter,
                    ]}>
                    {translate('activity.reps')}
                  </Text>
                  <ScrollPicker
                    dataSource={Array.from({length: 101}, (v, i) => i)}
                    itemHeight={50}
                    wrapperColor={theme.colors.white}
                    selectedIndex={numberOfReps}
                    renderItem={(data, index, isSelected) => {
                      return (
                        <View>
                          <Text>{data}</Text>
                        </View>
                      );
                    }}
                    onValueChange={(data) => setNumberOfReps(data)}
                    disabled={!!activity?.completed || isCompletedOffline}
                  />
                  <Text
                    style={[
                      styles.fontSizeMd,
                      styles.marginTop,
                      styles.textLightGrey,
                    ]}>
                    {translate('activity.sets_reps.recommend', {
                      number: activity.reps,
                    })}
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            {activity?.get_pain_level && (
              <View style={styles.marginTopLg}>
                <View style={[styles.flexCenter, styles.marginBottomMd]}>
                  <Text style={styles.marginBottom}>
                    {translate('activity.step', {
                      step: step + '/2',
                    }).toUpperCase()}
                  </Text>
                  <Text style={[styles.fontSizeXLg, styles.fontWeightBold]}>
                    {translate('activity.pain_level.question')}
                  </Text>
                  <Text style={[styles.paddingMd, styles.textCenter]}>
                    {translate('activity.pain_level.description')}
                  </Text>
                </View>
                {kidTheme && (
                  <View style={[styles.marginTopLg, styles.marginBottomMd]}>
                    <Card.Image
                      source={painImage}
                      style={styles.activityCardImage}
                      resizeMode={'contain'}
                    />
                  </View>
                )}
                <View style={styles.paddingXMd}>
                  <View style={[styles.flexRow, styles.fontSizeMd]}>
                    <View style={{left: left, width: painLevelValueWidth}}>
                      <Text style={styles.textCenter}>{painLevel}</Text>
                    </View>
                  </View>
                  <Slider
                    value={painLevel}
                    onValueChange={(value) => setPainLevel(value)}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    thumbStyle={[sliderThumbStyle, styles.bgPrimary]}
                    disabled={!!activity?.completed || isCompletedOffline}
                    allowTouchTrack={
                      !(!!activity?.completed || isCompletedOffline)
                    }
                    trackStyle={[trackStyle]}
                  />
                </View>
                <View
                  style={[styles.flexRow, styles.justifyContentSpaceBetween]}>
                  <Text>{translate('activity.pain_level.no_paint')}</Text>
                  <Text>{translate('activity.pain_level.worst_paint')}</Text>
                </View>
              </View>
            )}
            {activity?.include_feedback && (
              <View style={styleSetsAndRapsContainer}>
                <View style={[styles.flexCenter, styles.marginBottomMd]}>
                  <Text style={styles.marginBottom}>
                    {translate('activity.step', {
                      step: step + '/2',
                    }).toUpperCase()}
                  </Text>
                  <Text style={[styles.fontSizeXLg, styles.fontWeightBold]}>
                    {translate('activity.sets_reps.completed_label')}
                  </Text>
                  <Text style={[styles.paddingMd, styles.textCenter]}>
                    {translate('activity.sets_reps.completed_description')}
                  </Text>
                </View>
                <View
                  style={[styles.flexRow, styles.justifyContentSpaceAround]}>
                  <View>
                    <Text
                      style={[
                        styles.fontWeightBold,
                        styles.fontSizeMd,
                        styles.textCenter,
                      ]}>
                      {translate('activity.sets')}
                    </Text>
                    <ScrollPicker
                      dataSource={Array.from({length: 101}, (v, i) => i)}
                      itemHeight={50}
                      wrapperColor={theme.colors.white}
                      selectedIndex={numberOfSets}
                      renderItem={(data, index, isSelected) => {
                        return (
                          <View>
                            <Text>{data}</Text>
                          </View>
                        );
                      }}
                      onValueChange={(data) => setNumberOfSets(data)}
                      disabled={!!activity?.completed || isCompletedOffline}
                    />
                    <Text
                      style={[
                        styles.fontSizeMd,
                        styles.marginTop,
                        styles.textLightGrey,
                      ]}>
                      {translate('activity.sets_reps.recommend', {
                        number: activity.sets,
                      })}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.fontSizeMd, styles.textCenter]}>
                      {translate('activity.reps')}
                    </Text>
                    <ScrollPicker
                      dataSource={Array.from({length: 101}, (v, i) => i)}
                      itemHeight={50}
                      wrapperColor={theme.colors.white}
                      selectedIndex={numberOfReps}
                      renderItem={(data, index, isSelected) => {
                        return (
                          <View>
                            <Text>{data}</Text>
                          </View>
                        );
                      }}
                      onValueChange={(data) => setNumberOfReps(data)}
                      disabled={!!activity?.completed || isCompletedOffline}
                    />
                    <Text
                      style={[
                        styles.fontSizeMd,
                        styles.marginTop,
                        styles.textLightGrey,
                      ]}>
                      {translate('activity.sets_reps.recommend', {
                        number: activity.reps,
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
      {steps > 1 && step === 1 && (
        <>
          <Divider />
          <View style={[styles.stickyButtonWrapper, styles.bgLight]}>
            <Button
              containerStyle={styles.stickyButtonContainer}
              title={translate('common.next')}
              onPress={handleNext}
              disabled={isLoading}
            />
          </View>
        </>
      )}
      {steps > 1 && step === 2 ? (
        <>
          <Divider />
          <View style={[styles.stickyButtonWrapper, styles.bgLight]}>
            <Button
              containerStyle={styles.stickyButtonContainer}
              title={
                !activity?.completed && !isCompletedOffline
                  ? translate('common.submit')
                  : translate('activity.previous')
              }
              onPress={
                !activity?.completed && !isCompletedOffline
                  ? handleSubmit
                  : handlePrevious
              }
              disabled={isLoading}
            />
          </View>
        </>
      ) : (
        !activity?.completed &&
        !isCompletedOffline &&
        steps === 1 && (
          <>
            <Divider />
            <View style={[styles.stickyButtonWrapper, styles.bgLight]}>
              <Button
                containerStyle={styles.stickyButtonContainer}
                title={translate('common.submit')}
                onPress={handleSubmit}
                disabled={isLoading}
              />
            </View>
          </>
        )
      )}
    </>
  );
};

export default withTheme(AssessmentForm);
