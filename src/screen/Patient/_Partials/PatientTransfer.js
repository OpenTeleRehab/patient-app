import {ScrollView, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import styles from '../../../assets/styles';

const PatientTransfer = ({navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  return (
    <>
      <HeaderBar
        onGoBack={() => navigation.goBack()}
        title={translate('phc.patient.transfer')}
        backgroundPrimary={true}
      />
      <ScrollView contentContainerStyle={styles.mainContainerLightPaddingMd}>
        <View style={styles.rowGap10}>
          <Text>Patient Transfer Screen</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default PatientTransfer;
