import React, {useEffect, useState} from 'react';
import {Button, Icon, Text, withTheme} from 'react-native-elements';
import styles from '../../../assets/styles';
import {ROUTES} from '../../../variables/constants';
import HeaderBar from '../../../components/Common/HeaderBar';
import _ from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {View, PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {getTranslate} from 'react-localize-redux';
import RNFS from 'react-native-fs';
import {completeActive} from '../../../store/activity/actions';

const MaterialDetail = ({theme, route, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {id, activityNumber} = route.params;
  const {treatmentPlan} = useSelector((state) => state.activity);
  const [material, setMaterial] = useState(undefined);

  useEffect(() => {
    if (id && treatmentPlan.activities.length) {
      const selectedMaterial = _.find(treatmentPlan.activities, {
        id,
      });

      if (selectedMaterial) {
        setMaterial(selectedMaterial);
      }
    }
  }, [id, treatmentPlan]);

  const handleCompleteTask = () => {
    dispatch(completeActive(material.id)).then((res) => {
      if (res) {
        navigation.navigate(ROUTES.ACTIVITY);
      }
    });
  };

  const handleDownload = async () => {
    let location = '';
    if (Platform.OS === 'ios') {
      location = RNFS.DocumentDirectoryPath;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (!granted) {
        return;
      }
      location = RNFS.ExternalStorageDirectoryPath + '/Download';
    }

    RNFS.downloadFile({
      fromUrl: 'https://facebook.github.io/react-native/img/header_logo.png',
      toFile: `${location}/react-native.png`,
    }).promise.then(() => {
      ToastAndroid.show(
        translate('activity.file_has_been_downloaded_successfully'),
        ToastAndroid.SHORT,
      );
    });
  };

  if (!material) {
    return (
      <HeaderBar
        leftContent={{label: ''}}
        rightContent={{
          label: translate('common.close'),
          onPress: () => navigation.navigate(ROUTES.ACTIVITY),
        }}
      />
    );
  }

  return (
    <>
      <HeaderBar
        leftContent={
          <Text h4 style={styles.textLight}>
            {translate('activity.activity_number', {number: activityNumber})}
            {!!material.completed && (
              <Icon
                name="check"
                type="font-awesome-5"
                color={theme.colors.white}
                size={18}
                style={styles.marginLeft}
              />
            )}
          </Text>
        }
        rightContent={{
          label: translate('common.close'),
          onPress: () => navigation.navigate(ROUTES.ACTIVITY),
        }}
      />
      <View
        style={[
          styles.flexColumn,
          styles.mainContainerLight,
          styles.noPadding,
          styles.justifyContentSpaceBetween,
        ]}>
        <View>
          <View style={[styles.marginY, styles.alignSelfCenter]}>
            <Text h4>{material.title}</Text>
          </View>
          <Button
            title={translate('activity.download', {
              number: activityNumber,
            })}
            titleStyle={styles.textUpperCase}
            onPress={handleDownload}
          />
        </View>
        <Button
          icon={{
            name: 'check',
            type: 'font-awesome-5',
            color: theme.colors.white,
          }}
          title={translate('activity.complete_task_number', {
            number: activityNumber,
          })}
          titleStyle={styles.textUpperCase}
          onPress={handleCompleteTask}
          disabled={!!material.completed}
        />
      </View>
    </>
  );
};

export default withTheme(MaterialDetail);
