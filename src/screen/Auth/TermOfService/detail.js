/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect} from 'react';
import {Text} from 'react-native-elements';
import {ScrollView, View} from 'react-native';
import styles from '../../../assets/styles';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {fetchTermOfServiceRequest} from '../../../store/user/actions';

const TermOfServiceDetail = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const termContent = useSelector((state) => state.user.termOfService);

  useEffect(() => {
    dispatch(fetchTermOfServiceRequest());
  }, [dispatch]);

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={translate('term.of.service.detail')}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View>
          <Text>
            {termContent.content || translate('term.of.service.not_found')}
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default TermOfServiceDetail;
