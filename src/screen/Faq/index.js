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
import {getTranslate} from 'react-localize-redux';
import _ from 'lodash';

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
};
const listStyle = {
  paddingLeft: 5,
  paddingRight: 5,
  fontWeight: 'bold',
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

const Faq = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const {faqPage} = useSelector((state) => state.staticPage);
  const {language} = useSelector((state) => state.translation);
  const translate = getTranslate(localize);
  const uri = faqPage.file
    ? settings.adminApiBaseURL + '/file/' + faqPage.file.id
    : '';

  useEffect(() => {
    dispatch(getFaqPageRequest());
  }, [language, dispatch]);
  return (
    <>
      <HeaderBar onGoBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={containerStyle}>
        {!_.isEmpty(faqPage) && (
          <>
            {faqPage.file ? (
              <View>
                <Image source={{uri}} style={imageStyle} />
                <Text style={[titleStyle, styles.textLight, styles.fontSizeMd]}>
                  {faqPage.title}
                </Text>
              </View>
            ) : (
              <View>
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
                  tagsStyles={{
                    p: {color: faqPage.text_color},
                    ul: {color: faqPage.text_color},
                    ol: {color: faqPage.text_color},
                    h1: {color: faqPage.text_color},
                    h2: {color: faqPage.text_color},
                    h3: {color: faqPage.text_color},
                    h4: {color: faqPage.text_color},
                    h5: {color: faqPage.text_color},
                    h6: {color: faqPage.text_color},
                  }}
                  listsPrefixesRenderers={{
                    ol: (
                      _htmlAttribs,
                      _children,
                      _convertedCSSStyles,
                      passProps,
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
                    },
                    ul: (
                      _htmlAttribs,
                      _children,
                      _convertedCSSStyles,
                      passProps,
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
                    },
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
