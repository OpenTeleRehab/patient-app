/*
 * Copyright (c) 2020 Web Essentials Co., Ltd
 */
import React, {useState, useEffect, useRef, Fragment} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {Text} from 'react-native-elements';
import {
  loginRequest,
  fetchTermOfServiceRequest,
  generateFakeAccessToken,
  fetchPrivacyPolicyRequest,
} from '../../../store/user/actions';
import styles from '../../../assets/styles';
import logoWhite from '../../../assets/images/logo-white.png';
import kidLogo from '../../../assets/images/quacker-pincode.png';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {ROUTES} from '../../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import formatPhoneNumber from '../../../utils/phoneNumber';
import {getTherapistRequest} from '../../../store/therapist/actions';
import {getClinicRequest} from '../../../store/clinic/actions';

const containerStyle = {
  height: '100%',
};

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const {profile, phone, countryCode, dial_code, pin} = useSelector(
    (state) => state.user,
  );
  const {clinic} = useSelector((state) => state.clinic);
  const {therapists} = useSelector((state) => state.therapist);
  const translate = getTranslate(localize);
  const [code, setCode] = useState('');
  const [therapistsWithPhones, setTherapistWithPhones] = useState([]);
  const [errorCode, setErrorCode] = useState(false);

  const codeInputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      const clinicId = profile.clinic_id;
      const primaryTherapistIds = [profile.therapist_id];
      const secondaryTherapistIds = profile.secondary_therapists;
      dispatch(
        getTherapistRequest({
          ids: JSON.stringify(
            primaryTherapistIds.concat(secondaryTherapistIds),
          ),
        }),
      );
      dispatch(getClinicRequest(clinicId));
    }
  }, [dispatch, profile]);

  useEffect(() => {
    if (therapists && therapists.length) {
      setTherapistWithPhones(therapists.filter((therapist) => therapist.phone));
    }
  }, [therapists]);

  const handleLogin = (passCode) => {
    dispatch(loginRequest(phone, passCode, countryCode)).then((loginResult) => {
      if (loginResult.success) {
        if (
          !loginResult.acceptedTermOfService ||
          !loginResult.acceptedPrivacyPolicy
        ) {
          navigation.navigate(ROUTES.TERM_OF_SERVICE);
        }
      } else {
        if (passCode === pin) {
          dispatch(generateFakeAccessToken());
        } else {
          Alert.alert(
            translate('common.login.fail'),
            translate('wrong.pin'),
            [{text: translate('common.ok'), onPress: () => reset()}],
            {cancelable: false},
          );
          setErrorCode(true);
        }
      }
    });
  };

  const reset = () => {
    setCode('');
  };

  const handleCodeInputPress = () => {
    codeInputRef.current?.focus();
  };

  useEffect(() => {
    dispatch(fetchTermOfServiceRequest());
    dispatch(fetchPrivacyPolicyRequest());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.bgLight}>
      <View style={!(profile && profile.kid_theme) && styles.authBanner}>
        {profile && profile.kid_theme ? (
          <Image source={kidLogo} style={styles.authKidLogo} />
        ) : (
          <Image source={logoWhite} style={styles.authLogoWhite} />
        )}
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={[styles.mainContainerLight, containerStyle]}>
        <View style={[styles.flexCenter, styles.paddingMd]}>
          <View>
            <Text
              style={[
                styles.formLabel,
                styles.marginTopMd,
                styles.textCenter,
                styles.textDefaultBold,
              ]}
              accessibilityLabel={translate('pin.enter.number')}>
              {translate('pin.enter.number')}
            </Text>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={translate('pin.enter.number')}
              onPress={handleCodeInputPress}
            >
              <SmoothPinCodeInput
                ref={codeInputRef}
                password
                value={code}
                onTextChange={(value) => setCode(value)}
                textStyle={styles.formPinText}
                cellStyleFocused={!errorCode && styles.formPinCellFocused}
                containerStyle={styles.formPinContainer}
                cellStyleFilled={styles.formPinCellFilled}
                cellStyle={[
                  styles.formPinCell,
                  errorCode && styles.formPinCellError,
                ]}
                cellSpacing={10}
                animated={false}
                mask={<View style={styles.formPinCustomMask} />}
                onFulfill={(passCode) => handleLogin(passCode)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.marginTop, styles.flexCenter]}
              onPress={() => navigation.navigate(ROUTES.REGISTER)}
              accessible={true}
              accessibilityLabel={translate('pin.forget')}>
              <Text style={styles.hyperlink}>{translate('pin.forget')}</Text>
            </TouchableOpacity>
            {dial_code && phone && (
              <Text
                style={[
                  styles.leadText,
                  styles.textDefault,
                  styles.textCenter,
                  styles.marginTopLg,
                ]}
                accessibilityLabel={translate('phone.number')}>
                {formatPhoneNumber(dial_code, phone)}
              </Text>
            )}
            <TouchableOpacity
              style={styles.marginY}
              onPress={() => navigation.navigate(ROUTES.REGISTER)}
              accessible={true}
              accessibilityLabel={translate('phone.login.other.number')}>
              <Text style={[styles.hyperlink, styles.textCenter]}>
                {translate('phone.login.other.number')}
              </Text>
            </TouchableOpacity>
            {clinic && clinic.phone && (
              <Fragment>
                <Text
                  style={[
                    styles.textSmall,
                    styles.marginTopMd,
                    styles.textCenter,
                    styles.textDefaultBold,
                  ]}
                  accessibilityLabel={translate('clinic.phone.number')}>
                  {translate('clinic.phone.number')}
                </Text>
                <TouchableOpacity
                  style={styles.marginY}
                  accessible={true}
                  accessibilityLabel={translate('call.to.clinic')}>
                  <Text style={[styles.hyperlink, styles.textCenter]}>
                    {formatPhoneNumber(clinic.dial_code, clinic.phone)}
                  </Text>
                </TouchableOpacity>
              </Fragment>
            )}
            {!!therapistsWithPhones.length && (
              <Fragment>
                <Text
                  style={[
                    styles.textSmall,
                    styles.marginTopMd,
                    styles.textCenter,
                    styles.textDefaultBold,
                  ]}
                  accessibilityLabel={translate('therapist.phone.numbers')}>
                  {translate('therapist.phone.numbers')}
                </Text>
                {therapistsWithPhones.map((therapist) => (
                  <TouchableOpacity
                    style={styles.marginY}
                    accessible={true}
                    accessibilityLabel={translate('call.to.therapist')}>
                    <Text style={[styles.hyperlink, styles.textCenter]}>
                      {formatPhoneNumber(therapist.dial_code, therapist.phone)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Fragment>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
