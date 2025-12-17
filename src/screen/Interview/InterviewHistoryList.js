import React from 'react';
import {ScrollView, View} from 'react-native';
import {withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {Text} from 'react-native';
import InterviewHistoryItemCard from '../../components/ScreeningQuestionnaire/InterviewHistoryItemCard';
import {ROUTES} from '../../variables/constants';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';

const InterviewHistoryList = ({navigation}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  return (
    <>
      <HeaderBar
        backgroundPrimary
        onGoBack={() => {
          navigation.goBack();
        }}
        title={translate('phc.interview_history_list')}
      />
      <ScrollView contentContainerStyle={styles.mainContainerLightPaddingYMd}>
        <Text
          style={[
            styles.fontSizeBase,
            styles.fontWeightBold,
            styles.paddingXMd,
          ]}>
          {translate('phc.interview_history_list')}
        </Text>
        <View style={styles.marginTopMd}>
          {[1, 2, 3, 4, 5].map((item, index) => {
            return (
              <InterviewHistoryItemCard
                index={index}
                key={index}
                OnViewDetail={() =>
                  navigation.navigate(ROUTES.INTERVIEW_DETAIL)
                }
              />
            );
          })}
        </View>
      </ScrollView>
    </>
  );
};

export default withTheme(InterviewHistoryList);
