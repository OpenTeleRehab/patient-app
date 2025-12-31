import React from 'react';
import {View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import AppointmentCard from './AppointmentCard';
import styles from '../../../assets/styles';
import {theme} from '../../../../App';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const AppointmentSection = ({title, expanded, onToggle, sectionData}) => {
  return (
    <View style={styles.marginBottom}>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          onToggle();
        }}
        activeOpacity={0.7}
        style={componentStyles.accordionHeader}
      >
        <Text style={componentStyles.sectionTitle}>{title}</Text>
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          type="material-community"
          size={30}
          style={componentStyles.icon}
        />
      </TouchableOpacity>

      {expanded && (
          <>
            {sectionData.map((group, index) => (
              <View key={index} style={styles.marginBottom}>
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
        </>
      )}
    </View>
  );
};

const componentStyles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.primary,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  appointmentContainer: {
    flex: 1,
  },
  icon: {
    marginBottom: 5,
  }
});

export default AppointmentSection;