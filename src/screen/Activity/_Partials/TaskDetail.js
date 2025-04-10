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
import {
  completeActive,
  completeActivityOffline,
} from '../../../store/activity/actions';
import musicUrl from '../../../assets/images/music.png';
import {useNetInfo} from '@react-native-community/netinfo';
import _ from 'lodash';
import TTSButton from '../../../components/TTSButton';
import moment from 'moment';
import RNLocalize from 'react-native-localize';
import store from '../../../store';

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH);
const styleMedia = {width: '95%', height: 300};

const stylePaginationDot = {
  width: 10,
  height: 10,
  borderRadius: 5,
};

const RenderMediaItem = ({item, index}, setShowMedia, translate) => {
  let uri = store.getState().phone.adminApiBaseURL + '/file/' + item.id;
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
        accessibilityLabel={translate('common.media')}
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
        dispatch(
          completeActive({id: activity.id, timezone: RNLocalize.getTimeZone()}),
        ).then((res) => {
          if (res) {
            navigation.navigate(ROUTES.ACTIVITY);
          }
        });
      } else {
        let offlineActivityObj = _.cloneDeep(offlineActivities);
        offlineActivityObj.push({
          id: activity.id,
          timezone: RNLocalize.getTimeZone(),
        });
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
      texts.push(translate('activity.additional_information'));
      texts.push(activity.additional_information);
    }

    return texts;
  };

  return (
    <>
      <ScrollView style={styles.mainContainerLight}>
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
            renderItem={(props) =>
              RenderMediaItem(props, setShowMedia, translate)
            }
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
            <Text style={styles.headerLeftTitleDark}>{activity.title}</Text>
            <TTSButton
              textsToSpeech={getTextsToSpeech()}
              style={styles.marginLeft}
            />
          </View>
        </View>
        {activity.sets > 0 && (
          <View style={[styles.flexCenter, styles.marginBottomMd]}>
            <Text style={styles.fontSizeMd}>
              {translate('activity.number_of_sets_and_reps', {
                sets: activity.sets,
                reps: activity.reps,
              })}
            </Text>
          </View>
        )}
        {activity.additional_fields?.map((additionalField, index) => (
          <View key={index} style={styles.marginBottomMd}>
            <Text style={[styles.fontSizeMd, styles.fontWeightBold]}>
              {additionalField.field}
            </Text>
            <Text style={styles.marginTop}>{additionalField.value}</Text>
          </View>
        ))}

        {activity.additional_information &&
          activity.additional_information.trim() !== '' && (
            <View style={styles.marginBottomMd}>
              <Text
                style={[styles.underlineHeader, styles.headerLeftTitleDark]}>
                {translate('activity.additional_information')}
              </Text>
              <Text>{activity.additional_information}</Text>
            </View>
          )}
      </ScrollView>

      <Divider />
      <View style={[styles.stickyButtonWrapper, styles.bgLight]}>
        <Button
          containerStyle={styles.stickyButtonContainer}
          icon={
            (activity.completed || isCompletedOffline) && {
              name: 'check',
              type: 'font-awesome-5',
              color: theme.colors.grey1,
            }
          }
          title={translate(
            activity.completed || isCompletedOffline
              ? 'activity.completed_task_number'
              : 'activity.complete_task_number',
            {
              number: activityNumber,
            },
          )}
          onPress={handleCompleteTask}
          disabled={
            isLoading ||
            !!activity.completed ||
            isCompletedOffline ||
            moment().isBefore(activity.date, 'day')
          }
          disabledTitleStyle={styles.stickyDisabledTitleStyle}
        />
      </View>
    </>
  );
};

export default withTheme(TaskDetail);
