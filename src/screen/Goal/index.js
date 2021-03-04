/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {getTreatmentPlanRequest} from '../../store/activity/actions';

const goalContainerStyle = {
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 12,
  paddingRight: 12,
};

const selectedGoalContainerStyle = {
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 12,
  paddingRight: 12,
  backgroundColor: '#FFFFFF',
  borderColor: '#0078CC',
  borderWidth: 2,
  borderRadius: 5,
};

const goalTextStyle = {
  color: '#FFFFFF',
  textAlign: 'center',
  fontWeight: 'bold',
};

const selectedGoalTextStyle = {
  color: '#06038D',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 18,
};

const Goal = ({theme}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const {language} = useSelector((state) => state.translation);
  const translate = getTranslate(localize);
  const {treatmentPlan} = useSelector((state) => state.activity);
  const [selectedGoal, setSelectedGoal] = useState(1);

  useEffect(() => {
    dispatch(getTreatmentPlanRequest());
  }, [language, dispatch]);

  return (
    <>
      <HeaderBar leftContent={{label: translate('tab.goals')}} />
      <ScrollView style={[styles.mainContainerLight, styles.noPadding]}>
        <View
          style={[
            styles.flexRow,
            styles.justifyContentCenter,
            {
              backgroundColor: theme.colors.blueDark,
            },
          ]}>
          {treatmentPlan.goals &&
            treatmentPlan.goals.map((goal, i) => (
              <TouchableOpacity
                key={i}
                style={
                  selectedGoal === i
                    ? selectedGoalContainerStyle
                    : goalContainerStyle
                }
                onPress={() => setSelectedGoal(i)}>
                <Text
                  style={
                    selectedGoal === i ? selectedGoalTextStyle : goalTextStyle
                  }>
                  Goal
                </Text>
                <Text
                  style={[
                    selectedGoal === i ? selectedGoalTextStyle : goalTextStyle,
                  ]}>
                  {i + 1}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(Goal);
