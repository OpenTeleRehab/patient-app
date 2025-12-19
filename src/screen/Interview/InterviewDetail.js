import React, {useRef, useState} from 'react';
import {Text} from 'react-native';
import {View} from 'react-native';
import {Button, Icon, withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {FormProvider, useForm} from 'react-hook-form';
import {ScrollView} from 'react-native';
import styles from '../../assets/styles';
import colors from '../../assets/styles/variables/colors';
import QuestionRenderer from '../../components/ScreeningQuestionnaire/QuestionRenderer';

const calculateScoreBySection = (section, answers) => {
  let totalScore = 0;

  section.questions.forEach((question) => {
    const answerObj = answers.find(
      (answer) => answer.question_id === question.id,
    );

    if (!answerObj) return;

    const {answer} = answerObj;

    switch (question.question_type) {
      case 'radio':
      case 'checkbox': {
        const selectedOptionIds = Array.isArray(answer) ? answer : [];

        selectedOptionIds.forEach((optionId) => {
          const option = question.options.find((opt) => opt.id === optionId);

          if (option && option.option_point) {
            totalScore += option.option_point;
          }
        });
        break;
      }

      case 'open-number': {
        const optionPoint = question.options?.[0]?.option_point;
        if (optionPoint) {
          totalScore += Number(optionPoint);
        }
        break;
      }

      case 'rating': {
        if (typeof answer === 'number') {
          totalScore += answer;
        }
        break;
      }
      // Note, Open Text => No Score
      default:
        break;
    }
  });

  return totalScore;
};

const InterviewDetail = ({navigation, route}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {answers, screeningQuestionnaire} = route.params;

  const transformAnswer = (answer) => {
    let values = {};
    for (const item of answer) {
      values[`question_${item.question_id}`] = item.answer;
    }
    return values;
  };

  const form = useForm({
    defaultValues: transformAnswer(answers),
  });

  const scrollRef = useRef(null);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({y: 0, animated: true});
  };

  const [step, setStep] = useState(0);

  const interviewData = screeningQuestionnaire;
  const currentSection = interviewData.sections[step];

  const goNext = () => {
    if (step < interviewData.sections.length - 1) {
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

  const handleCancel = () => {
    navigation.goBack();
  };

  const totalScore = calculateScoreBySection(currentSection, answers);

  return (
    <>
      <HeaderBar
        backgroundPrimary
        onGoBack={handleCancel}
        title={translate('phc.interview_detail')}
      />
      <FormProvider {...form}>
        <ScrollView
          contentContainerStyle={[styles.paddingMd, styles.mainContainerLight]}
          ref={scrollRef}>
          <Text
            accessibilityLabel={interviewData?.title}
            style={[
              styles.textCenter,
              styles.fontWeightBold,
              styles.fontSizeBase,
            ]}>
            {interviewData && interviewData?.title}
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
                disabled
                question={question}
              />
            ))}
          </View>
          {/* Show Summary and Point Section */}
          <View style={[styles.marginTopLg, styles.rowGap10]}>
            <Text style={[styles.textCenter, styles.fontWeightBold]}>
              Summary Information
            </Text>
            <View style={[styles.totalScoreCard, styles.rowGap5]}>
              <Text>{currentSection.title}</Text>
              <Text>Total Score {totalScore}</Text>
            </View>
            <View>
              <View style={[styles.chipDiagnosis, styles.paddingYMd]}>
                <Text style={styles.textLight}>
                  Diagnosing brain health involves a multi-faceted approach
                  using neurological exams, cognitive tests, brain imaging (MRI,
                  CT, PET),
                </Text>
              </View>
            </View>
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
                interviewData.sections.length
              }`}>
              {step + 1}/{interviewData.sections.length}
            </Text>
            <Icon
              raised
              name="angle-right"
              type="font-awesome"
              color={colors.primary}
              disabled={step === interviewData.sections.length - 1}
              onPress={goNext}
            />
          </View>
          <View style={[styles.rowGap10, styles.marginTopMd]}>
            <Button title={'Cancel'} type="outline" onPress={handleCancel} />
          </View>
        </ScrollView>
      </FormProvider>
    </>
  );
};

export default withTheme(InterviewDetail);
