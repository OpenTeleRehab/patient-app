import React from 'react';
import {ROUTES} from '../../../variables/constants';
import {Card, Icon, Text} from 'react-native-elements';
import styles from '../../../assets/styles';
import {TouchableOpacity, View} from 'react-native';

const RenderEducationalMaterialCard = (
  {item, index},
  theme,
  navigation,
  translate,
) => {
  return (
    <TouchableOpacity
      key={index}
      onPress={() => navigation.navigate(ROUTES.MATERIAL_DETAIL)}>
      <Card containerStyle={styles.activityCardContainer}>
        <View
          style={[
            styles.educationalMaterialCardHeader,
            item.completed ? styles.bgDark : {},
          ]}>
          <Icon
            name="description"
            color={item.completed ? theme.colors.black : theme.colors.white}
            size={100}
            type="material"
          />
          <Text
            style={[
              styles.educationalMaterialCardHeaderTitle,
              item.completed ? styles.textDark : {},
            ]}
            numberOfLines={1}>
            MATERIAL
          </Text>
        </View>
        <Text
          style={[styles.activityCardTitle, styles.textDefaultBold]}
          numberOfLines={3}>
          {item.title}
        </Text>
        <Card.Divider style={styles.activityCardDivider} />
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

export default RenderEducationalMaterialCard;
