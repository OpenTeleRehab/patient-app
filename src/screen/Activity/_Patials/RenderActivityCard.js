import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ROUTES} from '../../../variables/constants';
import {Card, Icon, Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import settings from '../../../../config/settings';

const ImageCard = ({files}) => (
  <Card.Image
    source={{
      uri: files.length
        ? settings.adminApiBaseURL + '/file/' + files[0].id
        : 'https://source.unsplash.com/1024x768/?nature',
    }}
    style={[styles.activityCardImage]}
  />
);

const RenderActivityCard = ({item, index}, theme, navigation, selectedDate) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate(ROUTES.ACTIVITY_DETAIL, {
          id: item.id,
          date: selectedDate,
          activityNumber: index + 1,
        })
      }>
      <Card containerStyle={styles.activityCardContainer}>
        {item.completed ? (
          <Grayscale>
            <ImageCard files={item.files} />
          </Grayscale>
        ) : (
          <ImageCard files={item.files} />
        )}
        <Text
          style={[styles.activityCardTitle, styles.textDefaultBold]}
          numberOfLines={3}>
          {item.title}
        </Text>
        <Text style={styles.activityCardText}>30 sets-10 reps</Text>
        <Card.Divider style={styles.activityCardDivider} />
        <View
          style={[
            styles.activityCardFooterContainer,
            {
              backgroundColor: item.completed
                ? theme.colors.primary
                : theme.colors.grey5,
            },
          ]}>
          <Text>
            {item.completed && (
              <Icon
                name="done"
                color={theme.colors.white}
                size={25}
                type="material"
              />
            )}
          </Text>
          {item.completed ? (
            <Text
              style={[
                {color: theme.colors.white},
                styles.activityCardFooterText,
              ]}>
              Completed
            </Text>
          ) : (
            <Text
              style={[
                {color: theme.colors.black},
                styles.activityCardFooterText,
              ]}>
              To-do
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default RenderActivityCard;
