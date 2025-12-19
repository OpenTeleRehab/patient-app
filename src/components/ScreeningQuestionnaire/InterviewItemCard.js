import React, {useState} from 'react';
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
  const [isClick, setIsClick] = useState(false);
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
          disabled={isClick}
          onPress={() => {
            onClickInterview();
            setIsClick(true);
          }}
        />
        <Icon
          reverse
          name="eye"
          type="font-awesome"
          color={colors.primary}
          size={17}
          disabled={isDisable || isClick}
          onPress={() => {
            onClickViewInterviewHistory();
            setIsClick(true);
          }}
        />
      </View>
    </View>
  );
};

export default withTheme(InterviewItemCard);
