import React from 'react';
import {View, Text, Platform, UIManager, StyleSheet} from 'react-native';
import styles from '../../../assets/styles';
import AppointmentCard from './AppointmentCard';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const AppointmentSection = ({sectionData}) => {
  return (
    <View style={styles.marginBottom}>
      {sectionData.map((group, index) => (
        <View key={`${group.id}-${index}`} style={styles.marginBottom}>
          <Text style={[styles.fontWeightBold, styles.marginBottom]}>
            {group.month}
          </Text>
          {group.appointments.map((appointment, i) => (
            <View style={[styles.appointmentListWrapper, componentStyles.appointmentContainer]} key={i}>
              <AppointmentCard appointment={appointment} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const componentStyles = StyleSheet.create({
  appointmentContainer: {
    flex: 1,
  },
});

export default AppointmentSection;