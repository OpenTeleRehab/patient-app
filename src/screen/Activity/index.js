/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';

const Activity = () => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <>
      <HeaderBar
        leftContent={{label: translate('tab.activities')}}
        rightContent={{
          icon: 'arrow-collapse-down',
          iconType: 'material-community',
          label: translate('common.download'),
          onPress: () => null,
        }}
      />
      <ScrollView style={styles.mainContainerPrimary}>
        <View style={styles.flexCenter}>
          <Text h4 style={styles.textLight}>
            Activity Screen
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Activity;
