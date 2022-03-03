import React, {useEffect, useState} from 'react';
import {MATERIAL_TYPE, ROUTES} from '../../../variables/constants';
import {Card, Icon, Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import {TouchableOpacity, View} from 'react-native';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import quackerEducationMaterial from '../../../assets/images/quacker-education-material.png';
import {useSelector} from 'react-redux';
import store from '../../../store';

const ImageCard = ({file, grayscale, kidTheme}) => {
  if (grayscale) {
    return (
      <Grayscale>
        <ImageCard file={file} />
      </Grayscale>
    );
  }

  const uri = `${store.getState().phone.adminApiBaseURL}/file/${
    file.id
  }?thumbnail=${file.hasThumbnail}`;
  return (
    <Card.Image
      source={kidTheme ? file : {uri}}
      style={styles.activityCardImage}
    />
  );
};

const RenderEducationMaterialCard = ({
  item,
  index,
  theme,
  navigation,
  translate,
  offlineActivities,
}) => {
  const [isCompletedOffline, setIsCompletedOffline] = useState(false);
  const {profile} = useSelector((state) => state.user);
  const [kidTheme, setKidTheme] = useState(false);

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

  useEffect(() => {
    if (profile) {
      setKidTheme(!!profile.kid_theme);
    }
  }, [profile]);

  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate(ROUTES.MATERIAL_DETAIL, {
          id: item.id,
          activityNumber: index + 1,
        })
      }>
      <Card containerStyle={styles.activityCardContainer}>
        <View
          style={[
            styles.cardWithIconHeader,
            item.completed || isCompletedOffline
              ? styles.bgGrey
              : styles.bgPrimary,
          ]}>
          {item.file &&
          (item.file.hasThumbnail ||
            item.file.fileGroupType === MATERIAL_TYPE.image) ? (
            <ImageCard
              file={item.file}
              grayscale={item.completed || isCompletedOffline}
            />
          ) : kidTheme ? (
            <ImageCard
              file={quackerEducationMaterial}
              grayscale={item.completed || isCompletedOffline}
              kidTheme={kidTheme}
            />
          ) : (
            <>
              <View style={styles.cardWithIconWrapper}>
                <Icon
                  name="description"
                  color={
                    item.completed || isCompletedOffline
                      ? theme.colors.black
                      : theme.colors.white
                  }
                  size={100}
                  type="material"
                />
                <Text
                  style={[
                    styles.cardWithIconHeaderTitle,
                    item.completed || isCompletedOffline
                      ? styles.textDefault
                      : styles.textLight,
                  ]}
                  numberOfLines={1}>
                  {translate('activity.material')}
                </Text>
              </View>
              <Text
                style={[
                  styles.marginLeft,
                  styles.marginY,
                  item.completed || isCompletedOffline
                    ? styles.textDefault
                    : styles.textLight,
                ]}>
                {item.file ? translate(item.file.fileGroupType) : ''}
              </Text>
            </>
          )}
        </View>
        <View style={styles.activityCardInfoWrapper}>
          <Text
            style={[styles.activityCardTitle, styles.textDefaultBold]}
            numberOfLines={3}>
            {item.title}
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

export default RenderEducationMaterialCard;
