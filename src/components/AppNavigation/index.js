/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withTheme} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeTab from './Tab/HomeTab';
import ActivityTab from './Tab/ActivityTab';
import GoalTab from './Tab/GoalTab';
import AppointmentTab from './Tab/AppointmentTab';
import MessageTab from '../../screen/Message';
import {ROUTES} from '../../variables/constants';
import {auths} from '../../variables/routes';
import styles from '../../assets/styles';
import {patientLogoutSuccess} from '../../redux/actions';

const AuthStack = createStackNavigator();
const AppTab = createBottomTabNavigator();

const tabs = [
  {
    name: ROUTES.HOME,
    screen: HomeTab,
    label: 'Home',
    icon: 'home',
    badge: 'noBadge',
  },
  {
    name: ROUTES.ACTIVITY,
    screen: ActivityTab,
    label: 'Activities',
    icon: 'handball',
    badge: 'hasActivity',
  },
  {
    name: ROUTES.GOAL,
    screen: GoalTab,
    label: 'Goals',
    icon: 'bullseye-arrow',
    badge: 'hasGoal',
  },
  {
    name: ROUTES.APPOINTMENT,
    screen: AppointmentTab,
    label: 'Appointments',
    icon: 'calendar-clock',
    badge: 'hasAppointment',
  },
  {
    name: ROUTES.MESSAGE,
    screen: MessageTab,
    label: 'Messages',
    icon: 'message-text-outline',
    badge: 'hasMessage',
  },
];

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator headerMode="none" initialRouteName={ROUTES.LOGIN}>
      {auths.map((route, index) => {
        return (
          <AuthStack.Screen
            key={index}
            name={route.name}
            component={route.screen}
          />
        );
      })}
    </AuthStack.Navigator>
  );
};

const AppTabNavigator = (props) => {
  const {theme, indicator} = props;

  const hasBadge = (checkBadge) => {
    if (checkBadge === 'noBadge') {
      return null;
    }
    return indicator[checkBadge] ? 1 : null;
  };

  return (
    <AppTab.Navigator
      initialRouteName={ROUTES.HOME}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        allowFontScaling: true,
        activeTintColor: theme.colors.primary,
        inactiveTintColor: theme.colors.grey,
        labelStyle: styles.navTabLabel,
        style: styles.navTabBar,
        safeAreaInsets: {bottom: 5},
      }}>
      {tabs.map((route, index) => {
        return (
          <AppTab.Screen
            key={index}
            name={route.name}
            component={
              route.name === ROUTES.HOME
                ? connect(mapStateToProps, mapDispatchToProps)(route.screen)
                : route.screen
            }
            options={{
              tabBarIcon: ({focused, color, size}) => (
                <MCIcon name={route.icon} color={color} size={size} />
              ),
              tabBarLabel: route.label,
              tabBarBadge: hasBadge(route.badge),
              tabBarBadgeStyle: styles.navTabBadge,
            }}
          />
        );
      })}
    </AppTab.Navigator>
  );
};

class AppNavigation extends React.Component {
  render() {
    return (
      <NavigationContainer>
        {this.props.patient.accessToken ? (
          <AppTabNavigator {...this.props} />
        ) : (
          <AuthStackNavigator />
        )}
      </NavigationContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    patient: state.patient,
    indicator: state.indicator,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      patientLogoutSuccess,
    },
    dispatch,
  );
};

export default connect(mapStateToProps)(withTheme(AppNavigation));
