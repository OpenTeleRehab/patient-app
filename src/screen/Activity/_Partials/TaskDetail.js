/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Divider, Image, Text, withTheme} from 'react-native-elements';
import styles from '../../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../../../variables/constants';
import MediaView from './MediaView';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import settings from '../../../../config/settings';
import {
  completeActive,
  completeActivityOffline,
} from '../../../store/activity/actions';
import musicUrl from '../../../assets/images/music.png';
import {useNetInfo} from '@react-native-community/netinfo';
import _ from 'lodash';
import TTSButton from '../../../components/TTSButton';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
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

const TaskDetail = ({
  theme,
  activity,
  activityNumber,
  navigation,
  isCompletedOffline,
}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {offlineActivities} = useSelector((state) => state.activity);
  const {isLoading} = useSelector((state) => state.activity);
  const [showMedia, setShowMedia] = useState(undefined);
  const [activePaginationIndex, setActivePaginationIndex] = useState(0);
  const netInfo = useNetInfo();

  const handleCompleteTask = () => {
    if (!activity.include_feedback && !activity.get_pain_level) {
      if (netInfo.isConnected) {
        dispatch(completeActive({id: activity.id})).then((res) => {
          if (res) {
            navigation.navigate(ROUTES.ACTIVITY);
          }
        });
      } else {
        let offlineActivityObj = _.cloneDeep(offlineActivities);
        offlineActivityObj.push({id: activity.id});
        dispatch(completeActivityOffline(offlineActivityObj));
        navigation.navigate(ROUTES.ACTIVITY);
      }
    } else {
      navigation.navigate(ROUTES.COMPLETE_EXERCISE, {
        id: activity.id,
        activityNumber: activityNumber,
      });
    }
  };

  const getTextsToSpeech = () => {
    const texts = [activity.title];

    if (activity.sets > 0) {
      const setReps = translate('activity.number_of_sets_and_reps', {
        sets: activity.sets,
        reps: activity.reps,
      });
      texts.push(setReps.toString());
    }
    if (activity.additional_fields.length) {
      activity.additional_fields.forEach((af) => {
        texts.push(af.field);
        texts.push(af.value);
      });
    }
    if (
      activity.additional_information &&
      activity.additional_information.trim() !== ''
    ) {
      texts.push(activity.additional_information);
    }

    return texts;
  };

  return (
    <>
      <ScrollView style={styles.margin}>
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
          <View style={[styles.marginXMd, styles.flexRow]}>
            <Text h4>{activity.title}</Text>
            <TTSButton textsToSpeech={getTextsToSpeech()} />
          </View>
          {activity.sets > 0 && (
            <Text>
              {translate('activity.number_of_sets_and_reps', {
                sets: activity.sets,
                reps: activity.reps,
              })}
            </Text>
          )}
        </View>

        {activity.additional_fields?.map((additionalField, index) => (
          <View key={index} style={styles.marginBottomMd}>
            <Text h4 style={styles.underlineHeader}>
              {additionalField.field}
            </Text>
            <Text>{additionalField.value}</Text>
          </View>
        ))}

        {activity.additional_information &&
          activity.additional_information.trim() !== '' && (
            <View style={styles.marginBottomMd}>
              <Text h4 style={styles.underlineHeader}>
                {translate('activity.additional_information')}
              </Text>
              <Text>{activity.additional_information}</Text>
            </View>
          )}
      </ScrollView>

      <Divider />
      <View style={styles.stickyButtonWrapper}>
        <Button
          containerStyle={styles.stickyButtonContainer}
          icon={{
            name: 'check',
            type: 'font-awesome-5',
            color: theme.colors.white,
          }}
          title={translate(
            activity.completed || isCompletedOffline
              ? 'activity.completed_task_number'
              : 'activity.complete_task_number',
            {
              number: activityNumber,
            },
          )}
          titleStyle={styles.textUpperCase}
          onPress={handleCompleteTask}
          disabled={isLoading || !!activity.completed || isCompletedOffline}
        />
      </View>
    </>
  );
};

export default withTheme(TaskDetail);
