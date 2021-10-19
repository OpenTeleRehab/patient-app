/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View, Dimensions} from 'react-native';
import styles from '../../../assets/styles';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import HTML from 'react-native-render-html';

const contentWidth = Dimensions.get('window').width;

const TermOfServiceDetail = ({navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const privacyContent = useSelector((state) => state.user.privacyPolicy);

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={translate('privacy.policy.detail')}
        backgroundPrimary={true}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View>
          {(
            <HTML
              source={{html: privacyContent && privacyContent.content}}
              contentWidth={contentWidth}
            />
          ) || translate('privacy.policy.not_found')}
        </View>
      </ScrollView>
    </>
  );
};

export default TermOfServiceDetail;
