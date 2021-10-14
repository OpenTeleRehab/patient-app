/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {Button, CheckBox, withTheme, Text} from 'react-native-elements';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import styles from '../../../assets/styles';
import {ROUTES} from '../../../variables/constants';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {
  acceptTermOfServiceRequest,
  fetchPrivacyPolicyRequest,
  fetchTermOfServiceRequest,
  acceptPrivacyPolicyRequest,
} from '../../../store/user/actions';

const customStyles = {
  termDetailLink: {
    marginTop: 26,
    marginBottom: 20,
  },
  privacyDetailLink: {
    marginBottom: 86,
  },
};
const TermOfService = ({theme, navigation}) => {
  const dispatch = useDispatch();
  const [acceptAgreement, setAcceptAgreement] = useState(false);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {profile, isNewRegister} = useSelector((state) => state.user);
  const termContent = useSelector((state) => state.user.termOfService);
  const privacyContent = useSelector((state) => state.user.privacyPolicy);
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    dispatch(fetchTermOfServiceRequest());
    dispatch(fetchPrivacyPolicyRequest());
  }, [dispatch]);

  const onSubmit = () => {
    if (profile.id && !isNewRegister) {
      dispatch(acceptTermOfServiceRequest(termContent.id));
      dispatch(acceptPrivacyPolicyRequest(privacyContent.id));
    } else {
      // accept term and privacy policy when set up new pin
      navigation.navigate(ROUTES.SETUP_PIN);
    }
  };

  return (
    <>
      <HeaderBar
        backgroundPrimary={true}
        title={translate('term.of.service')}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View style={styles.paddingMd}>
          <CheckBox
            title={translate('term.of.service.agree')}
            checked={acceptAgreement}
            onPress={() => setAcceptAgreement(!acceptAgreement)}
          />
          <CheckBox
            title={translate('privacy.policy.agree')}
            checked={acceptPrivacyPolicy}
            onPress={() => setAcceptPrivacyPolicy(!acceptPrivacyPolicy)}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.TERM_OF_SERVICE_DETAIL)}
            style={customStyles.termDetailLink}>
            <Text style={styles.hyperlink}>
              {translate('term.of.service.detail.link')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY_DETAIL)}
            style={customStyles.privacyDetailLink}>
            <Text style={styles.hyperlink}>
              {translate('privacy.policy.detail.link')}
            </Text>
          </TouchableOpacity>
          <Button
            title={translate('common.next')}
            disabled={!acceptAgreement || !acceptPrivacyPolicy || isLoading}
            onPress={() => onSubmit()}
            containerStyle={styles.marginTop}
          />
          <Button
            title={translate('common.back')}
            type="clear"
            onPress={() =>
              navigation.navigate(profile.id ? ROUTES.LOGIN : ROUTES.REGISTER)
            }
            containerStyle={styles.marginTop}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(TermOfService);
