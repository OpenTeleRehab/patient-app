import React from 'react';
import {ROUTES} from '../../../variables/constants';
import {Card, Icon, Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import {TouchableOpacity, View} from 'react-native';

const RenderEducationMaterialCard = (
  {item, index},
  theme,
  navigation,
  translate,
) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate(ROUTES.MATERIAL_DETAIL, {
          id: item.id,
          activityNumber: index + 1,
        })
      }>
      <Card containerStyle={styles.activityCardContainer}>
        <View
          style={[
            styles.cardWithIconHeader,
            item.completed ? styles.bgDark : styles.bgPrimary,
          ]}>
          <View style={styles.cardWithIconWrapper}>
            <Icon
              name="description"
              color={item.completed ? theme.colors.black : theme.colors.white}
              size={100}
              type="material"
            />
            <Text
              style={[
                styles.cardWithIconHeaderTitle,
                item.completed ? styles.textDark : styles.textWhite,
              ]}
              numberOfLines={1}>
              {translate('activity.material')}
            </Text>
          </View>
          <Text
            style={[
              styles.marginLeft,
              styles.marginY,
              item.completed ? styles.textDark : styles.textWhite,
            ]}>
            {translate(item.file.fileGroupType)}
          </Text>
        </View>
        <View style={styles.activityCardInfoWrapper}>
          <Text
            style={[styles.activityCardTitle, styles.textDefaultBold]}
            numberOfLines={3}>
            {item.title}
          </Text>
        </View>
        {item.completed ? (
          <View style={styles.activityCardFooterContainer}>
            <Icon
              name="done"
              color={theme.colors.white}
              size={25}
              type="material"
            />
            <Text style={styles.activityCardFooterText}>
              {translate('activity.completed')}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.activityCardFooterContainer,
              {backgroundColor: theme.colors.grey5},
            ]}>
            <Text
              style={[
                styles.activityCardFooterText,
                {color: theme.colors.black},
              ]}>
              {translate('activity.to_do')}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

export default RenderEducationMaterialCard;
