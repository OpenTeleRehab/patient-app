/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect} from 'react';
import HeaderBar from '../../components/Common/HeaderBar';
import {ScrollView, View} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {getAchievementRequest} from '../../store/achievement/actions';
import settings from '../../../config/settings';
import {getTranslate} from 'react-localize-redux';
import styles from '../../assets/styles';

const Achievement = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {achievements} = useSelector((state) => state.achievement);

  useEffect(() => {
    dispatch(getAchievementRequest());
  }, [dispatch]);

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

  return (
    <>
      <HeaderBar onGoBack={() => handleGoBack()} />
      <ScrollView style={styles.backgroundWhite}>
        {achievements.map((item, i) => (
          <View opacity={item.obtained ? 1.0 : 0.3} key={i}>
            <ListItem onPress={() => console.warn('Badge details')}>
              <Avatar
                source={{
                  uri: settings.apiBaseURL.replace('/api', '') + item.icon,
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
    </>
  );
};

export default Achievement;
