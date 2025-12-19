import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {Text} from 'react-native';
import InterviewHistoryItemCard from '../../components/ScreeningQuestionnaire/InterviewHistoryItemCard';
import {ROUTES} from '../../variables/constants';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {getScreeningQuestionnaireHistoryListRequest} from '../../store/screeningQuestionnaire/actions';

const InterviewHistoryList = ({navigation, route}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const {screeningQuestionnaireHistoryList, loading} = useSelector(
    (state) => state.screeningQuestionnaire,
  );
  const {patientId, screeningQuestionnaire} = route.params;

  useEffect(() => {
    dispatch(
      getScreeningQuestionnaireHistoryListRequest(
        patientId,
        screeningQuestionnaire?.id,
      ),
    );
  }, [dispatch, patientId, screeningQuestionnaire]);

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
        {loading ? (
          <></>
        ) : (
          <View style={styles.marginTopMd}>
            {screeningQuestionnaireHistoryList.map((item, index) => {
              return (
                <InterviewHistoryItemCard
                  index={index}
                  key={index}
                  data={{
                    ...item,
                    title: screeningQuestionnaire?.title,
                  }}
                  OnViewDetail={() =>
                    navigation.push(ROUTES.INTERVIEW_DETAIL, {
                      screeningQuestionnaire,
                      answers: JSON.parse(item.answers),
                      from: 'history-list',
                    })
                  }
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default withTheme(InterviewHistoryList);
