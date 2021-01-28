/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useState} from 'react';
import {Button, CheckBox, withTheme, Text} from 'react-native-elements';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import styles from '../../../assets/styles';
import {ROUTES} from '../../../variables/constants';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {acceptTermOfServiceRequest} from '../../../store/user/actions';

const customStyles = {
  termDetailLink: {
    marginTop: 26,
    marginBottom: 86,
  },
};
const TermOfService = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const profile = useSelector((state) => state.user.profile);
  const termContent = useSelector((state) => state.user.termOfService);
  const isLoading = useSelector((state) => state.user.isLoading);

  const onSubmit = () => {
    if (profile.id) {
      dispatch(acceptTermOfServiceRequest(termContent.id));
    } else {
      navigation.navigate(ROUTES.SETUP_PIN);
    }
  };

  return (
    <>
      <HeaderBar title={translate('term.of.service')} />
      <ScrollView style={styles.mainContainerLight}>
        <View style={styles.paddingMd}>
          <CheckBox
            title={translate('term.of.service.agree')}
            checked={acceptAgreement}
            onPress={() => setAcceptAgreement(!acceptAgreement)}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.TERM_OF_SERVICE_DETAIL)}
            style={customStyles.termDetailLink}>
            <Text style={styles.hyperlink}>
              {translate('term.of.service.detail.link')}
            </Text>
          </TouchableOpacity>
          <Button
            title={translate('common.next')}
            disabled={!acceptAgreement || isLoading}
            onPress={() => onSubmit()}
            containerStyle={styles.marginTop}
            titleStyle={styles.textUpperCase}
          />
          <Button
            icon={{
              name: 'chevron-left',
              type: 'font-awesome-5',
              color: theme.colors.primary,
              size: 28,
            }}
            title={translate('common.back')}
            type="clear"
            onPress={() =>
              navigation.navigate(profile.id ? ROUTES.LOGIN : ROUTES.REGISTER)
            }
            containerStyle={styles.marginTop}
            titleStyle={styles.textUpperCase}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(TermOfService);
