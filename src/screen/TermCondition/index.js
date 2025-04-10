/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchTermOfServiceRequest} from '../../store/user/actions';
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

const TermCondition = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {termOfService} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchTermOfServiceRequest());
  }, [dispatch]);

  const getTextsToSpeech = () => {
    const texts = [];

    if (termOfService && termOfService.content) {
      let content = termOfService.content;
      content = content.replace(/<\/?[^>]+(>|$)/g, '');
      texts.push(content);
    }

    return texts;
  };

  return (
    <>
      <HeaderBar
        backgroundPrimary={false}
        title={translate('menu.tc')}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={containerStyle}>
        {!_.isEmpty(termOfService) && (
          <>
            <View style={[styles.paddingMd, styles.flexColumn]}>
              <TTSButton
                textsToSpeech={getTextsToSpeech()}
                style={styles.marginLeft}
              />
              <HTML
                source={{html: termOfService.content}}
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
          </>
        )}
      </ScrollView>
    </>
  );
};

export default TermCondition;
