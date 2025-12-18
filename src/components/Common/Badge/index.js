import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {theme} from '../../../../App';

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
    color: theme.colors.white,
  },
});

export default Badge;
