import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ProgressBar = ({width, percent = 0}) => {
  const clampedPercent = Math.max(0, Math.min(100, Number(percent) || 0));

  return (
    <View style={[styles.progressWrap,{width: width || '100%'}]}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill,{width:`${clampedPercent}%`}]}/>
      </View>
      <Text style={styles.percentText}>{clampedPercent}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#22C55E',
  },
  percentText: {
    fontSize: 12,
    color: '#6B7280',
    minWidth: 24,
    textAlign: 'right',
  },
});

export default ProgressBar;
