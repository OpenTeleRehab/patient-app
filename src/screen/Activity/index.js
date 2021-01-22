/*
 * Copyright (c) 2022 Web Essentials Co., Ltd
 */
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Card, Text} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../variables/constants';

const Activity = ({navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const {activities} = useSelector((state) => state.activity);

  return (
    <>
      <HeaderBar
        leftContent={{label: translate('tab.activities')}}
        rightContent={{
          icon: 'arrow-collapse-down',
          iconType: 'material-community',
          label: translate('common.download'),
          onPress: () => null,
        }}
      />
      <ScrollView style={styles.mainContainerPrimary}>
        <View style={styles.flexCenter}>
          <Text h4 style={styles.textLight}>
            Activity Screen
          </Text>
        </View>

        {activities.map((activity) => (
          <Card key={activity.id}>
            <Card.Title>{activity.title}</Card.Title>
            <Card.Divider />
            <Button
              title="Detail"
              onPress={() =>
                navigation.navigate(ROUTES.ACTIVITY_DETAIL, {id: activity.id})
              }
            />
          </Card>
        ))}
      </ScrollView>
    </>
  );
};

export default Activity;
