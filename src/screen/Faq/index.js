/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getFaqPageRequest} from '../../store/staticPage/actions';
import HeaderBar from '../../components/Common/HeaderBar';
import {Dimensions, ScrollView, Text, View} from 'react-native';
import {Image} from 'react-native-elements';
import settings from '../../../config/settings';
import HTML from 'react-native-render-html';
import styles from '../../assets/styles';
import _ from 'lodash';
import {getTranslate} from 'react-localize-redux';
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

const contentStyle = {
  paddingBottom: 50,
};

const olRenderer = (
  _htmlAttribs,
  _children,
  _convertedCSSStyles,
  passProps,
  faqPage,
) => {
  return (
    <Text
      style={[
        olStyle,
        listStyle,
        {
          color: faqPage.text_color,
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
  faqPage,
) => {
  return (
    <Text
      style={[
        ulStyle,
        listStyle,
        {
          color: faqPage.text_color,
        },
      ]}>
      .
    </Text>
  );
};

const Faq = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {faqPage} = useSelector((state) => state.staticPage);
  const {language} = useSelector((state) => state.translation);
  const uri = faqPage.file
    ? settings.adminApiBaseURL + '/file/' + faqPage.file.id
    : '';

  useEffect(() => {
    dispatch(getFaqPageRequest());
  }, [language, dispatch]);

  const getTextsToSpeech = () => {
    if (faqPage) {
      const texts = [faqPage.title];

      if (faqPage.content) {
        let content = faqPage.content;
        content = content.replace(/<\/?[^>]+(>|$)/g, '');
        texts.push(content);
      }

      return texts;
    }

    return [];
  };

  return (
    <>
      <HeaderBar
        backgroundPrimary={false}
        title={translate('menu.faq')}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={containerStyle}>
        {!_.isEmpty(faqPage) && (
          <>
            {faqPage.file ? (
              <View>
                <TTSButton
                  textsToSpeech={getTextsToSpeech()}
                  style={styles.marginLeft}
                />
                <Image source={{uri}} style={imageStyle} />
                <Text style={[titleStyle, styles.textLight, styles.fontSizeMd]}>
                  {faqPage.title}
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
                    {backgroundColor: faqPage.background_color},
                  ]}>
                  {faqPage.title}
                </Text>
              </View>
            )}
            <View
              style={[
                styles.paddingMd,
                styles.flexColumn,
                contentStyle,
                {
                  backgroundColor: faqPage.background_color,
                },
              ]}>
              <View>
                <HTML
                  source={{html: faqPage.content}}
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
                      faqPage,
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
                      faqPage,
                    ),
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

export default Faq;
