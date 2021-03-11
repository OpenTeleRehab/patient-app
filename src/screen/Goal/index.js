/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {getTreatmentPlanRequest} from '../../store/activity/actions';
import {Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import _ from 'lodash';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#FFFFFF',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => 'rgba(82, 77, 75, 1)',
  barPercentage: 1,
  useShadowColorFromDataset: false, // optional
  fillShadowGradient: '#FF8747',
  fillShadowGradientOpacity: 1,
};

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

const chartStyle = {
  paddingBottom: -35,
};

const Goal = ({theme}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const {language} = useSelector((state) => state.translation);
  const translate = getTranslate(localize);
  const {treatmentPlan} = useSelector((state) => state.activity);
  const [selectedGoal, setSelectedGoal] = useState(0);
  const [goal, setGoal] = useState(undefined);
  const [activities, setActivities] = useState([]);
  const [numberOfWeeks, setNumberOfWeeks] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [0],
      },
    ],
  });

  useEffect(() => {
    dispatch(getTreatmentPlanRequest());
  }, [language, dispatch]);

  useEffect(() => {
    if (!_.isEmpty(treatmentPlan)) {
      const activeGoal = treatmentPlan.goals[0];
      setActivities(
        treatmentPlan.activities.filter(
          (activity) => activity.type === 'goal' && activity.completed,
        ),
      );
      setNumberOfWeeks(treatmentPlan.total_of_weeks);
      setGoal(activeGoal);
      setSelectedGoal(0);
    }
  }, [treatmentPlan]);

  useEffect(() => {
    if (goal) {
      const data = [];
      const labels = [];
      for (let w = 1; w <= numberOfWeeks; w++) {
        if (goal.frequency === 'weekly') {
          labels.push(`W${w}`);
          const activity = _.find(activities, {activity_id: goal.id, week: w});
          data.push(activity ? activity.satisfaction || 0 : 0);
        } else {
          for (let d = 1; d <= 7; d++) {
            labels.push(`D${(w - 1) * 7 + d}`);
            const activity = _.find(activities, {
              activity_id: goal.id,
              week: w,
              day: d,
            });
            data.push(activity ? activity.satisfaction || 0 : 0);
          }
        }
      }
      setChartData({
        labels: labels,
        datasets: [
          {
            data: data,
            color: (opacity = 1) => `rgba(227, 82, 5, ${opacity})`, // optional
            strokeWidth: 3, // optional
          },
        ],
      });
    }
  }, [goal, numberOfWeeks, activities]);

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
            treatmentPlan.goals.map((treatmentGoal, i) => (
              <TouchableOpacity
                key={i}
                style={
                  selectedGoal === i
                    ? selectedGoalContainerStyle
                    : goalContainerStyle
                }
                onPress={() => {
                  setSelectedGoal(i);
                  setGoal(treatmentGoal);
                }}>
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
        <View
          style={[styles.marginTopMd, styles.paddingX, styles.marginBottom]}>
          <Text h5 style={styles.fontWeightBold}>
            {goal && goal.title ? goal.title : ''}
          </Text>
        </View>
        <View style={[styles.paddingX, styles.marginTopLg]}>
          <Text h5 style={{color: theme.colors.orangeDark}}>
            {translate('activity.satisfaction_level.extreme_satisfaction')}
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={[styles.marginTop, styles.noPadding]}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <LineChart
            data={chartData}
            width={
              (screenWidth - 40) * Math.max(1, chartData.labels.length / 10)
            }
            height={400}
            chartConfig={chartConfig}
            withHorizontalLabels={true}
            bezier
            style={chartStyle}
          />
        </ScrollView>
        <View style={[styles.paddingX]}>
          <Text h5 style={{color: theme.colors.orangeDark}}>
            {translate('activity.satisfaction_level.no_satisfaction')}
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(Goal);
