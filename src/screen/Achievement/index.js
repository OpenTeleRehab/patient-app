/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import HeaderBar from '../../components/Common/HeaderBar';
import {useIsFocused} from '@react-navigation/native';
import {Image, ScrollView, View} from 'react-native';
import {
  Avatar,
  Button,
  ListItem,
  Text,
  Icon,
  withTheme,
} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {getAchievementRequest} from '../../store/achievement/actions';
import settings from '../../../config/settings';
import {getTranslate} from 'react-localize-redux';
import styles from '../../assets/styles';
import CommonOverlay from '../../components/Common/Overlay';

const Achievement = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const isFocused = useIsFocused();
  const {achievements} = useSelector((state) => state.achievement);
  const [achievement, setAchievement] = useState(null);
  const [showAchievementOverlay, setShowAchievementOverlay] = useState(false);

  useEffect(() => {
    dispatch(getAchievementRequest());
  }, [dispatch, isFocused]);

  useEffect(() => {
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    };
  }, [navigation]);

  const handleGoBack = () => {
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    navigation.goBack();
  };

  const handleOpenAchievement = (item) => {
    setShowAchievementOverlay(true);
    setAchievement(item);
  };

  const handleCloseAchievement = () => {
    setShowAchievementOverlay(false);
    setAchievement(null);
  };

  return (
    <>
      <HeaderBar onGoBack={() => handleGoBack()} />
      <ScrollView style={styles.backgroundWhite}>
        {achievements.map((item, i) => (
          <View opacity={item.obtained ? 1.0 : 0.3} key={i}>
            <ListItem onPress={() => handleOpenAchievement(item)}>
              <Avatar
                source={{
                  uri: settings.apiBaseURL + item.icon,
                }}
                size={62}
              />
              <ListItem.Content>
                <ListItem.Title>{translate(item.title)}</ListItem.Title>
                <ListItem.Subtitle>
                  {translate(item.subtitle)}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </View>
        ))}
      </ScrollView>

      {achievement && (
        <CommonOverlay
          visible={showAchievementOverlay}
          onClose={handleCloseAchievement}>
          <View>
            <View style={styles.alignSelfCenter}>
              <Image
                source={{uri: settings.apiBaseURL + achievement.icon}}
                style={styles.overlayBadge}
              />
            </View>

            {!achievement.obtained && (
              <View style={styles.marginTopMd}>
                <Text style={styles.textCenter}>
                  {achievement.init_streak_number} /{' '}
                  {achievement.max_streak_number}
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.fontWeightBold,
                styles.marginTopMd,
                styles.marginBottomMd,
                styles.textCenter,
              ]}>
              {translate(achievement.title)}
            </Text>

            <View style={[styles.textWithIcon, styles.alignSelfCenter]}>
              <Text style={styles.marginRight}>
                {translate(achievement.subtitle)}
              </Text>
              {achievement.obtained && (
                <Icon
                  name="checkcircle"
                  type="antdesign"
                  color={theme.colors.lightgreen}
                />
              )}
            </View>

            <View style={[styles.marginTopLg, styles.alignSelfCenter]}>
              <Button
                title={translate('common.close')}
                onPress={handleCloseAchievement}
              />
            </View>
          </View>
        </CommonOverlay>
      )}
    </>
  );
};

export default withTheme(Achievement);
