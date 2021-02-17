/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import colors from '../../assets/styles/variables/colors';
import {useDispatch, useSelector} from 'react-redux';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {getTranslate} from 'react-localize-redux';
import {getTodayActivitySummaryRequest} from '../../store/activity/actions';
import {useIsDrawerOpen} from '@react-navigation/drawer';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const profile = useSelector((state) => state.user.profile);
  const translate = getTranslate(localize);
  const todayActivitySummary = useSelector(
    (state) => state.activity.todaySummary,
  );
  const isDrawerOpen = useIsDrawerOpen();

  const [completedPercentage, setCompletedPercentage] = useState(0);

  useEffect(() => {
    const tabNav = navigation.dangerouslyGetParent();
    if (isDrawerOpen) {
      tabNav.setOptions({tabBarVisible: false});
    }
    return () => {
      tabNav.setOptions({tabBarVisible: true});
    };
  }, [isDrawerOpen, navigation]);

  useEffect(() => {
    dispatch(getTodayActivitySummaryRequest());
  }, [dispatch]);

  useEffect(() => {
    if (todayActivitySummary) {
      setCompletedPercentage(
        (todayActivitySummary.completed * 100) / todayActivitySummary.all,
      );
    }
  }, [todayActivitySummary]);

  return (
    <>
      <HeaderBar
        leftContent={{hasLogo: true}}
        rightContent={{
          icon: 'setting',
          iconType: 'antdesign',
          iconSize: 28,
          label: '',
          onPress: () => navigation.toggleDrawer(),
        }}
      />
      <View
        style={[
          styles.mainContainerPrimary,
          styles.flexCenter,
          styles.flexColumn,
          styles.justifyContentCenter,
        ]}>
        <Text style={styles.textLightBold}>
          {translate('common.hi')}, {profile.last_name}!
        </Text>
        {todayActivitySummary.all ? (
          <>
            <Text h4 style={[styles.textLight, styles.marginTop]}>
              {translate('home.activities.today')}
            </Text>
            <AnimatedCircularProgress
              size={250}
              width={20}
              fill={completedPercentage}
              lineCap="round"
              tintColor={colors.white}
              rotation={0}
              backgroundColor={colors.blueLight}
              style={[styles.marginTopMd]}>
              {() => (
                <>
                  <Text style={styles.leadText}>
                    {translate('common.completed')}
                  </Text>
                  <Text style={styles.progressTextStyle}>
                    <Text
                      style={[styles.progressTextStyle, styles.fontWeightBold]}>
                      {todayActivitySummary.completed}
                    </Text>
                    /{todayActivitySummary.all}
                  </Text>
                </>
              )}
            </AnimatedCircularProgress>
          </>
        ) : (
          <Text h4 style={[styles.textLight, styles.marginTop]}>
            {translate('home.no.activity.for.today')}
          </Text>
        )}
      </View>
    </>
  );
};

export default Home;
