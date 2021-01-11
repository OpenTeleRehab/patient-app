/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React from 'react';
import {Text, Header, withTheme, Button} from 'react-native-elements';
import {ScrollView, View} from 'react-native';
import styles from '../../../assets/styles';

// todo: get content from BE api
const termContent =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dapibus vitae odio quis finibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean rhoncus ut arcu eget tincidunt. Phasellus feugiat condimentum rhoncus. Aliquam dictum mattis massa quis vulputate. Proin consequat ex eu fermentum egestas. Vestibulum consectetur, nunc sed bibendum tempus, sem neque ultricies magna, ut lobortis leo sapien id lorem. Morbi rhoncus maximus nisi, pulvinar varius ante rhoncus et. Maecenas vitae nibh nec lorem auctor tristique nec vitae mauris. Mauris mattis metus ac odio sollicitudin, at sodales quam bibendum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.\n' +
  '\n' +
  'Suspendisse mattis, tellus sed interdum mollis, enim enim laoreet magna, ut dapibus ex eros non lectus. Aliquam lobortis sodales odio nec tincidunt. Maecenas eu ultricies leo, a dignissim lacus. Donec quis rutrum libero. Pellentesque pretium hendrerit varius. Ut in dui in mauris hendrerit tincidunt in bibendum felis. Nullam mattis sapien vehicula posuere interdum. Donec aliquam arcu non libero laoreet elementum.\n' +
  '\n' +
  'Etiam vehicula feugiat accumsan. Phasellus finibus dolor metus, in porttitor dolor viverra id. Praesent condimentum dolor eget nunc pharetra tempus. Integer tincidunt in diam non iaculis. Aenean sed imperdiet diam, et interdum mauris. Cras vel tempus lectus, a consequat nibh. Donec consequat bibendum purus id dignissim. Phasellus in turpis sit amet libero efficitur suscipit. Nam vitae enim nec elit cursus elementum quis porta tortor. Donec ut quam leo. Aenean nec massa nibh. Morbi vestibulum eleifend metus, vel rhoncus lectus ultricies non.\n' +
  '\n' +
  'Integer pulvinar fringilla enim, a vehicula mauris semper sit amet. Nam eros lacus, euismod in libero in, rutrum convallis eros. Vivamus vel facilisis enim. Morbi quis elementum risus, ac vestibulum turpis. Proin lacus lorem, vestibulum at nunc at, tempus efficitur lorem. Vestibulum non urna placerat, vestibulum orci ac, tempor urna. Suspendisse potenti. Duis sem dolor, finibus nec nibh vel, commodo posuere orci. Curabitur pretium magna sapien, non aliquet libero congue eget. In sagittis rhoncus mi, lobortis suscipit nibh finibus at.';

const TermOfServiceDetail = ({theme, navigation}) => {
  return (
    <>
      <Header
        leftComponent={
          <Button
            icon={{
              name: 'chevron-left',
              size: 25,
              color: theme.colors.white,
            }}
            title="Back"
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{
          text: 'Terms of Services Detail',
          style: {color: theme.colors.white},
        }}
      />
      <ScrollView style={styles.mainContainerLight}>
        <View style={styles.flexCenter}>
          <Text>{termContent}</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(TermOfServiceDetail);
