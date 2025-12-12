import React, {useRef, useState} from 'react';
import {Alert, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native';
import {getTranslate} from 'react-localize-redux';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Icon, withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import QuestionRenderer from '../../components/ScreeningQuestionnaire/QuestionRenderer';
import colors from '../../assets/styles/variables/colors';
import {FormProvider, useForm} from 'react-hook-form';
import {submitScreeningQuestionnaireAnswerRequest} from '../../store/screeningQuestionnaire/actions';

const Interview = ({navigation, route}) => {
  const {patientId} = route.params;
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const screeningQuestionnaire = route.params?.screeningQuestionnaire;
  const [step, setStep] = useState(0);
  const scrollRef = useRef(null);
  const form = useForm();

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({y: 0, animated: true});
  };

  if (!screeningQuestionnaire) return null;

  const currentSection = screeningQuestionnaire?.sections[step];

  const goNext = () => {
    if (step < screeningQuestionnaire.sections.length - 1) {
      setStep(step + 1);
      scrollToTop();
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
      scrollToTop();
    }
  };

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

    try {
      const res = dispatch(
        submitScreeningQuestionnaireAnswerRequest(
          screeningQuestionnaire.id,
          patientId,
          transformedData,
        ),
      );
      console.log('res answer', res);
      navigation.goBack();
    } catch (error) {
      console.log('Error', error);
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
            <Text
              accessibilityLabel={currentSection.title}
              style={[styles.fontWeightMedium, styles.marginTop]}>
              {currentSection.title}
            </Text>
            <View style={[styles.rowGap15, styles.marginTopMd]}>
              {currentSection.questions?.map((question) => (
                <QuestionRenderer
                  key={`question_${question.id}`}
                  question={question}
                />
              ))}
            </View>
            <View
              style={[
                styles.flexRow,
                styles.justifyContentSpaceBetween,
                styles.flexCenter,
                styles.marginTop,
              ]}>
              <Icon
                raised
                name="angle-left"
                type="font-awesome"
                color={colors.primary}
                disabled={step === 0}
                onPress={goBack}
              />
              <Text
                accessibilityLabel={`${step + 1}/${
                  screeningQuestionnaire.sections.length
                }`}>
                {step + 1}/{screeningQuestionnaire.sections.length}
              </Text>
              <Icon
                raised
                name="angle-right"
                type="font-awesome"
                color={colors.primary}
                disabled={step === screeningQuestionnaire.sections.length - 1}
                onPress={form.handleSubmit(goNext)}
              />
            </View>
            {/* Buttons Submit and Cancel*/}
            <View style={[styles.rowGap10, styles.marginTopMd]}>
              {step === screeningQuestionnaire.sections.length - 1 && (
                <Button
                  title={'Submit'}
                  onPress={form.handleSubmit(onSubmit)}
                />
              )}
              <Button
                title={'Cancel'}
                type="outline"
                onPress={alertConfirmBeforeLeave}
              />
            </View>
          </ScrollView>
        </FormProvider>
      )}
    </SafeAreaView>
  );
};

export default withTheme(Interview);
