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

const contentWidth = Dimensions.get('window').width;

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

const PrivacyPolicy = ({navigation}) => {
  const dispatch = useDispatch();
  const {privacyPolicy} = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchPrivacyPolicyRequest());
  }, [dispatch]);

  return (
    <>
      <HeaderBar onGoBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={containerStyle}>
        {!_.isEmpty(privacyPolicy) && (
          <>
            <View style={[styles.paddingMd, styles.flexColumn, contentStyle]}>
              <View>
                <HTML
                  source={{html: privacyPolicy.content}}
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

export default PrivacyPolicy;
