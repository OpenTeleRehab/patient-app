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
import {USER_ROLE} from '../../variables/constants';

const containerStyle = {
  flexGrow: 1,
  backgroundColor: 'white',
};

const Help = ({navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const {language} = useSelector((state) => state.translation);
  const {registerAs} = useSelector((state) => state.user);
  const {clinic} = useSelector((state) => state.clinic);
  const {phcService} = useSelector((state) => state.phcService);
  const {therapists, phcWorkers} = useSelector((state) => state.therapist);
  const translate = getTranslate(localize);
  const [therapistsWithPhones, setTherapistWithPhones] = useState([]);
  const phcWorkerWithPhones = phcWorkers.filter((phcWorker) => phcWorker.phone);

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
        title={translate('menu.help')}
        onGoBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={containerStyle}>
        {registerAs === USER_ROLE.HEALTH_WORKER ? (
          <>
            {phcService && phcService.phone_number && (
              <Fragment>
                <Text
                  style={[
                    styles.textSmall,
                    styles.marginTopMd,
                    styles.textCenter,
                    styles.textDefaultBold,
                  ]}
                  accessibilityLabel={translate('common.phc_service.phone.number')}>
                  {translate('common.phc_service.phone.number')}
                </Text>
                <TouchableOpacity
                  style={styles.marginY}
                  accessible={true}
                  accessibilityLabel={translate('common.call.to.phc_service')}>
                  <Text style={[styles.hyperlink, styles.textCenter]}>
                    {formatPhoneNumber(phcService.dial_code, phcService.phone_number)}
                  </Text>
                </TouchableOpacity>
              </Fragment>
            )}
          </>
        ) : (
          <>
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
                  accessibilityLabel={translate('common.call.to.clinic')}>
                  <Text style={[styles.hyperlink, styles.textCenter]}>
                    {formatPhoneNumber(clinic.dial_code, clinic.phone)}
                  </Text>
                </TouchableOpacity>
              </Fragment>
            )}
            {phcService && phcService.phone_number && (
              <Fragment>
                <Text
                  style={[
                    styles.textSmall,
                    styles.marginTopMd,
                    styles.textCenter,
                    styles.textDefaultBold,
                  ]}
                  accessibilityLabel={translate('common.phc_service.phone.number')}>
                  {translate('common.phc_service.phone.number')}
                </Text>
                <TouchableOpacity
                  style={styles.marginY}
                  accessible={true}
                  accessibilityLabel={translate('common.call.to.phc_service')}>
                  <Text style={[styles.hyperlink, styles.textCenter]}>
                    {formatPhoneNumber(phcService.dial_code, phcService.phone_number)}
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
                    key={therapist.id}
                    style={styles.marginY}
                    accessible={true}
                    accessibilityLabel={translate('common.call.to.therapist')}>
                    <Text style={[styles.hyperlink, styles.textCenter]}>
                      {formatPhoneNumber(therapist.dial_code, therapist.phone)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Fragment>
            )}
            {!!phcWorkerWithPhones.length && (
              <Fragment>
                <Text
                  style={[
                    styles.textSmall,
                    styles.marginTopMd,
                    styles.textCenter,
                    styles.textDefaultBold,
                  ]}
                  accessibilityLabel={translate('common.phc_worker.phone.number')}>
                  {translate('common.phc_worker.phone.number')}
                </Text>
                {phcWorkerWithPhones.map((phcWorker) => (
                  <TouchableOpacity
                    style={styles.marginY}
                    key={phcWorker.id}
                    accessible={true}
                    accessibilityLabel={translate('common.call.to.phc_worker')}>
                    <Text style={[styles.hyperlink, styles.textCenter]}>
                      {formatPhoneNumber(phcWorker.dial_code, phcWorker.phone)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Fragment>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
};

export default Help;
