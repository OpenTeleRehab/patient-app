import React from 'react';
import {Text} from 'react-native';
import {View} from 'react-native';
import {Icon, withTheme} from 'react-native-elements';
import styles from '../../assets/styles';
import colors from '../../assets/styles/variables/colors';

const InterviewItemCard = ({
  onClickInterview,
  onClickViewInterviewHistory,
  interview,
  isDisable,
}) => {
  return (
    <View style={styles.interviewItemCard}>
      <View style={[styles.flex1, styles.rowGap2, styles.justifyContentCenter]}>
        <Text style={[styles.fontSizeBase, styles.fontWeightMedium]}>
          {interview.title}
        </Text>
        <Text>{interview.description}</Text>
      </View>
      <View style={styles.flexDirectionRow}>
        <Icon
          reverse
          name="plus"
          type="font-awesome"
          color={colors.success}
          reverseColor="white"
          size={17}
          onPress={() => {
            onClickInterview();
          }}
        />
        <Icon
          reverse
          name="eye"
          type="font-awesome"
          color={colors.primary}
          size={17}
          disabled={isDisable}
          onPress={() => {
            onClickViewInterviewHistory();
          }}
        />
      </View>
    </View>
  );
};

export default withTheme(InterviewItemCard);
