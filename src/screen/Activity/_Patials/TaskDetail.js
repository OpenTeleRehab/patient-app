/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Image, Text, withTheme} from 'react-native-elements';
import styles from '../../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../../variables/constants';
import MediaView from './MediaView';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import settings from '../../../../config/settings';
import {completeActive} from '../../../store/activity/actions';
import musicUrl from '../../../assets/images/music.png';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.9);
const styleMedia = {width: '95%', height: 300};

const stylePaginationDot = {
  width: 10,
  height: 10,
  borderRadius: 5,
};

const RenderMediaItem = ({item, index}, setShowMedia) => {
  let uri = settings.adminApiBaseURL + '/file/' + item.id;
  const type = item.fileType;

  if (type === 'video/mp4') {
    uri += '?thumbnail=1';
  }

  if (type === 'audio/mpeg') {
    uri = Image.resolveAssetSource(musicUrl).uri;
  }

  return (
    <TouchableOpacity onPress={() => setShowMedia(index)}>
      <Image
        source={{uri}}
        style={styleMedia}
        PlaceholderContent={<ActivityIndicator size={50} />}
      />
    </TouchableOpacity>
  );
};

const TaskDetail = ({theme, activity, activityNumber, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {isLoading} = useSelector((state) => state.activity);
  const [showMedia, setShowMedia] = useState(undefined);
  const [activePaginationIndex, setActivePaginationIndex] = useState(0);

  const handleCompleteTask = () => {
    if (!activity.include_feedback && !activity.get_pain_level) {
      dispatch(completeActive(activity.id)).then((res) => {
        if (res) {
          navigation.navigate(ROUTES.ACTIVITY);
        }
      });
    } else {
      navigation.navigate(ROUTES.ACTIVITY_COMPLETE_TASK, {
        id: activity.id,
        activityNumber: activityNumber,
      });
    }
  };

  return (
    <>
      {showMedia !== undefined && (
        <MediaView
          activity={activity}
          showMedia={showMedia}
          onClose={() => setShowMedia(undefined)}
        />
      )}

      <View>
        <Carousel
          data={activity.files}
          renderItem={(props) => RenderMediaItem(props, setShowMedia)}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          inactiveSlideScale={1}
          onSnapToItem={(index) => setActivePaginationIndex(index)}
        />
        <Pagination
          dotsLength={activity.files.length}
          activeDotIndex={activePaginationIndex}
          dotStyle={stylePaginationDot}
          dotColor={theme.colors.primary}
          inactiveDotColor={theme.colors.black}
          inactiveDotScale={1}
          containerStyle={styles.paddingY}
        />
      </View>
      <View style={[styles.flexCenter, styles.marginY]}>
        <Text h4>{activity.title}</Text>
      </View>

      {activity.additional_fields?.map((additionalField, index) => (
        <View key={index} style={styles.marginBottomMd}>
          <Text h4 style={styles.underlineHeader}>
            {additionalField.field}
          </Text>
          <Text>{additionalField.value}</Text>
        </View>
      ))}

      <Button
        icon={{
          name: 'check',
          type: 'font-awesome-5',
          color: theme.colors.white,
        }}
        title={translate(
          activity.completed
            ? 'activity.completed_task_number'
            : 'activity.complete_task_number',
          {
            number: activityNumber,
          },
        )}
        titleStyle={styles.textUpperCase}
        onPress={handleCompleteTask}
        disabled={isLoading || !!activity.completed}
      />
    </>
  );
};

export default withTheme(TaskDetail);
