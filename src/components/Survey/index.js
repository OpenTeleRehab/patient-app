import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, CheckBox, Input, Divider, withTheme, Text} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {getPublishSurvey, submitSurvey, skipSurvey} from '../../store/survey/actions';
import {getTreatmentPlanRequest} from '../../store/activity/actions';
import {getTranslate} from 'react-localize-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonOverlay from '../Common/Overlay';
import styles from '../../assets/styles';
import moment from 'moment';
import _ from 'lodash';

const Survey = ({theme}) => {
  const dispatch = useDispatch();
  const languages = useSelector(state => state.language.languages);
  const localize = useSelector(state => state.localize);
  const translate = getTranslate(localize);
  const {accessToken, profile} = useSelector((state) => state.user);
  const {publishSurvey} = useSelector(state => state.survey);
  const {treatmentPlan} = useSelector((state) => state.activity);
  const {organization} = useSelector((state) => state.phone);
  const [showSurvey, setShowSurvey] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [surveyPhase, setSurveyPhase] = useState('');
  const [canSkip, setCanSkip] = useState(false);
  const isOnline = useNetInfo().isConnected;

  const checkShowSurvey = useCallback(async () => {
    try {
      const lastSurveyShownDate = await AsyncStorage.getItem('lastSurveyShownDate');
      const currentDate = moment.utc();

      if ((publishSurvey.include_at_the_start || publishSurvey.include_at_the_end) && !treatmentPlan.id) {
        return false;
      }

      if ((publishSurvey.include_at_the_start || publishSurvey.include_at_the_end)) {
        const treatmentStartDate = moment.utc(treatmentPlan.start_date, 'DD/MM/YYYY', true);
        const treatmentEndDate = moment.utc(treatmentPlan.end_date, 'DD/MM/YYYY', true);

        if (!treatmentStartDate.isValid() || !treatmentEndDate.isValid()) {
          return false;
        }

        const waitForShowAtStart = publishSurvey.include_at_the_start && currentDate.isBefore(treatmentStartDate);
        const waitForShowAtEnd = publishSurvey.include_at_the_end && currentDate.isBefore(treatmentEndDate);
        if (waitForShowAtStart && waitForShowAtEnd) {
          return false;
        }
      }

      // Handle frequency logic only if `lastSurveyShownDate` exists
      if (lastSurveyShownDate) {
        const frequencyInMs = publishSurvey.frequency * 24 * 60 * 60 * 1000;
        const lastShownDate = moment.utc(lastSurveyShownDate);
        if (!lastShownDate.isValid()) {
          return false;
        }

        const elapsedTime = currentDate.diff(lastShownDate);
        if (elapsedTime < frequencyInMs) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking survey date:', error);
      return false;
    }
  }, [publishSurvey, treatmentPlan]);

  useEffect(() => {
    if (isOnline) {
      dispatch(getTreatmentPlanRequest());
    }
  }, [dispatch, isOnline]);

  useEffect(() => {
    if (isOnline) {
      dispatch(getPublishSurvey({
        organization: organization,
        type: 'patient',
        user_id: profile.id,
        country_id: profile.country_id,
        clinic_id: profile.clinic_id,
        lang: profile.language_id ? profile.language_id : languages.length ? languages[0].id : '',
        location: profile.location,
        treatment_plan_id: treatmentPlan.id,
        survey_phase: surveyPhase,
      }));
    }
  }, [profile, dispatch, isOnline, organization, languages, treatmentPlan, surveyPhase]);

  useEffect(() => {
    if (!publishSurvey?.questionnaire) {return;}
    (async () => {
      if (await checkShowSurvey()) {
        const foundMandatoryQuestion = publishSurvey.questionnaire.questions.find(question => question.mandatory);
        setCanSkip(!!foundMandatoryQuestion);
        setShowSurvey(true);
        await AsyncStorage.setItem('lastSurveyShownDate', new Date().toISOString());
      }
    })();
  }, [checkShowSurvey, publishSurvey]);

  useEffect(() => {
    if (treatmentPlan.id) {
      const currentDate = moment.utc();
      const treatmentEndDate = moment.utc(treatmentPlan.end_date, 'DD/MM/YYYY', true);
      if (currentDate.isBefore(treatmentEndDate, 'day')) {
        setSurveyPhase('start');
      } else {
        setSurveyPhase('end');
      }
    }
  }, [treatmentPlan]);

  useEffect(() => {
    if (publishSurvey && publishSurvey.questionnaire && publishSurvey.questionnaire.questions) {
      setCurrentQuestion(publishSurvey.questionnaire.questions[currentIndex]);
    }
  }, [publishSurvey, currentIndex]);

  const handleInputChange = (questionId, value, type) => {
    if (type === 'checkbox') {
      setAnswers((prev) => {
        const selectedValues = prev[questionId] || [];
        return {
          ...prev,
          [questionId]: selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value],
        };
      });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }

    if (validationErrors[questionId]) {
      setValidationErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[questionId];
        return updatedErrors;
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    // Validate mandatory question before moving to next question
    if (currentQuestion.mandatory && (!answers[currentQuestion.id] || (_.isArray(answers[currentQuestion.id]) && !answers[currentQuestion.id].length))) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [currentQuestion.id]: translate('survey.answer.required'),
      }));
      return;
    }

    if (currentQuestion.type === 'open-number') {
      const threshold = currentQuestion.answers[0].threshold;
      const minValue = 0;
      if (!_.isEmpty(answers[currentQuestion.id]) && (answers[currentQuestion.id] > threshold || answers[currentQuestion.id] < minValue)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [currentQuestion.id]: translate('survey.number.validation', { minValue: minValue, maxValue: threshold }),
        }));
        return;
      }
    }

    // If there are no errors, proceed to the next question
    if (currentIndex < (publishSurvey.questionnaire.questions.length - 1)) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    // Validate all mandatory questions before submitting
    publishSurvey.questionnaire.questions.forEach((question) => {
      if (question.mandatory && (!answers[question.id] || (_.isArray(answers[question.id]) && !answers[question.id].length))) {
        newErrors[question.id] = translate('survey.answer.required');
      }
      if (question.type === 'open-number') {
        const threshold = currentQuestion.answers[0].threshold;
        const minValue = 0;
        if (answers[question.id] && (answers[question.id] > threshold || answers[question.id] < minValue)) {
          newErrors[question.id] = translate('survey.number.validation', {
            minValue: minValue,
            maxValue: threshold,
          });
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: parseInt(questionId, 10),
      answer,
    }));

    const payload = {
      survey_id: publishSurvey.id,
      answers: JSON.stringify(formattedAnswers),
      user_id: profile.id,
      treatment_plan_id: treatmentPlan.id,
      survey_phase: surveyPhase,
    };

    dispatch(submitSurvey(payload, accessToken)).then(result => {
      if (result) {
        setShowSurvey(false);
      }
    });
  };

  const handleSkipSurvey = () => {
    const payload = {
      survey_id: publishSurvey.id,
      user_id: profile.id,
    };
    dispatch(skipSurvey(payload, accessToken)).then(result => {
      if (result) {
        setShowSurvey(false);
      }
    });
  };

  return (
    publishSurvey?.questionnaire && (
    <CommonOverlay
      visible={showSurvey}
    >
      <View>
        <Text style={[styles.fontSizeLg, styles.fontWeightBold]}>
          {publishSurvey.questionnaire?.title}
        </Text>
        <Text style={styles.marginTop}>
          {publishSurvey.questionnaire && publishSurvey.questionnaire.description}
        </Text>
        <Divider style={[styles.marginBottomMd, styles.marginTop]} />
        {currentQuestion && (
          <>
            <Text style={styles.fontWeightBold}>
              {currentQuestion.title} {!!currentQuestion.mandatory && <Text>*</Text>}
            </Text>

            {currentQuestion.type === 'checkbox' &&
              currentQuestion.answers.map((answer, index) => (
                <CheckBox
                  key={index}
                  title={answer.description}
                  checked={(answers[currentQuestion.id] || []).includes(answer.id)}
                  onPress={() => handleInputChange(currentQuestion.id, answer.id, 'checkbox')}
                />
              ))}

            {currentQuestion.type === 'multiple' &&
              currentQuestion.answers.map((answer, index) => (
                <CheckBox
                  key={index}
                  title={answer.description}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={answers[currentQuestion.id] === answer.id}
                  onPress={() => handleInputChange(currentQuestion.id, answer.id, 'radio')}
                />
              ))}

            {currentQuestion.type === 'open-text' && (
              <Input
                value={answers[currentQuestion.id] || ''}
                onChangeText={(text) => handleInputChange(currentQuestion.id, text, 'text')}
                containerStyle={styles.inputContainer}
              />
            )}

            {currentQuestion.type === 'open-number' && (
              <Input
                value={answers[currentQuestion.id] || ''}
                onChangeText={(text) => handleInputChange(currentQuestion.id, text, 'number')}
                keyboardType="numeric"
                containerStyle={styles.inputContainer}
              />
            )}
          </>
        )}

        {validationErrors[currentQuestion && currentQuestion.id] && (
          <Text style={{color: theme.colors.danger}}>{validationErrors[currentQuestion && currentQuestion.id]}</Text>
        )}
        <Divider style={[styles.marginTopMd]} />
        <View style={[styles.flexRow, styles.justifyContentSpaceBetween]}>
          <View style={[componentStyles.buttonContainer, styles.marginTop]}>
          {currentIndex > 0 && (
            <Button title={translate('common.previous')} onPress={handlePrevious} buttonStyle={componentStyles.button} containerStyle={[styles.marginRightSm]}/>
          )}
          {currentIndex < publishSurvey?.questionnaire?.questions.length - 1 && (
            <Button title={translate('common.next')} onPress={handleNext} buttonStyle={componentStyles.button}/>
          )}
          </View>
          <View style={[componentStyles.buttonContainer, styles.marginTop]}>
            {currentIndex === publishSurvey?.questionnaire?.questions.length - 1 && (
              <Button title={translate('common.submit')} onPress={handleSubmit} buttonStyle={componentStyles.button} containerStyle={[styles.marginRightSm]}/>
            )}
            {!canSkip && (
              <Button title={translate('common.skip')} onPress={handleSkipSurvey} buttonStyle={componentStyles.button}/>
            )}
          </View>
        </View>
      </View>
    </CommonOverlay>
    )
  );
};

const componentStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputContainer: {
    height: 50,
  },
});

export default withTheme(Survey);
