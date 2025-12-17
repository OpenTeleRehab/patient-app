import React from 'react';
import {Text, View} from 'react-native';
import {CheckBox, Image, Input, Slider, withTheme} from 'react-native-elements';
import styles from '../../assets/styles';
import {useController} from 'react-hook-form';
import HelperText from './HelperText';
import QuestionText from './QuestionText';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';

// NOTE
const NoteRender = ({question}) => {
  return (
    <View style={styles.rowGap10}>
      {question.image && (
        <Image
          source={{
            uri: question.image,
          }}
          style={[styles.width100, styles.height150]}
          resizeMode="stretch"
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
const RadioRender = ({question, translate}) => {
  const {
    field,
    fieldState: {error},
  } = useController({
    name: `question_${question.id}`,
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
                  title={opt.option_text}
                  checked={field.value.includes(opt.id)}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  onPress={() => field.onChange([opt.id])}
                  textStyle={[styles.marginLeftSm, styles.fontWeightMedium]}
                />
              </View>
              {opt.image && (
                <View>
                  <Image
                    source={{
                      uri: opt.image,
                    }}
                    style={[styles.width100, styles.height110]}
                    resizeMode="stretch"
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
const CheckBoxRender = ({question, translate}) => {
  const {
    field,
    fieldState: {error},
  } = useController({
    name: `question_${question.id}`,
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
              {opt.image && (
                <View>
                  <Image
                    source={{
                      uri: opt.image,
                    }}
                    style={[styles.width100, styles.height110]}
                    resizeMode="stretch"
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
const InputTextRender = ({question, translate}) => {
  const {
    field,
    fieldState: {error},
  } = useController({
    name: `question_${question.id}`,
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
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          errorMessage={error?.message}
          containerStyle={styles.paddingXNone}
          inputContainerStyle={styles.inputContainer}
          errorStyle={error ? styles.errorText : styles.displayNone}
        />
      </View>
    </View>
  );
};

// INPUT NUMBER
const InputNumberRender = ({question, translate}) => {
  const option = question.options?.[0];
  const {
    field,
    fieldState: {error},
  } = useController({
    name: `question_${question.id}`,
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
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          errorMessage={error?.message}
          containerStyle={styles.paddingXNone}
          inputContainerStyle={styles.inputContainer}
          errorStyle={error ? styles.errorText : styles.displayNone}
        />
      </View>
    </View>
  );
};

// SLIDER
const SliderRender = ({question, translate}) => {
  const {
    field,
    fieldState: {error},
  } = useController({
    name: `question_${question.id}`,
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
          value={field.value} // controlled value from RHF
          onValueChange={field.onChange} // update RHF form
          allowTouchTrack={true}
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

const QuestionRenderer = ({question}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const Component = componentMap[question.question_type] ?? null;
  return Component ? (
    <Component question={question} translate={translate} />
  ) : null;
};

export default withTheme(QuestionRenderer);
