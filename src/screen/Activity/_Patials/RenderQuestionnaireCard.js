import React from 'react';
import {Card, Icon, Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import {TouchableOpacity, View} from 'react-native';

const RenderQuestionnaireCard = (
  {item, index},
  theme,
  navigation,
  translate,
) => {
  return (
    <TouchableOpacity key={index}>
      <Card containerStyle={styles.activityCardContainer}>
        <View
          style={[
            styles.cardWithIconHeader,
            item.completed ? styles.bgDark : styles.bgOrangeLight,
          ]}>
          <View style={styles.cardWithIconWrapper}>
            <Icon
              name="twitch"
              color={item.completed ? theme.colors.black : theme.colors.warning}
              size={100}
              type="font-awesome"
            />
            <Text
              style={[
                styles.cardWithIconHeaderTitle,
                item.completed ? styles.textDark : styles.textWarning,
              ]}
              numberOfLines={1}>
              {translate('activity.questionnaire')}
            </Text>
          </View>
        </View>
        <View style={styles.activityCardInfoWrapper}>
          <Text
            style={[styles.activityCardTitle, styles.textDefaultBold]}
            numberOfLines={3}>
            {item.title}
          </Text>
          <Text style={styles.activityCardText}>
            <Text style={styles.fontWeightBold}>{item.questions.length}</Text>{' '}
            {translate('activity.questions')}
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

export default RenderQuestionnaireCard;