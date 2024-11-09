/*
 * Copyright (c) 2024 Web Essentials Co., Ltd
 */
import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAboutPageRequest} from '../../store/staticPage/actions';
import HeaderBar from '../../components/Common/HeaderBar';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import formatPhoneNumber from '../../utils/phoneNumber';

const containerStyle = {
  flexGrow: 1,
  backgroundColor: 'white',
};

const Help = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const {language} = useSelector((state) => state.translation);
  const {clinic} = useSelector((state) => state.clinic);
  const {therapists} = useSelector((state) => state.therapist);
  const translate = getTranslate(localize);
  const [therapistsWithPhones, setTherapistWithPhones] = useState([]);

  useEffect(() => {
    dispatch(getAboutPageRequest());
  }, [language, dispatch]);

  useEffect(() => {
    if (therapists && therapists.length) {
      setTherapistWithPhones(therapists.filter((therapist) => therapist.phone));
    }
  }, [therapists]);

  return (
    <>
      <HeaderBar
        backgroundPrimary={false}
        title={translate('menu.help')}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={containerStyle}>
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
      </ScrollView>
    </>
  );
};

export default Help;
