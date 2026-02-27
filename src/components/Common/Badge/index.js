import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import variables from '../../../assets/styles/variables';

const Badge = ({color, value}) => {
  return (
    <View
      style={[componentStyles.badgeContainer, {backgroundColor: color}]}>
      <Text
        style={componentStyles.badgeText}>
        {value}
      </Text>
    </View>
  );
};

const componentStyles = StyleSheet.create({
  badgeContainer: {
    borderRadius: 13,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 9,
    color: variables.white,
  },
});

export default Badge;
