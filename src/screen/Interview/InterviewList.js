import React from 'react';
import {ScrollView, View} from 'react-native';
import {withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {Text} from 'react-native';
import InterviewItemCard from '../../components/ScreeningQuestionnaire/InterviewItemCard';
import {ROUTES} from '../../variables/constants';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {getScreeningQuestionnaireListRequest} from '../../store/screeningQuestionnaire/actions';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

const InterviewList = ({navigation, patientId}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const {loading, screeningQuestionnaireList, offlineInterviews} = useSelector(
    (state) => state.screeningQuestionnaire,
  );
  const {patientsForPhcWorker} = useSelector((state) => state.patient);

  const isHaveInterviewHistory = (interview_id) => {
    const patientDetail = patientsForPhcWorker.find(
      (item) => item.id === patientId,
    );

    return patientDetail?.interviewed_questionnaires?.some(
      (item) => item === interview_id,
    );
  };

  const isHaveOfflineData = (interview_id) => {
    return offlineInterviews?.some(
      (item) =>
        item.questionnaire_id === interview_id && item.userId === patientId,
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getScreeningQuestionnaireListRequest());
    }, [dispatch]),
  );

  return (
    <>
      <HeaderBar
        onGoBack={() => {
          navigation.goBack();
        }}
        title={translate('phc.interview_list')}
      />
      <ScrollView contentContainerStyle={styles.mainContainerLightPaddingMd}>
        <Text style={[styles.fontSizeBase, styles.fontWeightBold]}>
          {translate('phc.interview_list')}
        </Text>
        <View style={[styles.marginTopMd, styles.rowGap15]}>
          {screeningQuestionnaireList.map((interview, index) => {
            return (
              <InterviewItemCard
                key={index}
                onClickInterview={() => {
                  navigation.push(ROUTES.INTERVIEW, {
                    screeningQuestionnaireId: interview.id,
                  });
                }}
                onClickViewInterviewHistory={() => {
                  navigation.push(ROUTES.INTERVIEW_HISTORY_LIST, {
                    screeningQuestionnaire: interview,
                  });
                }}
                interview={interview}
                isDisable={
                  isHaveOfflineData(interview.id)
                    ? false
                    : !isHaveInterviewHistory(interview.id)
                }
              />
            );
          })}
        </View>
        <Spinner
          visible={loading && screeningQuestionnaireList.length === 0}
          overlayColor="rgba(0, 0, 0, 0.5)"
          textStyle={styles.textLight}
        />
      </ScrollView>
    </>
  );
};

export default withTheme(InterviewList);
