import React, {useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {CheckBox, Image, Input, Slider, withTheme} from 'react-native-elements';
import styles from '../../assets/styles';
import {useController, useFormContext, useWatch} from 'react-hook-form';
import HelperText from './HelperText';
import QuestionText from './QuestionText';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {getCachedImage} from '../../utils/imageHelper';

// NOTE
const NoteRender = ({question}) => {
  const [uri, setUri] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      if (question?.file) {
        const localUri = await getCachedImage(question.file);
        setUri(localUri);
      }
    };
    loadImage();
  }, [question]);

  return (
    <View style={styles.rowGap10}>
      {uri && (
        <Image
          source={{uri}}
          style={[styles.width100, styles.height150]}
          resizeMode="contain"
        />
      )}
      <QuestionText questionText={question.question_text} />
      {question.options?.[0] && (
        <Text accessibilityLabel={question.options[0].option_text}>
          {question.options[0].option_text}
        </Text>
      )}
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

  const [uris, setUris] = useState({});

  useEffect(() => {
    const loadImages = async () => {
      const newUris = {};
      for (const opt of question.options || []) {
        if (opt.file) newUris[opt.id] = await getCachedImage(opt.file);
      }
      setUris(newUris);
    };
    loadImages();
  }, [question]);

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
        {question.options.map((opt, index) => (
          <View style={styles.questionOption} key={index}>
            <CheckBox
              disabled={disabled}
              title={opt.option_text}
              checked={field.value.includes(opt.id)}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              onPress={() => field.onChange([opt.id])}
              textStyle={[styles.marginLeftSm, styles.fontWeightMedium]}
            />
            {uris[opt.id] && (
              <Image
                source={{uri: uris[opt.id]}}
                style={[styles.width100, styles.height110]}
                resizeMode="contain"
                onPress={() => field.onChange([opt.id])}
              />
            )}
          </View>
        ))}
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

  const [uris, setUris] = useState({});

  useEffect(() => {
    const loadImages = async () => {
      const newUris = {};
      for (const opt of question.options || []) {
        if (opt.file) newUris[opt.id] = await getCachedImage(opt.file);
      }
      setUris(newUris);
    };
    loadImages();
  }, [question]);

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
              <CheckBox
                disabled={disabled}
                title={opt.option_text}
                checked={isChecked}
                onPress={() => {
                  const current = field.value || [];
                  field.onChange(
                    current.includes(opt.id)
                      ? current.filter((x) => x !== opt.id)
                      : [...current, opt.id],
                  );
                }}
                textStyle={[styles.marginLeftSm, styles.fontWeightMedium]}
              />
              {uris[opt.id] && (
                <Image
                  source={{uri: uris[opt.id]}}
                  style={[styles.width100, styles.height110]}
                  resizeMode="contain"
                  onPress={() => {
                    const current = field.value || [];
                    field.onChange(
                      current.includes(opt.id)
                        ? current.filter((x) => x !== opt.id)
                        : [...current, opt.id],
                    );
                  }}
                />
              )}
            </View>
          );
        })}
      </View>
      {error && <HelperText message={error.message} />}
    </View>
  );
};

// INPUT TEXT / NUMBER / SLIDER
const useCachedImage = (file) => {
  const [uri, setUri] = useState(null);
  useEffect(() => {
    if (file) {
      getCachedImage(file).then(setUri);
    }
  }, [file]);
  return uri;
};

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

  const uri = useCachedImage(question?.file);

  return (
    <View style={styles.rowGap10}>
      <QuestionText error={error} questionText={question.question_text} />
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
      {uri && (
        <Image
          source={{uri}}
          style={[styles.width100, styles.height150]}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

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

  const uri = useCachedImage(question?.file);

  return (
    <View style={styles.rowGap10}>
      <QuestionText error={error} questionText={question.question_text} />
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
      {uri && (
        <Image
          source={{uri}}
          style={[styles.width100, styles.height150]}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

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

  const uri = useCachedImage(question?.file);

  return (
    <View style={styles.rowGap10}>
      <QuestionText error={error} questionText={question.question_text} />
      <Text style={styles.fontWeightMedium}>Level of Difficulty</Text>
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
        {question.options[0].min} - {question.options[0].min_note} |
        {question.options[0].max} - {question.options[0].max_note}
      </Text>
      {error && <HelperText message={error.message} />}
      {uri && (
        <Image
          source={{uri}}
          style={[styles.width100, styles.height150]}
          resizeMode="contain"
        />
      )}
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
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const shouldSkip = useQuestionSkipLogic(question);

  if (shouldSkip) return null;

  const Component = componentMap[question.question_type] ?? null;
  return Component ? (
    <Component disabled={disabled} question={question} translate={translate} />
  ) : null;
};

export const getQuestionName = (id) => {
  return `question_${id}`;
};

export default withTheme(QuestionRenderer);

export const evaluateLogic = (logic, targetValue) => {
  switch (logic.condition_rule) {
    case 'equal':
      if (Array.isArray(targetValue)) {
        return targetValue?.includes(logic.target_option_id);
      } else {
        return targetValue === logic.target_option_value;
      }
    case 'not_equal':
      if (Array.isArray(targetValue)) {
        return !targetValue?.includes(logic.target_option_id);
      } else {
        return targetValue !== logic.target_option_value;
      }
    case 'was_answered':
      return targetValue != null && targetValue !== '';
    case 'was_not_answered':
      if (Array.isArray(targetValue)) {
        if (targetValue.length === 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return targetValue == null || targetValue === '';
      }
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
    return !question.logics.every((logic, index) =>
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
