/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAboutPageRequest} from '../../store/staticPage/actions';
import HeaderBar from '../../components/Common/HeaderBar';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import {Image} from 'react-native-elements';
import settings from '../../../config/settings';
import HTML from 'react-native-render-html';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import _ from 'lodash';
import {tagsStyles} from '../../variables/tagsStyles';
import TTSButton from '../../components/TTSButton';

const contentWidth = Dimensions.get('window').width;

const titleStyle = {
  position: 'absolute',
  zIndex: 1,
  bottom: 5,
  left: 15,
  right: 15,
};

const imageStyle = {
  width: contentWidth,
  height: 300,
};

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

const footerStyle = {
  position: 'absolute',
  bottom: 0,
  left: '30%',
  paddingBottom: 5,
};

const contentStyle = {
  paddingBottom: 50,
};

const olRenderer = (
  _htmlAttribs,
  _children,
  _convertedCSSStyles,
  passProps,
  aboutPage,
) => {
  return (
    <Text
      style={[
        olStyle,
        listStyle,
        {
          color: aboutPage.text_color,
        },
      ]}>
      {passProps.index + 1}.
    </Text>
  );
};

const ulRenderer = (
  _htmlAttribs,
  _children,
  _convertedCSSStyles,
  passProps,
  aboutPage,
) => {
  return (
    <Text
      style={[
        ulStyle,
        listStyle,
        {
          color: aboutPage.text_color,
        },
      ]}>
      .
    </Text>
  );
};

const About = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const {aboutPage} = useSelector((state) => state.staticPage);
  const {language} = useSelector((state) => state.translation);
  const translate = getTranslate(localize);
  const uri = aboutPage.file
    ? settings.adminApiBaseURL + '/file/' + aboutPage.file.id
    : '';

  useEffect(() => {
    dispatch(getAboutPageRequest());
  }, [language, dispatch]);

  const getTextsToSpeech = () => {
    if (aboutPage) {
      const texts = [aboutPage.title];

      if (aboutPage.content) {
        let content = aboutPage.content;
        content = content.replace(/<\/?[^>]+(>|$)/g, '');
        texts.push(content);
      }

      if (settings.appVersion) {
        texts.push(translate('app.version') + ' ' + settings.appVersion);
      }

      return texts;
    }

    return [];
  };

  return (
    <>
      <HeaderBar
        backgroundPrimary={false}
        title={translate('menu.about.app')}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={containerStyle}>
        {!_.isEmpty(aboutPage) && (
          <>
            {aboutPage.file ? (
              <View>
                <TTSButton
                  textsToSpeech={getTextsToSpeech()}
                  style={styles.marginLeft}
                />
                <Image source={{uri}} style={imageStyle} />
                <Text style={[titleStyle, styles.textLight, styles.fontSizeMd]}>
                  {aboutPage.title}
                </Text>
              </View>
            ) : (
              <View>
                <TTSButton
                  textsToSpeech={getTextsToSpeech()}
                  style={styles.marginLeft}
                />
                <Text
                  style={[
                    styles.fontSizeMd,
                    styles.paddingMd,
                    {backgroundColor: aboutPage.background_color},
                  ]}>
                  {aboutPage.title}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.paddingMd,
                styles.flexColumn,
                contentStyle,
                {
                  backgroundColor: aboutPage.background_color,
                },
              ]}>
              <View>
                <HTML
                  source={{html: aboutPage.content}}
                  contentWidth={contentWidth}
                  tagsStyles={tagsStyles}
                  listsPrefixesRenderers={{
                    ol: (
                      _htmlAttribs,
                      _children,
                      _convertedCSSStyles,
                      passProps,
                    ) => olRenderer(
                      _htmlAttribs,
                      _children,
                      _convertedCSSStyles,
                      passProps,
                      aboutPage,
                    ),
                    ul: (
                      _htmlAttribs,
                      _children,
                      _convertedCSSStyles,
                      passProps,
                    ) => ulRenderer(
                      _htmlAttribs,
                      _children,
                      _convertedCSSStyles,
                      passProps,
                      aboutPage,
                    ),
                  }}
                />
              </View>
              <View style={footerStyle}>
                <Text
                  style={[
                    styles.fontWeightBold,
                    styles.fontSizeMd,
                    {color: aboutPage.text_color},
                  ]}>
                  {translate('app.version') + ' ' + settings.appVersion}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default About;
