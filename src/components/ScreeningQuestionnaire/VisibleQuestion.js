import {View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Text} from 'react-native';
import QuestionRenderer, {
  evaluateLogic,
  getQuestionName,
} from './QuestionRenderer';
import {Button, Icon} from 'react-native-elements';
import styles from '../../assets/styles';
import colors from '../../assets/styles/variables/colors';
import {useFormContext} from 'react-hook-form';

const VisibleQuestion = ({
  mergedQuestions,
  scrollToTop,
  onSubmitAnswer,
  onCancelAlert,
  isLoading,
  form,
}) => {
  const [step, setStep] = useState(0);
  const visibleQuestions = useVisibleQuestions(mergedQuestions);
  const CurrentQuestion = visibleQuestions[step];
  const goNext = () => {
    if (step < visibleQuestions.length - 1) {
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
    <View>
      {CurrentQuestion && (
        <Text
          accessibilityLabel={CurrentQuestion.section_title}
          style={[styles.fontWeightMedium, styles.marginTop]}>
          {CurrentQuestion.section_title}
        </Text>
      )}
      {CurrentQuestion && (
        <QuestionRenderer
          key={`question_${CurrentQuestion.id}`}
          question={CurrentQuestion}
        />
      )}
      {CurrentQuestion && visibleQuestions.length > 1 && (
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
          <Text accessibilityLabel={`${step + 1}/${visibleQuestions.length}`}>
            {step + 1}/{visibleQuestions.length}
          </Text>
          <Icon
            raised
            name="angle-right"
            type="font-awesome"
            color={colors.primary}
            disabled={step === visibleQuestions.length - 1}
            onPress={form.handleSubmit(goNext)}
          />
        </View>
      )}

      {/* Buttons Submit and Cancel*/}
      <View style={[styles.rowGap10, styles.marginTopMd]}>
        {step === visibleQuestions.length - 1 && (
          <Button
            disabled={isLoading}
            title={'Submit'}
            onPress={onSubmitAnswer}
          />
        )}
        <Button
          disabled={isLoading}
          title={'Cancel'}
          type="outline"
          onPress={onCancelAlert}
        />
      </View>
    </View>
  );
};

export default VisibleQuestion;

const useVisibleQuestions = (questions) => {
  const {control, unregister} = useFormContext();

  const [visibleQuestions, invisibleQuestions] = useMemo(() => {
    if (!questions?.length) return [];
    const _invisibleQuestions = [];
    const _visibleQuestion = [];
    questions.forEach((question, idx) => {
      if (!question.logics?.length) {
        _visibleQuestion.push(question);
      } else {
        // get field values for this question's logics
        const values = question.logics.map((logic) => {
          const name = getQuestionName(logic.target_question_id);
          return control._formValues?.[name]; // fallback for initial render
        });

        const shouldSkip = question.logics.every(
          (logic, i) => !evaluateLogic(logic, values[i]),
        );

        if (shouldSkip) {
          _invisibleQuestions.push(question);
        } else {
          _visibleQuestion.push(question);
        }
      }
    });
    return [_visibleQuestion, _invisibleQuestions];
  }, [questions, control._formValues]);

  const invisibleFieldNames = useMemo(() => {
    return invisibleQuestions
      ?.map((q) => getQuestionName(q.id))
      .sort()
      .join(',');
  }, [invisibleQuestions]);

  useEffect(() => {
    if (invisibleFieldNames) {
      const fieldNames = invisibleFieldNames.split(',');
      if (fieldNames.length) {
        unregister(fieldNames);
      }
    }
  }, [invisibleFieldNames, unregister]);

  return visibleQuestions;
};
