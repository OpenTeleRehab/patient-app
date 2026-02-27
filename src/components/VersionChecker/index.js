import React, {useState, useEffect} from 'react';
import DeviceInfo from 'react-native-device-info';
import {Linking, Platform} from 'react-native';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {mutation} from '../../store/appSetting/mutations';
import {getAppSettingsRequest} from '../../store/appSetting/actions';
import settings from '../../../config/settings';
import CommonPopup from '../Common/Popup';

const VersionChecker = () => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {appVersion, skipVersion} = useSelector((state) => state.appSettings);
  const [appForceUpdate, setAppForceUpdate] = useState(false);
  const [appOutdatedPopup, setAppOutdatedPopup] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      dispatch(getAppSettingsRequest({name: 'android'}));
    } else {
      dispatch(getAppSettingsRequest({name: 'ios'}));
    }
  }, [dispatch]);

  useEffect(() => {
    if (appVersion && appVersion.length > 0) {
      const force = appVersion.includes('f');
      const version = parseInt(DeviceInfo.getBuildNumber(), 10);
      const requiredVersion = parseInt(appVersion, 10);
      if (
        (version < requiredVersion && skipVersion !== requiredVersion) ||
        (force && skipVersion === requiredVersion)
      ) {
        setAppOutdatedPopup(true);
        setAppForceUpdate(force);
      } else {
        setAppOutdatedPopup(false);
      }
    }
  }, [appVersion, skipVersion]);

  const handleConfirm = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL(settings.appStoreURL);
    } else {
      Linking.openURL(settings.playStoreURL);
    }
  }

  const handleCancel = () => {
    setAppOutdatedPopup(false);

    if (appVersion && appVersion.length > 0) {
      dispatch(mutation.appSettingsUpdateSkipVersion(parseInt(appVersion, 10)));
    }
  }

  return (
    <CommonPopup
      popup={appOutdatedPopup}
      iconType="material"
      iconName="update"
      tittle={translate('app.update.title')}
      message={translate(
        appForceUpdate ? 'app.update.message.force' : 'app.update.message',
      )}
      onConfirm={handleConfirm}
      onCancel={appForceUpdate ? null : handleCancel}
    />
  );
}

export default VersionChecker;
