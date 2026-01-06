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
import {calculateScoreBySection, mapingScore} from './InterviewDetail';

const InterviewHistoryList = ({navigation, route}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const {screeningQuestionnaireHistoryByUser, offlineInterviews, loading} =
    useSelector((state) => state.screeningQuestionnaire);
  const {patientId, screeningQuestionnaire} = route.params;
  const key = `${patientId}_${screeningQuestionnaire.id}`;

  const screeningQuestionnaireHistoryList =
    screeningQuestionnaireHistoryByUser?.[key] || [];

  const filteredOfflineInterviews = offlineInterviews
    .filter(
      (item) =>
        item.userId === patientId &&
        item.questionnaire_id === screeningQuestionnaire.id,
    )
    .map((item) => ({
      ...item,
      isOffline: true,
    }));

  const mergedScreeningQuestionnaireHistoryList = [
    ...screeningQuestionnaireHistoryList,
    ...filteredOfflineInterviews,
  ];

  useEffect(() => {
    if (!patientId || !screeningQuestionnaire?.id) return;

    dispatch(
      getScreeningQuestionnaireHistoryListRequest(
        patientId,
        screeningQuestionnaire.id,
      ),
    );
  }, [dispatch, patientId, screeningQuestionnaire?.id]);

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
            {mergedScreeningQuestionnaireHistoryList?.map((item, index) => {
              const totalScore = calculateScoreBySection(
                screeningQuestionnaire.sections[0],
                item?.isOffline ? item?.answers : JSON.parse(item.answers),
              );
              return (
                <InterviewHistoryItemCard
                  index={index}
                  key={index}
                  data={{
                    ...item,
                    title: screeningQuestionnaire?.title,
                  }}
                  actionStatus={mapingScore(
                    totalScore,
                    screeningQuestionnaire.sections[0].actions,
                  )}
                  OnViewDetail={() =>
                    navigation.push(ROUTES.INTERVIEW_DETAIL, {
                      screeningQuestionnaire,
                      answers: item?.isOffline
                        ? item?.answers
                        : JSON.parse(item?.answers),
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
