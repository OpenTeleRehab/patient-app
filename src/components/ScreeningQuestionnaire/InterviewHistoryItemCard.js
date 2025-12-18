import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from '../../assets/styles';
import {Text} from 'react-native';
import {withTheme} from 'react-native-elements';
import moment from 'moment';

const formatDate = (date) => {
  return moment.utc(date).local().format('DD/MM/YYYY');
};

const InterviewHistoryListCard = ({index, OnViewDetail, data}) => {
  return (
    <TouchableOpacity onPress={OnViewDetail}>
      <View
        style={[
          styles.paddingXMd,
          index % 2 === 1 ? styles.backgroundWhite : styles.backgroundGrayLight,
          styles.paddingYMd,
          styles.flexDirectionRow,
          styles.columnGap2,
        ]}>
        <View
          style={[styles.flex1, styles.rowGap2, styles.justifyContentCenter]}>
          <Text style={[styles.fontSizeBase, styles.fontWeightMedium]}>
            {data.title}
          </Text>
          <Text>{formatDate(data.created_at)}</Text>
        </View>
        <View
          style={[
            styles.flex1,
            styles.justifyContentSpaceBetween,
            styles.flexRow,
            styles.alignItemsCenter,
          ]}>
          <View style={styles.chipDiagnosis}>
            <Text
              style={styles.textLight}
              numberOfLines={1}
              ellipsizeMode="tail">
              Diagosis 1
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default withTheme(InterviewHistoryListCard);
