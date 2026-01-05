import React, {useRef, useState} from 'react';
import {Alert, ScrollView, Text} from 'react-native';
import {SafeAreaView} from 'react-native';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {FormProvider, useForm} from 'react-hook-form';
import {
  submitScreeningQuestionnaireAnswerOffline,
  submitScreeningQuestionnaireAnswerRequest,
} from '../../store/screeningQuestionnaire/actions';
import {ROUTES} from '../../variables/constants';
import VisibleQuestion from '../../components/ScreeningQuestionnaire/VisibleQuestion';
import {useNetInfo} from '@react-native-community/netinfo';
import Spinner from 'react-native-loading-spinner-overlay';

const Interview = ({navigation, route}) => {
  const {patientId} = route.params;
  const netInfo = useNetInfo();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const screeningQuestionnaire = route.params?.screeningQuestionnaire;
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const form = useForm();
  const mergedQuestions = screeningQuestionnaire.sections.flatMap((section) =>
    section.questions.map((question) => ({
      ...question,
      section_id: section.id,
      section_title: section.title,
    })),
  );

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({y: 0, animated: true});
  };

  if (!screeningQuestionnaire) return null;

  const alertConfirmBeforeLeave = () => {
    Alert.alert(
      translate('phc.screening_questionnaire.leave_alert_title'),
      translate('phc.screening_questionnaire.leave_alert_confirm_description'),
      [
        {
          text: translate('common.cancel'),
          onPress: () => {},
        },
        {
          text: translate('common.ok'),
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const onSubmit = async (submitData) => {
    const transformedData = Object.entries(submitData).map(([key, value]) => ({
      question_id: Number(key.replace('question_', '')),
      answer: value,
    }));
    setIsLoading(true);

    try {
      if (netInfo.isConnected) {
        const res = await dispatch(
          submitScreeningQuestionnaireAnswerRequest(
            screeningQuestionnaire.id,
            patientId,
            transformedData,
          ),
        );
        navigation.replace(ROUTES.INTERVIEW_DETAIL, {
          screeningQuestionnaire,
          answers: JSON.parse(res.data.answers),
          from: 'create-form',
        });
      } else {
        await dispatch(
          submitScreeningQuestionnaireAnswerOffline({
            questionnaire_id: screeningQuestionnaire.id,
            userId: patientId,
            answers: transformedData,
          }),
        );
        navigation.replace(ROUTES.INTERVIEW_DETAIL, {
          screeningQuestionnaire,
          answers: transformedData,
          from: 'create-form-offline',
        });
      }
    } catch (error) {
      console.log('Submit Questionnaire Error', error);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex1}>
      <HeaderBar
        backgroundPrimary
        onGoBack={() => {
          screeningQuestionnaire
            ? alertConfirmBeforeLeave()
            : navigation.goBack();
        }}
        title={translate('phc.interview')}
      />
      {screeningQuestionnaire && (
        <FormProvider {...form}>
          <ScrollView
            contentContainerStyle={[
              styles.paddingMd,
              styles.mainContainerLight,
            ]}
            ref={scrollRef}>
            <Text
              accessibilityLabel={screeningQuestionnaire?.title}
              style={[
                styles.textCenter,
                styles.fontWeightBold,
                styles.fontSizeBase,
              ]}>
              {screeningQuestionnaire && screeningQuestionnaire?.title}
            </Text>
            <VisibleQuestion
              mergedQuestions={mergedQuestions}
              scrollToTop={scrollToTop}
              onSubmitAnswer={form.handleSubmit(onSubmit)}
              onCancelAlert={alertConfirmBeforeLeave}
              isLoading={isLoading}
              form={form}
            />
          </ScrollView>
        </FormProvider>
      )}
      <Spinner
        visible={isLoading}
        overlayColor="rgba(0, 0, 0, 0.5)"
        textStyle={styles.textLight}
      />
    </SafeAreaView>
  );
};

export default withTheme(Interview);
