import React, {useEffect, useState} from 'react';
import {Card, Icon, Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import {Image, TouchableOpacity, View} from 'react-native';
import {ROUTES} from '../../../variables/constants';
import questionIcon from '../../../assets/images/questionnaire.png';
import questionIconBlack from '../../../assets/images/questionnaire-black.png';
import quackerQuestionnaire from '../../../assets/images/quacker-questionnaire.png';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import {useSelector} from 'react-redux';

const iconStyle = {
  height: 100,
  width: 100,
};

const ImageCard = ({file, grayscale}) => {
  if (grayscale) {
    return (
      <Grayscale>
        <ImageCard file={file} />
      </Grayscale>
    );
  }
  return <Card.Image source={file} style={styles.activityCardImage} />;
};

const RenderQuestionnaireCard = ({
  item,
  index,
  theme,
  navigation,
  translate,
  offlineQuestionnaireAnswers,
}) => {
  const [isCompletedOffline, setIsCompletedOffline] = useState(false);
  const {profile} = useSelector((state) => state.user);
  const [kidTheme, setKidTheme] = useState(false);

  useEffect(() => {
    if (item) {
      const offlineQuestionnaireAnswer = offlineQuestionnaireAnswers.find(
        (offlineItem) => {
          return item.id === parseInt(offlineItem.id, 10);
        },
      );
      if (offlineQuestionnaireAnswer) {
        setIsCompletedOffline(true);
      }
    }
  }, [item, offlineQuestionnaireAnswers]);

  useEffect(() => {
    if (profile) {
      setKidTheme(!!profile.kid_theme);
    }
  }, [profile]);

  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate(ROUTES.QUESTIONNAIRE_DETAIL, {
          id: item.id,
        })
      }>
      <Card containerStyle={styles.activityCardContainer}>
        {kidTheme ? (
          <ImageCard
            file={quackerQuestionnaire}
            grayscale={item.completed || isCompletedOffline}
          />
        ) : (
          <View
            style={[
              styles.cardWithIconHeader,
              item.completed || isCompletedOffline
                ? styles.bgGrey
                : styles.bgBlueDark,
            ]}>
            <View style={styles.cardWithIconWrapper}>
              {item.completed || isCompletedOffline ? (
                <Image source={questionIconBlack} style={iconStyle} />
              ) : (
                <Image style={iconStyle} source={questionIcon} />
              )}
              <Text
                style={[
                  styles.cardWithIconHeaderTitle,
                  item.completed || isCompletedOffline
                    ? styles.textDefault
                    : styles.textLight,
                ]}
                numberOfLines={1}>
                {translate('activity.questionnaire')}
              </Text>
            </View>
          </View>
        )}
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
        {item.completed || isCompletedOffline ? (
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
