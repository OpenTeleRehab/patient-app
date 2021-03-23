import React from 'react';
import {Card, Icon, Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import {Image, TouchableOpacity, View} from 'react-native';
import {ROUTES} from '../../../variables/constants';
import questionIcon from '../../../assets/images/questionnaire.svg';
import {SvgUri} from 'react-native-svg';

const uri = Image.resolveAssetSource(questionIcon).uri;

const RenderQuestionnaireCard = (
  {item, index},
  theme,
  navigation,
  translate,
) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate(ROUTES.QUESTIONNAIRE_DETAIL, {
          id: item.id,
        })
      }>
      <Card containerStyle={styles.activityCardContainer}>
        <View
          style={[
            styles.cardWithIconHeader,
            item.completed ? styles.bgDark : styles.bgBlueDark,
          ]}>
          <View style={styles.cardWithIconWrapper}>
            {item.completed ? (
              <SvgUri width="100" height="100" uri={uri} fillOpacity={0.3} />
            ) : (
              <SvgUri width="100" height="100" uri={uri} />
            )}
            <Text
              style={[
                styles.cardWithIconHeaderTitle,
                item.completed ? styles.textDark : styles.textWhite,
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
