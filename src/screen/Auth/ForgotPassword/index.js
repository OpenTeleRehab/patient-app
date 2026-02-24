import React, {useState} from 'react';
import {Button, withTheme} from 'react-native-elements';
import {Alert, View} from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import styles from '../../../assets/styles';
import TextField from '../../../components/Common/TextField';
import validateEmail from '../../../utils/validateEmail';
import {ROUTES} from '../../../variables/constants';
import {forgotPasswordRequest} from '../../../store/user/actions';

const ForgotPassword = ({navigation, route}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [email, setEmail] = useState(route.params?.email);
  const [errorEmail, setErrorEmail] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState();

  const handleResetPassword = async () => {
    if (!validateEmail(email)) {
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
      setForgotPasswordError('');
      try {
        const res = await dispatch(forgotPasswordRequest(email));
        if (res.success) {
          Alert.alert(
            translate('common.check_your_email'),
            translate('common.check_email_description'),
            [
              {
                text: translate('common.ok'),
                onPress: () =>
                  navigation.navigate(ROUTES.REGISTER, {registerIndexTab: 1}),
              },
            ],
            {cancelable: false},
          );
        } else {
          if (res.message) {
            setForgotPasswordError(res.message);
          }
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }
  };

  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={translate('common.forgot_password')}
      />
      <View style={styles.paddingMd}>
        <TextField
          label={translate('register.email.label')}
          placeholder={translate('register.email.placeholder')}
          keyboardType="email-address"
          variant="filled"
          value={email}
          onChangeText={setEmail}
          renderErrorMessage={errorEmail}
          errorMessage={
            errorEmail
              ? translate('error.message.email')
              : forgotPasswordError
              ? translate(forgotPasswordError)
              : null
          }
        />
        <Button
          onPress={handleResetPassword}
          title={translate('common.submit')}
          accessibilityLabel={translate('common.submit')}
        />
      </View>
    </>
  );
};

export default withTheme(ForgotPassword);
