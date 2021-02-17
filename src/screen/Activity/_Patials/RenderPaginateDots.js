import React from 'react';
import {View} from 'react-native';
import styles from '../../../assets/styles';
import {Button, Icon} from 'react-native-elements';

const RenderPaginateDots = (activities, activeIndex, theme) =>
  activities.map((activity, i) => (
    <View style={styles.activityPaginationView} key={i}>
      <View style={styles.activityPaginationIconContainer}>
        {i === activeIndex && (
          <Icon
            name="caret-down"
            color={theme.colors.orangeDark}
            type="font-awesome-5"
          />
        )}
      </View>
      <Button
        type={activity.completed ? 'solid' : 'outline'}
        buttonStyle={styles.activityPaginationButton}
      />
    </View>
  ));

export default RenderPaginateDots;
