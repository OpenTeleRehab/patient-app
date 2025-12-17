import React, {useEffect, useRef, useState} from 'react';
import {Button, Text} from 'react-native';
import {View} from 'react-native';
import {Icon, withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import {ROUTES} from '../../variables/constants';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {FormProvider, useForm} from 'react-hook-form';
import {ScrollView} from 'react-native';
import styles from '../../assets/styles';
import {callAdminApi} from '../../utils/request';
import colors from '../../assets/styles/variables/colors';
import QuestionRendererViewOnly from '../../components/ScreeningQuestionnaire/QuestionRendererViewOnly';

const InterviewDetail = ({navigation, route}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  console.log('params details', route.params);

  const form = useForm();

  const scrollRef = useRef(null);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({y: 0, animated: true});
  };

  const [interviewData, setInterviewData] = useState(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const callToGetQuestion = async () => {
      const res = await callAdminApi('/screening-questionnaire');
      form.reset({
        SECTION_1_Q2: 'Title 1',
        SECTION_1_Q3: ['Title 1', 'Title 4'],
        SECTION_1_Q4: 'Testing ',
        SECTION_1_Q6: '8',
        SECTION_1_Q7: 7,
        SECTION_2_Q2: 'Title 2',
        SECTION_2_Q3: 'Testing text only',
        SECTION_2_Q4: '3',
        SECTION_2_Q5: ['Title 2'],
      });
      setInterviewData(res?.data?.[0]); // assume res.data is array
    };
    console.log('fetch interview');
    callToGetQuestion();
  }, [form]);

  if (!interviewData) return null;

  const currentSection = interviewData.groups[step];

  const goNext = () => {
    if (step < interviewData.groups.length - 1) {
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

  return (
    <>
      <HeaderBar
        backgroundPrimary
        onGoBack={() => {
          navigation.navigate(ROUTES.INTERVIEW_HISTORY_LIST);
        }}
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
            accessibilityLabel={currentSection.sectionName}
            style={[styles.fontWeightMedium, styles.marginTop]}>
            {currentSection.sectionName}
          </Text>
          <View style={[styles.rowGap15, styles.marginTopMd]}>
            {currentSection.questionList?.map((question, index) => (
              <QuestionRendererViewOnly
                key={question.code}
                question={question}
              />
            ))}
          </View>
          <View style={[styles.marginTopLg, styles.interviewItemCard]}>
            <Text>Section {currentSection.sectionName}</Text>
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
              accessibilityLabel={`${step + 1}/${interviewData.groups.length}`}>
              {step + 1}/{interviewData.groups.length}
            </Text>
            <Icon
              raised
              name="angle-right"
              type="font-awesome"
              color={colors.primary}
              disabled={step === interviewData.groups.length - 1}
              onPress={goNext}
            />
          </View>
          {/* Buttons Submit and Cancel*/}
          <View style={[styles.rowGap10, styles.marginTopMd]}>
            <Button
              title={'Cancel'}
              type="outline"
              onPress={() => {
                navigation.navigate(ROUTES.INTERVIEW_HISTORY_LIST);
              }}
            />
          </View>
        </ScrollView>
      </FormProvider>
    </>
  );
};

export default withTheme(InterviewDetail);
