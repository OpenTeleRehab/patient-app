/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import styles from '../../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
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

const chartStyle = {
  paddingBottom: -50,
};

const GoalChart = ({theme, goal}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {treatmentPlan, offlineGoals} = useSelector((state) => state.activity);
  const [activities, setActivities] = useState([]);
  const [numberOfWeeks, setNumberOfWeeks] = useState(1);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [0],
      },
    ],
  });

  useEffect(() => {
    if (!_.isEmpty(treatmentPlan)) {
      setActivities(
        treatmentPlan.activities.filter(
          (activity) => activity.type === 'goal' && activity.completed,
        ),
      );
      setNumberOfWeeks(treatmentPlan.total_of_weeks);
    }
  }, [treatmentPlan]);

  useEffect(() => {
    if (goal) {
      const data = [];
      const labels = [];
      for (let w = 1; w <= numberOfWeeks; w++) {
        if (goal.frequency === 'weekly') {
          labels.push(`W${w}`);
          const activity = _.find(activities, {
            activity_id: goal.activity_id,
            week: w,
          });
          const offlineGoal = _.find(offlineGoals, {
            activity_id: goal.activity_id,
            week: w,
          });
          if (
            !showChart &&
            ((activity && activity.completed) ||
              (offlineGoal && offlineGoal.completed))
          ) {
            setShowChart(true);
          }
          data.push(
            activity
              ? activity.satisfaction || 0
              : offlineGoal
              ? offlineGoal.satisfaction || 0
              : 0,
          );
        } else {
          for (let d = 1; d <= 7; d++) {
            labels.push(`D${(w - 1) * 7 + d}`);
            const activity = _.find(activities, {
              activity_id: goal.activity_id,
              week: w,
              day: d,
            });
            const offlineGoal = _.find(offlineGoals, {
              activity_id: goal.activity_id,
              week: w,
              day: d,
            });
            if (
              !showChart &&
              ((activity && activity.completed) ||
                (offlineGoal && offlineGoal.completed))
            ) {
              setShowChart(true);
            }
            data.push(
              activity
                ? activity.satisfaction || 0
                : offlineGoal
                ? offlineGoal.satisfaction || 0
                : 0,
            );
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
  }, [goal, numberOfWeeks, activities, offlineGoals, showChart]);

  if (!showChart) {
    return null;
  }

  return (
    <>
      <Text h5 style={[styles.marginY, {color: theme.colors.orangeDark}]}>
        {translate('activity.satisfaction_level.extreme_satisfaction')}
      </Text>
      <ScrollView horizontal>
        <LineChart
          data={chartData}
          width={(screenWidth - 40) * Math.max(1, chartData.labels.length / 10)}
          height={400}
          chartConfig={chartConfig}
          withHorizontalLabels={true}
          bezier
          style={chartStyle}
        />
      </ScrollView>
      <Text h5 style={{color: theme.colors.orangeDark}}>
        {translate('activity.satisfaction_level.no_satisfaction')}
      </Text>
    </>
  );
};

export default withTheme(GoalChart);
