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
import AuthGroupScreen from './Group/AuthGroup';
import HomeGroupScreen from './Group/HomeGroup';
import ActivityGroupScreen from './Group/ActivityGroup';
import GoalGroupScreen from './Group/GoalGroup';
import AppointmentGroupScreen from './Group/AppointmentGroup';
import MessageGroupScreen from '../../screen/Message';
import {ROUTES} from '../../variables/constants';
import styles from '../../assets/styles';
import {patientLogoutSuccess} from '../../redux/actions';

const AuthStack = createStackNavigator();
const AppTab = createBottomTabNavigator();

const tabs = [
  {
    name: ROUTES.HOME,
    screen: HomeGroupScreen,
    label: 'Home',
    icon: 'home',
    badge: 'noBadge',
  },
  {
    name: ROUTES.ACTIVITY,
    screen: ActivityGroupScreen,
    label: 'Activities',
    icon: 'handball',
    badge: 'hasActivity',
  },
  {
    name: ROUTES.GOAL,
    screen: GoalGroupScreen,
    label: 'Goals',
    icon: 'bullseye-arrow',
    badge: 'hasGoal',
  },
  {
    name: ROUTES.APPOINTMENT,
    screen: AppointmentGroupScreen,
    label: 'Appointments',
    icon: 'calendar-clock',
    badge: 'hasAppointment',
  },
  {
    name: ROUTES.MESSAGE,
    screen: MessageGroupScreen,
    label: 'Messages',
    icon: 'message-text-outline',
    badge: 'hasMessage',
  },
];

const hasBadge = (indicator, checkBadge) => {
  if (checkBadge === 'noBadge') {
    return null;
  }
  return indicator[checkBadge] ? 1 : null;
};

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator headerMode="none" initialRouteName={ROUTES.LOGIN}>
      <AuthStack.Screen name="Auth" component={AuthGroupScreen} />
    </AuthStack.Navigator>
  );
};

const AppTabNavigator = (props) => {
  const {theme, indicator} = props;
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
              tabBarBadge: hasBadge(indicator, route.badge),
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
