/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPrivacyPolicyRequest} from '../../store/user/actions';
import HeaderBar from '../../components/Common/HeaderBar';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import HTML from 'react-native-render-html';
import styles from '../../assets/styles';
import _ from 'lodash';
import {getTranslate} from 'react-localize-redux';
import {tagsStyles} from '../../variables/tagsStyles';
import TTSButton from '../../components/TTSButton';

const contentWidth = Dimensions.get('window').width;

const containerStyle = {
  flexGrow: 1,
  backgroundColor: 'white',
};

const listStyle = {
  paddingLeft: 5,
  paddingRight: 5,
};
const olStyle = {
  fontSize: 15,
};

const ulStyle = {
  marginTop: -20,
  fontSize: 30,
};

const contentStyle = {
  paddingBottom: 50,
};

const olRenderer = (
  passProps,
) => {
  return (
    <Text style={[olStyle, listStyle]}>
      {passProps.index + 1}.
    </Text>
  );
};

const ulRenderer = () => {
  return <Text style={[ulStyle, listStyle]}>.</Text>;
};

const PrivacyPolicy = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {privacyPolicy} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchPrivacyPolicyRequest());
  }, [dispatch]);

  const getTextsToSpeech = () => {
    const texts = [];

    if (privacyPolicy && privacyPolicy.content) {
      let content = privacyPolicy.content;
      content = content.replace(/<\/?[^>]+(>|$)/g, '');
      texts.push(content);
    }

    return texts;
  };

  return (
    <>
      <HeaderBar
        backgroundPrimary={false}
        title={translate('menu.privacy')}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={containerStyle}>
        {!_.isEmpty(privacyPolicy) && (
          <>
            <View style={[styles.paddingMd, styles.flexColumn, contentStyle]}>
              <View>
                <TTSButton
                  textsToSpeech={getTextsToSpeech()}
                  style={styles.marginLeft}
                />
                <HTML
                  source={{html: privacyPolicy.content}}
                  contentWidth={contentWidth}
                  tagsStyles={tagsStyles}
                  listsPrefixesRenderers={{
                    ol: (
                      _htmlAttribs,
                      _children,
                      _convertedCSSStyles,
                      passProps,
                    ) => olRenderer(passProps),
                    ul: (
                      _htmlAttribs,
                      _children,
                      _convertedCSSStyles,
                      passProps,
                    ) => ulRenderer(),
                  }}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default PrivacyPolicy;
