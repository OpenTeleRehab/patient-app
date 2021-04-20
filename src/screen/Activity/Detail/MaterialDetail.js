import React, {useEffect, useState} from 'react';
import {Button, Card, Icon, Text, withTheme} from 'react-native-elements';
import styles from '../../../assets/styles';
import {ROUTES} from '../../../variables/constants';
import HeaderBar from '../../../components/Common/HeaderBar';
import _ from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {
  Alert,
  View,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {getTranslate} from 'react-localize-redux';
import RNFS from 'react-native-fs';
import {completeActive} from '../../../store/activity/actions';
import settings from '../../../../config/settings';

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
      fromUrl: settings.adminApiBaseURL + '/file/' + material.file.id,
      toFile: `${location}/${material.file.fileName}`,
    }).promise.then(() => {
      if (Platform.OS === 'ios') {
        Alert.alert(
          translate('common.download'),
          translate('activity.file_has_been_downloaded_successfully'),
        );
      } else {
        ToastAndroid.show(
          translate('activity.file_has_been_downloaded_successfully'),
          ToastAndroid.SHORT,
        );
      }
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
          <Text numberOfLines={1} h4 style={styles.textLight}>
            {material.title}
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
        ]}>
        <ScrollView contentContainerStyle={styles.marginBottom}>
          <Card containerStyle={styles.activityCardContainer}>
            <View style={[styles.cardWithIconHeader, styles.bgPrimary]}>
              <View style={styles.cardWithIconWrapper}>
                <Icon
                  name="description"
                  color={theme.colors.white}
                  size={100}
                  type="material"
                />
                <Text
                  style={[styles.cardWithIconHeaderTitle, styles.textLight]}
                  numberOfLines={1}>
                  {translate('activity.material')}
                </Text>
              </View>
              <Text
                style={[styles.marginLeft, styles.marginY, styles.textLight]}>
                {material.file ? translate(material.file.fileGroupType) : ''}
              </Text>
            </View>
          </Card>
          <View style={[styles.paddingXMd, styles.alignSelfCenter]}>
            <Text h4>{material.title}</Text>
          </View>
          {material.file && (
            <TouchableOpacity
              onPress={handleDownload}
              style={styles.educationMaterialDownloadWrapper}>
              <Text
                numberOfLines={1}
                style={[styles.hyperlink, styles.educationMaterialFileName]}>
                {material.file.fileName}
              </Text>
              <Icon
                name="download"
                color={theme.colors.primary}
                size={25}
                type="font-awesome-5"
              />
            </TouchableOpacity>
          )}
        </ScrollView>
        <Button
          icon={{
            name: 'check',
            type: 'font-awesome-5',
            color: theme.colors.white,
          }}
          title={translate(
            material.completed
              ? 'activity.completed_task_number'
              : 'activity.complete_task_number',
            {
              number: activityNumber,
            },
          )}
          titleStyle={styles.textUpperCase}
          onPress={handleCompleteTask}
          disabled={!!material.completed}
        />
      </View>
    </>
  );
};

export default withTheme(MaterialDetail);
