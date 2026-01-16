import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../../variables/constants';
import {interviews} from '../../variables/routes';

const Stack = createStackNavigator();
const ScreenWrapper = (ScreenComponent, patientId) => {
  return (props) => <ScreenComponent {...props} patientId={patientId} />;
};

const InterviewScreen = ({route}) => {
  const {patientId} = route.params;

  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={ROUTES.INTERVIEW_LIST}
      screenOptions={{gestureEnabled: false, headerShown: false}}>
      {interviews.map((interviewRoute, index) => {
        return (
          <Stack.Screen
            key={index}
            name={interviewRoute.name}
            component={ScreenWrapper(interviewRoute.screen, patientId)}
            initialParams={{patientId}}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export default InterviewScreen;
