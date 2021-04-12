/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import {withTheme, Icon, Text, Input} from 'react-native-elements';
import CameraRoll from '@react-native-community/cameraroll';
import {Picker} from '@react-native-picker/picker';
import _ from 'lodash';
import styles from '../../assets/styles';
import GridItem from './GridItem';
import {isValidFileSize, nEveryRow, toMB} from '../../utils/helper';

const VIDEO_TYPE = 'Videos';
const FIRST_LOAD_MEDIAS = 15;
const ITEM_PER_ROW = 3;
const MediaPicker = (props) => {
  const {
    theme,
    visible,
    onClose,
    onSend,
    allMediaText,
    allVideoText,
    emptyText,
    captionPlaceholder,
    sizeErrorText,
    buttonOKLabel,
  } = props;
  const [albums, setAlbums] = useState([]);
  const [medias, setMedias] = useState([]);
  const [data, setData] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [lastCursor, setLastCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [showInputCaption, setShowInputCaption] = useState(false);
  const [captionText, setCaptionText] = useState('');

  useEffect(() => {
    if (selectedMedia !== null) {
      const validSize = isValidFileSize(toMB(selectedMedia.image.fileSize));
      if (!validSize) {
        Alert.alert(
          '',
          sizeErrorText,
          [{text: buttonOKLabel, onPress: () => null}],
          {
            cancelable: false,
          },
        );
      } else {
        setShowInputCaption(true);
      }
    }
  }, [buttonOKLabel, selectedMedia, sizeErrorText]);

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const loadAlbums = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return false;
    }
    CameraRoll.getAlbums({assetType: 'All'})
      .then((dataAlbums) => {
        const fetchAlbums = [];
        dataAlbums.forEach((album) => {
          const {count, title} = album;
          fetchAlbums.push({label: title, value: title, amount: count});
        });
        let sortedAlums = _.orderBy(fetchAlbums, ['label'], ['asc']);
        const allVideos = [{label: allVideoText, value: VIDEO_TYPE}];
        sortedAlums = allVideos.concat(sortedAlums);
        setAlbums(sortedAlums);
        loadMedias();
      })
      .catch((err) => {
        console.error('Load Alums', err);
      });
  };

  const onChangeAlbum = (selected) => {
    setSelectedAlbum(selected);
    setMedias([]);
    setData([]);
    setSelectedMedia(null);
    setLastCursor(null);
    setInitialLoading(true);
    setLoadingMore(false);
    setNoMore(false);
    loadMedias(true, selected);
  };

  const onEndReached = () => {
    if (!noMore) {
      loadMedias();
    }
  };

  const loadMedias = (isChangedAlbum = false, album = '') => {
    let selected = selectedAlbum;
    if (isChangedAlbum) {
      selected = album;
    }
    if (!loadingMore) {
      setLoadingMore(true);
      const params = {
        first: FIRST_LOAD_MEDIAS,
        assetType: selected === VIDEO_TYPE ? selected : 'All',
        groupTypes: 'All',
        groupName: selected === VIDEO_TYPE ? '' : selected,
        include: ['fileSize'],
      };
      if (lastCursor) {
        params.after = lastCursor;
      }
      CameraRoll.getPhotos(params).then(
        (res) => appendMedias(res, isChangedAlbum),
        (err) => console.error('Load medias', err),
      );
    }
  };

  const appendMedias = (resData, isChangedAlbum) => {
    const assets = resData.edges;
    setInitialLoading(false);
    setLoadingMore(false);
    if (!resData.page_info.has_next_page) {
      setNoMore(true);
    }
    if (assets.length > 0) {
      const newMedias = isChangedAlbum ? assets : medias.concat(assets);
      const newData = nEveryRow(newMedias, ITEM_PER_ROW);
      setLastCursor(resData.page_info.end_cursor);
      setMedias(newMedias);
      setData(newData);
    }
  };

  const onSendAttachment = () => {
    const {type, image} = selectedMedia;
    onClose(false);
    onSend(captionText, image, type);
  };

  const renderMedia = (items) => {
    const mediaItems = items.map((item, index) => {
      if (item === null) {
        return null;
      }
      return (
        <GridItem
          key={index}
          item={item.node}
          itemsPerRow={ITEM_PER_ROW}
          selected={selectedMedia}
          onSelected={setSelectedMedia}
        />
      );
    });
    return <View style={styles.flexRow}>{mediaItems}</View>;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onShow={() => loadAlbums()}
      onRequestClose={() => onClose(false)}>
      <View style={styles.mpHeader}>
        <TouchableOpacity onPress={() => onClose(false)}>
          <Icon
            name="arrowleft"
            type="antdesign"
            size={30}
            color={theme.colors.black}
          />
        </TouchableOpacity>
        <View style={styles.mpMediaAlbum}>
          <Picker
            selectedValue={selectedAlbum}
            onValueChange={(value) => onChangeAlbum(value)}>
            <Picker.Item label={allMediaText} value="" />
            {albums.map((album, index) => {
              return (
                <Picker.Item
                  label={album.label}
                  value={album.value}
                  key={index}
                />
              );
            })}
          </Picker>
        </View>
      </View>
      <View style={styles.mpWrapper}>
        {initialLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : data.length > 0 ? (
          <FlatList
            initialNumToRender={5}
            data={data}
            onEndReached={onEndReached}
            renderItem={({item}) => renderMedia(item)}
            keyExtractor={(item) => item[0].node.image.uri}
          />
        ) : (
          <Text style={styles.textCenter}>{emptyText}</Text>
        )}
      </View>
      {showInputCaption && (
        <View style={styles.mpCaptionContainer}>
          <Input
            autoFocus
            value={captionText}
            onChangeText={(value) => setCaptionText(value)}
            placeholder={captionPlaceholder}
            containerStyle={styles.mpCaptionInput}
            inputContainerStyle={styles.noneBorderBottom}
            rightIcon={
              <Icon
                name="send"
                type="material"
                color={theme.colors.primary}
                size={28}
                onPress={() => onSendAttachment()}
              />
            }
          />
        </View>
      )}
    </Modal>
  );
};

export default withTheme(MediaPicker);
