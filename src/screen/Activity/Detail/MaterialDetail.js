import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Divider,
  Icon,
  Text,
  withTheme,
} from 'react-native-elements';
import styles from '../../../assets/styles';
import {MATERIAL_TYPE, ROUTES} from '../../../variables/constants';
import HeaderBar from '../../../components/Common/HeaderBar';
import _ from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {
  Alert,
  View,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {getTranslate} from 'react-localize-redux';
import RNFS from 'react-native-fs';
import {
  completeActive,
  completeActivityOffline,
} from '../../../store/activity/actions';
import {getDownloadDirectoryPath} from '../../../utils/fileSystem';
import {useNetInfo} from '@react-native-community/netinfo';
import TTSButton from '../../../components/TTSButton';
import moment from 'moment';
import quackerEducationMaterial from '../../../assets/images/quacker-education-material.png';
import RNLocalize from 'react-native-localize';

const MaterialDetail = ({theme, route, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const {profile} = useSelector((state) => state.user);
  const translate = getTranslate(localize);
  const {id, activityNumber} = route.params;
  const {treatmentPlan, offlineActivities} = useSelector(
    (state) => state.activity,
  );
  const [material, setMaterial] = useState(undefined);
  const [isCompletedOffline, setIsCompletedOffline] = useState(false);
  const netInfo = useNetInfo();
  const {adminApiBaseURL} = useSelector((state) => state.phone);

  useEffect(() => {
    navigation.getParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.getParent().setOptions({tabBarVisible: true});
    };
  }, [navigation]);

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

  useEffect(() => {
    if (material) {
      if (!material.completed) {
        const offlineActivity = offlineActivities.find((item) => {
          return item.id === material.id;
        });
        if (offlineActivity) {
          setIsCompletedOffline(true);
        }
      }
    }
  }, [material, offlineActivities]);

  const handleCompleteTask = () => {
    if (netInfo.isConnected) {
      dispatch(
        completeActive({id: material.id, timezone: RNLocalize.getTimeZone()}),
      ).then((res) => {
        if (res) {
          navigation.navigate(ROUTES.ACTIVITY);
        }
      });
    } else {
      let offlineActivityObj = _.cloneDeep(offlineActivities);
      offlineActivityObj.push({
        id: material.id,
        timezone: RNLocalize.getTimeZone(),
      });
      dispatch(completeActivityOffline(offlineActivityObj));
      navigation.navigate(ROUTES.ACTIVITY);
    }
  };

  const handleDownload = async () => {
    const location = await getDownloadDirectoryPath();
    if (location === false) {
      return;
    }

    RNFS.downloadFile({
      fromUrl: adminApiBaseURL + '/file/' + material.file.id,
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
              {material.file &&
              (material.file.hasThumbnail ||
                material.file.fileGroupType === MATERIAL_TYPE.image) ? (
                <Card.Image
                  source={{
                    uri: `${adminApiBaseURL}/file/${material.file.id}?thumbnail=${material.file.hasThumbnail}`,
                  }}
                  style={styles.activityCardImage}
                />
              ) : profile.kid_theme ? (
                <Card.Image
                  source={quackerEducationMaterial}
                  style={styles.activityCardImage}
                  resizeMode={'cover'}
                />
              ) : (
                <>
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
                    style={[
                      styles.marginLeft,
                      styles.marginY,
                      styles.textLight,
                    ]}>
                    {material.file
                      ? translate(material.file.fileGroupType)
                      : ''}
                  </Text>
                </>
              )}
            </View>
          </Card>
          <View
            style={[
              styles.paddingY,
              styles.paddingXLg,
              styles.flexRow,
              styles.alignSelfCenter,
            ]}>
            <Text style={styles.activityEntryTitle}>{material.title}</Text>
            <TTSButton
              textsToSpeech={[material.title]}
              style={styles.marginLeft}
            />
          </View>
          {material.file && (
            <TouchableOpacity
              disabled={!netInfo.isConnected}
              onPress={handleDownload}
              style={styles.educationMaterialDownloadWrapper}>
              <Text
                numberOfLines={1}
                style={[
                  styles.hyperlink,
                  styles.educationMaterialFileName,
                  netInfo.isConnected === false && {color: theme.colors.grey},
                ]}>
                {material.file.fileName}
              </Text>
              <Icon
                name="download"
                color={
                  netInfo.isConnected ? theme.colors.primary : theme.colors.grey
                }
                size={25}
                type="font-awesome-5"
              />
            </TouchableOpacity>
          )}
        </ScrollView>

        <Divider />
        <View style={styles.stickyButtonWrapper}>
          <Button
            containerStyle={styles.stickyButtonContainer}
            title={translate(
              material.completed || isCompletedOffline
                ? 'activity.completed_task_number'
                : 'activity.complete_task_number',
              {
                number: activityNumber,
              },
            )}
            onPress={handleCompleteTask}
            disabled={
              !!material.completed ||
              isCompletedOffline ||
              moment().isBefore(material.date, 'day')
            }
            disabledTitleStyle={styles.stickyDisabledTitleStyle}
          />
        </View>
      </View>
    </>
  );
};

export default withTheme(MaterialDetail);
