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

const contentWidth = Dimensions.get('window').width;

const containerStyle = {
  flexGrow: 1,
  backgroundColor: 'white',
};

const listStyle = {
  paddingLeft: 5,
  paddingRight: 5,
  fontFamily: 'Nunito-Bold',
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

const TermCondition = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {termOfService} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchTermOfServiceRequest());
  }, [dispatch]);

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
            <View style={[styles.paddingMd, styles.flexColumn, contentStyle]}>
              <View>
                <HTML
                  source={{html: termOfService.content}}
                  contentWidth={contentWidth}
                  listsPrefixesRenderers={{
                    ol: (
                      _htmlAttribs,
                      _children,
                      _convertedCSSStyles,
                      passProps,
                    ) => {
                      return (
                        <Text style={[olStyle, listStyle]}>
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
                      return <Text style={[ulStyle, listStyle]}>.</Text>;
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

export default TermCondition;
