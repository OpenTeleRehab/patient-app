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

  const chartConfig = {
    backgroundGradientFrom: theme.colors.white,
    backgroundGradientTo: theme.colors.white,
    backgroundGradientFromOpacity: 1,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => theme.colors.greyOutline,
    labelColor: (opacity = 1) => theme.colors.dark,
    barPercentage: 1,
    decimalPlaces: 0,
    useShadowColorFromDataset: false, // optional
    fillShadowGradient: theme.colors.orange,
    fillShadowGradientOpacity: 1,
    propsForBackgroundLines: {
      strokeDasharray: '',
      strokeWidth: 1,
    },
  };

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
          labels.push(w);
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
            labels.push((w - 1) * 7 + d);
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
            data: [10],
            color: (opacity = 1) => 'rgba(255, 255, 255, 0)', // optional
          },
          {
            data: data,
            color: (opacity = 1) => theme.colors.orangeDark1, // optional
            strokeWidth: 3, // optional
          },
          {
            data: [0],
            color: (opacity = 1) => 'rgba(255, 255, 255, 0)', // optional
          },
        ],
      });
    }
  }, [
    goal,
    numberOfWeeks,
    activities,
    offlineGoals,
    showChart,
    theme,
    translate,
  ]);

  if (!showChart) {
    return null;
  }

  return (
    <>
      <Text style={[styles.marginY, {color: theme.colors.orangeDark}]}>
        {translate('activity.satisfaction_level.extreme_satisfaction')}
      </Text>
      <ScrollView horizontal>
        <LineChart
          segments={5}
          data={chartData}
          width={(screenWidth - 40) * Math.max(1, chartData.labels.length / 10)}
          height={400}
          chartConfig={chartConfig}
          withHorizontalLines={false}
          bezier
          style={chartStyle}
        />
      </ScrollView>

      <Text style={(styles.textCenter, styles.navTabLabel)}>
        {goal ? translate('activity.goal.' + goal.frequency) : ''}
      </Text>
    </>
  );
};

export default withTheme(GoalChart);
