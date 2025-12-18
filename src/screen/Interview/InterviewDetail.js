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
          {/* Show point after interview **TO DO** */}
          {/* <View style={[styles.marginTopLg, styles.interviewItemCard]}>
            <Text>Section {currentSection.title}</Text>
          </View> */}
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
          {/* Buttons Submit and Cancel*/}
          <View style={[styles.rowGap10, styles.marginTopMd]}>
            <Button title={'Cancel'} type="outline" onPress={handleCancel} />
          </View>
        </ScrollView>
      </FormProvider>
    </>
  );
};

export default withTheme(InterviewDetail);
