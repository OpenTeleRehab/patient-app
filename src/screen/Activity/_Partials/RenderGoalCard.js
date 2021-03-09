import React from 'react';
import {Card, Icon, Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import {TouchableOpacity, View} from 'react-native';
import {ROUTES} from '../../../variables/constants';

const RenderGoalCard = ({item, index}, theme, navigation, translate) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate(ROUTES.GOAl_DETAIL, {
          activity_id: item.activity_id,
          activityNumber: index + 1,
          day: item.day,
          week: item.week,
        })
      }>
      <Card containerStyle={styles.activityCardContainer}>
        <View
          style={[
            styles.cardWithIconHeader,
            item.completed
              ? styles.bgDark
              : {backgroundColor: theme.colors.blueLight3},
          ]}>
          <View style={styles.cardWithIconWrapper}>
            <Icon
              name="trending-up"
              color={
                item.completed ? theme.colors.black : theme.colors.blueDark
              }
              size={100}
              type="material"
            />
            <Text
              style={[
                styles.cardWithIconHeaderTitle,
                item.completed
                  ? styles.textDark
                  : {color: theme.colors.blueDark},
              ]}
              numberOfLines={1}>
              {translate('activity.goal.satisfaction')}
            </Text>
          </View>
        </View>
        <View style={styles.activityCardInfoWrapper}>
          <Text
            style={[styles.activityCardTitle, styles.textDefaultBold]}
            numberOfLines={3}>
            {item.title}
          </Text>
          <Text style={[styles.activityCardText, styles.textDefaultBold]}>
            {translate('activity.goal.' + item.frequency)}
          </Text>
        </View>
        {item.completed ? (
          <View style={styles.activityCardFooterContainer}>
            <Icon
              name="done"
              color={theme.colors.white}
              size={25}
              type="material"
            />
            <Text style={styles.activityCardFooterText}>
              {translate('activity.completed')}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.activityCardFooterContainer,
              {backgroundColor: theme.colors.grey5},
            ]}>
            <Text
              style={[
                styles.activityCardFooterText,
                {color: theme.colors.black},
              ]}>
              {translate('activity.to_do')}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

export default RenderGoalCard;
