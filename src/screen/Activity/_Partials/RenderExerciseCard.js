import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ROUTES} from '../../../variables/constants';
import {Card, Icon, Text, Image} from 'react-native-elements';
import styles from '../../../assets/styles';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import musicUrl from '../../../assets/images/music.png';
import store from '../../../store';

const ImageCard = ({files, grayscale}) => {
  if (grayscale) {
    return (
      <Grayscale>
        <ImageCard files={files} />
      </Grayscale>
    );
  }

  let uri = '';
  let type = '';
  if (files.length) {
    uri = store.getState().phone.adminApiBaseURL + '/file/' + files[0].id;
    type = files[0].fileType;
  }
  if (type === 'video/mp4') {
    uri += '?thumbnail=1';
  }

  if (type === 'audio/mpeg') {
    uri = Image.resolveAssetSource(musicUrl).uri;
  }
  return <Card.Image source={{uri}} style={[styles.activityCardImage]} />;
};

const RenderExerciseCard = ({
  item,
  index,
  theme,
  navigation,
  translate,
  offlineActivities,
}) => {
  const [isCompletedOffline, setIsCompletedOffline] = useState(false);

  useEffect(() => {
    if (item) {
      const offlineActivity = offlineActivities.find((offlineItem) => {
        return item.id === parseInt(offlineItem.id, 10);
      });
      if (offlineActivity) {
        setIsCompletedOffline(true);
      }
    }
  }, [item, offlineActivities]);

  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate(ROUTES.EXERCISE_DETAIL, {
          id: item.id,
          activityNumber: index + 1,
        })
      }>
      <Card containerStyle={styles.activityCardContainer}>
        <ImageCard
          files={item.files}
          grayscale={item.completed || isCompletedOffline}
        />
        <View style={styles.activityCardInfoWrapper}>
          <Text
            style={[styles.activityCardTitle, styles.textDefaultBold]}
            numberOfLines={3}>
            {item.title}
          </Text>
          <Text style={styles.activityCardText}>
            {item.sets > 0 && (
              <Text>
                {translate('activity.number_of_sets_and_reps', {
                  sets: item.sets,
                  reps: item.reps,
                })}
              </Text>
            )}
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

export default RenderExerciseCard;
