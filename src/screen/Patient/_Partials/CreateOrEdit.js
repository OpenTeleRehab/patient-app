import React from 'react';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {Text, withTheme} from 'react-native-elements';
import {ScrollView, StatusBar, View} from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import styles from '../../../assets/styles';

const CreateOrEditPatient = ({theme, navigation, patient}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={translate('phc.patient.create')}
        backgroundPrimary={true}
      />
      <ScrollView contentContainerStyle={[styles.mainContainerLight, styles.paddingXMd]}>
        <View>
          <Text>Create Patient</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(CreateOrEditPatient);
