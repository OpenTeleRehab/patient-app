import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Video from 'react-native-video';

import {ROUTES} from '../../../variables/constants';
import {Card, Icon, Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import settings from '../../../../config/settings';

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
    uri = settings.adminApiBaseURL + '/file/' + files[0].id;
    type = files[0].fileType;
  }
  if (type === 'video/mp4' || type === 'audio/mpeg') {
    return (
      <Video
        source={{uri}}
        style={styles.activityCardVideo}
        resizeMode="cover"
      />
    );
  }
  return <Card.Image source={{uri}} style={[styles.activityCardImage]} />;
};

const RenderActivityCard = ({item, index}, theme, navigation, translate) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate(ROUTES.ACTIVITY_DETAIL, {
          id: item.id,
          activityNumber: index + 1,
        })
      }>
      <Card containerStyle={styles.activityCardContainer}>
        <ImageCard files={item.files} grayscale={item.completed} />
        <Text
          style={[styles.activityCardTitle, styles.textDefaultBold]}
          numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={styles.activityCardText}>
          {item.sets &&
            translate('activity.number_of_sets', {number: item.sets})}
          {item.reps &&
            ` - ${translate('activity.number_of_reps', {number: item.sets})}`}
        </Text>
        <Card.Divider style={styles.activityCardDivider} />

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

export default RenderActivityCard;
