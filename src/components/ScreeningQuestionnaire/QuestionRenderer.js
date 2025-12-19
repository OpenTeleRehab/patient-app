import React, {useEffect, useMemo} from 'react';
import {Text, View} from 'react-native';
import {CheckBox, Image, Input, Slider, withTheme} from 'react-native-elements';
import styles from '../../assets/styles';
import {useController, useFormContext, useWatch} from 'react-hook-form';
import HelperText from './HelperText';
import QuestionText from './QuestionText';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import settings from '../../../config/settings';

const getImageUrl = (file) => {
  if (!file?.id) return null;
  return `${settings.adminApiBaseURL}/file/${file.id}`;
};

// NOTE
const NoteRender = ({question}) => {
  return (
    <View style={styles.rowGap10}>
      {question?.file && (
        <Image
          source={{
            uri: getImageUrl(question.file),
          }}
          style={[styles.width100, styles.height150]}
          resizeMode="contain"
        />
      )}
      <QuestionText questionText={question.question_text} />
      <Text accessibilityLabel={question.options[0].option_text}>
        {question.options[0].option_text}
      </Text>
    </View>
  );
};

// RADIO
const RadioRender = ({question, disabled, translate}) => {
  const {
    field,
    fieldState: {error},
  } = useController({
    name: getQuestionName(question.id),
    defaultValue: [],
    rules: {
      required: question.mandatory && translate('error.message.required'),
    },
  });
  return (
    <View style={styles.rowGap10}>
      <QuestionText error={error} questionText={question.question_text} />
      <View
        style={[
          styles.flexRow,
          styles.columnGap10,
          styles.rowGap10,
          styles.flexWrap,
        ]}>
        {question.options.map((opt, index) => {
          return (
            <View style={styles.questionOption} key={index}>
              <View>
                <CheckBox
                  disabled={disabled}
                  title={opt.option_text}
                  checked={field.value.includes(opt.id)}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  onPress={() => field.onChange([opt.id])}
                  textStyle={[styles.marginLeftSm, styles.fontWeightMedium]}
                />
              </View>
              {opt?.file && (
                <View>
                  <Image
                    source={{
                      uri: getImageUrl(opt.file),
                    }}
                    style={[styles.width100, styles.height110]}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
      {error && <HelperText message={error.message} />}
    </View>
  );
};

// CHECKBOX
const CheckBoxRender = ({question, disabled, translate}) => {
  const {
    field,
    fieldState: {error},
  } = useController({
    name: getQuestionName(question.id),
    defaultValue: [],
    rules: {
      required: question.mandatory && translate('error.message.required'),
    },
  });
  return (
    <View style={styles.rowGap10}>
      <QuestionText error={error} questionText={question.question_text} />
      <View
        style={[
          styles.flexRow,
          styles.columnGap10,
          styles.rowGap10,
          styles.flexWrap,
        ]}>
        {question.options.map((opt, index) => {
          const isChecked = field.value?.includes(opt.id);
          return (
            <View style={styles.questionOption} key={index}>
              <View>
                <CheckBox
                  disabled={disabled}
                  title={opt.option_text}
                  checked={isChecked}
                  onPress={() => {
                    const current = field.value || [];
                    if (current.includes(opt.id)) {
                      field.onChange(current.filter((x) => x !== opt.id));
                    } else {
                      field.onChange([...current, opt.id]);
                    }
                  }}
                  textStyle={[styles.marginLeftSm, styles.fontWeightMedium]}
                />
              </View>
              {opt?.file && (
                <View>
                  <Image
                    source={{
                      uri: getImageUrl(opt.file),
                    }}
                    style={[styles.width100, styles.height110]}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
      {error && <HelperText message={error.message} />}
    </View>
  );
};

// INPUT TEXT
const InputTextRender = ({question, disabled, translate}) => {
  const {
    field,
    fieldState: {error},
  } = useController({
    name: getQuestionName(question.id),
    defaultValue: '',
    rules: {
      required: question.mandatory && translate('error.message.required'),
    },
  });

  return (
    <View style={styles.rowGap10}>
      <QuestionText error={error} questionText={question.question_text} />
      <View>
        <Input
          value={field.value}
          disabled={disabled}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          errorMessage={error?.message}
          containerStyle={styles.paddingXNone}
          inputContainerStyle={styles.inputContainer}
          errorStyle={error ? styles.errorText : styles.displayNone}
        />
      </View>
      {question?.file && (
        <Image
          source={{
            uri: getImageUrl(question.file),
          }}
          style={[styles.width100, styles.height150]}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

// INPUT NUMBER
const InputNumberRender = ({question, disabled, translate}) => {
  const option = question.options?.[0];
  const {
    field,
    fieldState: {error},
  } = useController({
    name: getQuestionName(question.id),
    defaultValue: '',
    rules: {
      required: question.mandatory && translate('error.message.required'),
      max: option?.threshold && {
        value: option.threshold,
        message: translate('error.message.max_number', {
          number: option.threshold,
        }),
      },
    },
  });

  return (
    <View style={styles.rowGap10}>
      <QuestionText error={error} questionText={question.question_text} />
      <View>
        <Input
          keyboardType="numeric"
          disabled={disabled}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          errorMessage={error?.message}
          containerStyle={styles.paddingXNone}
          inputContainerStyle={styles.inputContainer}
          errorStyle={error ? styles.errorText : styles.displayNone}
        />
      </View>
      {question?.file && (
        <Image
          source={{
            uri: getImageUrl(question.file),
          }}
          style={[styles.width100, styles.height150]}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

// SLIDER
const SliderRender = ({question, disabled, translate}) => {
  const {
    field,
    fieldState: {error},
  } = useController({
    name: getQuestionName(question.id),
    rules: {
      required: question.mandatory && translate('error.message.required'),
    },
  });

  return (
    <View style={styles.rowGap10}>
      <QuestionText error={error} questionText={question.question_text} />
      <Text style={styles.fontWeightMedium}>Level of Difficulty</Text>
      <View>
        <Text>Value: {field.value}</Text>
        <Slider
          disabled={disabled}
          value={field.value}
          onValueChange={field.onChange}
          allowTouchTrack={!disabled}
          step={1}
          minimumValue={question.options[0].min}
          maximumValue={question.options[0].max}
          trackStyle={styles.trckHeight}
          thumbStyle={styles.thumbStyle}
        />

        <Text style={styles.textCenter}>
          {question.options[0].min}- {'Low'} |{question.options[0].max}-{' '}
          {'Hight'}
        </Text>
        {error && <HelperText message={error.message} />}
      </View>
    </View>
  );
};

// AVAILABLE RENDERER
const componentMap = {
  note: NoteRender,
  radio: RadioRender,
  'open-text': InputTextRender,
  'open-number': InputNumberRender,
  rating: SliderRender,
  checkbox: CheckBoxRender,
};

const QuestionRenderer = ({question, disabled}) => {
  console.log('Question', question);
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const shouldSkip = useQuestionSkipLogic(question);

  if (shouldSkip) return null;

  const Component = componentMap[question.question_type] ?? null;
  return Component ? (
    <Component disabled={disabled} question={question} translate={translate} />
  ) : null;
};

const getQuestionName = (id) => {
  return `question_${id}`;
};

export default withTheme(QuestionRenderer);

const evaluateLogic = (logic, targetValue) => {
  switch (logic.condition_rule) {
    case 'equal':
      return targetValue?.includes(logic.target_option_id);
    case 'not_equal':
      return !targetValue?.includes(logic.target_option_id);
    case 'was_answered':
      return targetValue != null && targetValue !== '';
    case 'was_not_answered':
      return targetValue == null || targetValue === '';
    default:
      return false;
  }
};

export const useQuestionSkipLogic = (question) => {
  const {control, unregister} = useFormContext();

  const fieldNames = useMemo(
    () =>
      question.logics?.map((l) => getQuestionName(l.target_question_id)) ?? [],
    [question.logics],
  );

  const fieldValues = useWatch({
    control,
    name: fieldNames,
  });

  // Compute skip condition
  const shouldSkip = useMemo(() => {
    if (!question.logics?.length) return false;

    return question.logics.every((logic, index) =>
      evaluateLogic(logic, fieldValues?.[index]),
    );
  }, [question.logics, fieldValues]);

  // Unregister field when skipped
  useEffect(() => {
    if (shouldSkip) {
      unregister(getQuestionName(question.id));
    }
  }, [shouldSkip, unregister, question.id]);

  return shouldSkip;
};
