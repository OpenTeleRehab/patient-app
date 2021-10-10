import React, {useEffect, useState} from 'react';
import {Card, Icon, Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import {TouchableOpacity, View} from 'react-native';
import {ROUTES} from '../../../variables/constants';
import quackerGoal from '../../../assets/images/quacker-goal.png';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import {useSelector} from 'react-redux';

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

const RenderGoalCard = ({
  item,
  index,
  theme,
  navigation,
  translate,
  offlineGoals,
}) => {
  const [isCompletedOffline, setIsCompletedOffline] = useState(false);
  const {profile} = useSelector((state) => state.user);
  const [kidTheme, setKidTheme] = useState(false);

  useEffect(() => {
    if (item) {
      const offlineGoal = offlineGoals.find((offlineItem) => {
        return (
          item.activity_id === parseInt(offlineItem.goal_id, 10) &&
          item.day === offlineItem.day &&
          item.week === offlineItem.week
        );
      });

      if (offlineGoal) {
        setIsCompletedOffline(true);
      } else {
        setIsCompletedOffline(false);
      }
    }
  }, [item, offlineGoals]);

  useEffect(() => {
    if (profile) {
      setKidTheme(!!profile.kid_theme);
    }
  }, [profile]);

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
        {kidTheme ? (
          <ImageCard
            file={quackerGoal}
            grayscale={item.completed || isCompletedOffline}
          />
        ) : (
          <View
            style={[
              styles.cardWithIconHeader,
              item.completed || isCompletedOffline
                ? styles.bgGrey
                : {backgroundColor: theme.colors.blueLight4},
            ]}>
            <View style={styles.cardWithIconWrapper}>
              <Icon
                name="bullseye-arrow"
                color={
                  item.completed || isCompletedOffline
                    ? theme.colors.black
                    : theme.colors.blueDark
                }
                size={100}
                type="material-community"
              />
              <Text
                style={[
                  styles.cardWithIconHeaderTitle,
                  item.completed || isCompletedOffline
                    ? styles.textDefault
                    : {color: theme.colors.blueDark},
                ]}
                numberOfLines={1}>
                {translate('activity.goal.satisfaction')}
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
          <Text style={[styles.activityCardText, styles.textDefaultBold]}>
            {translate('activity.goal.' + item.frequency)}
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

export default RenderGoalCard;
