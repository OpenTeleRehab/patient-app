/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import FIcon from 'react-native-vector-icons/Feather';
import {Linking, StyleSheet, Switch, View} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Button, Text} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {enableKidTheme, logoutRequest} from '../store/user/actions';
import {isPhcWorker} from '../utils/helper';
import settings from '../../config/settings';
import {drawerItems} from '../variables/routes';
import variables from '../assets/styles/variables';
import styles from '../assets/styles';

const renderDrawerIcon = (item, size, color) => (
  <FIcon name={item.icon} color={color} size={size} />
);

const DrawerContent = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {accessToken, profile} = useSelector((state) => state.user);
  const [isKidTheme, setIsKidTheme] = useState(profile.kid_theme !== 0);

  const handleKidThemeChange = (value) => {
    setIsKidTheme(value);
    dispatch(enableKidTheme(accessToken, value));
  };

  const handleNavigate = (route) => {
    navigation.closeDrawer();
    navigation.navigate(route.name);
  };

  const handleOpenWebPortal = async () => {
    await Linking.openURL(settings.therapistBaseURL);
  };

  const handleLogout = () => {
    dispatch(logoutRequest(accessToken));
  };

  return (
    <View style={componentStyles.drawerContainer}>
      {!isPhcWorker(profile.type) && (
        <View style={componentStyles.drawerHeader}>
          <View style={componentStyles.childThemeWrapper}>
            <Text accessible accessibilityLabel={translate('common.theme.kid')}>
              {translate('common.theme.kid')}
            </Text>
            <Switch
              trackColor={{false: variables.grey, true: variables.primary}}
              thumbColor={variables.white}
              ios_backgroundColor={variables.grey}
              onValueChange={(value) => handleKidThemeChange(value)}
              value={isKidTheme}
            />
          </View>
        </View>
      )}
      <DrawerContentScrollView>
        {drawerItems.map((item, index) => (
          <DrawerItem
            key={index}
            label={translate(item.label)}
            labelStyle={styles.textDefault}
            onPress={() => handleNavigate(item)}
            icon={({size, color}) => renderDrawerIcon(item, size, color)}
          />
        ))}
      </DrawerContentScrollView>
      <View style={componentStyles.drawerFooter}>
        {isPhcWorker(profile.type) && (
          <Button
            title={translate('common.web_portal')}
            icon={{
              name: 'phonelink',
              size: 18,
              color: 'white',
            }}
            onPress={handleOpenWebPortal}
          />
        )}
        <Button
          title={translate('common.logout')}
          icon={{
            name: 'logout',
            size: 18,
            color: 'white',
          }}
          onPress={handleLogout}
          buttonStyle={styles.navDrawerLogoutBotton}
        />
        <Button
          title={translate('common.back')}
          type="outline"
          onPress={() => navigation.closeDrawer()}
          buttonStyle={styles.navDrawerBackBotton}
        />
      </View>
    </View>
  );
};

const componentStyles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: variables.white,
    paddingVertical: 24,
  },
  drawerHeader: {
    marginBottom: 22,
    paddingHorizontal: 12,
  },
  drawerFooter: {
    gap: 8,
    marginTop: 22,
    paddingHorizontal: 12,
  },
  childThemeWrapper: {
    alignItems: 'center',
    backgroundColor: variables.grey6,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: variables.spacingMd,
  },
});

export default DrawerContent;
