import React from 'react';
import {Text, View} from 'react-native';
import {CheckBox, Image, Input, Slider, withTheme} from 'react-native-elements';
import styles from '../../assets/styles';
import {useController} from 'react-hook-form';
import QuestionText from './QuestionText';

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
      <QuestionText questionText={question.question} />
      <Text>{question.description}</Text>
    </View>
  );
};

// RADIO Read Only
const RadioRender = ({question}) => {
  const {field} = useController({
    name: question?.code,
  });

  return (
    <View style={styles.rowGap10}>
      <QuestionText questionText={question.question} />
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
                  title={opt.title}
                  checked={field.value === opt.title}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  disabled={true}
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
    </View>
  );
};

// CHECKBOX Read Only
const CheckBoxRender = ({question}) => {
  const {field} = useController({
    name: question?.code,
  });
  return (
    <View style={styles.rowGap10}>
      <QuestionText questionText={question.question} />
      <View
        style={[
          styles.flexRow,
          styles.columnGap10,
          styles.rowGap10,
          styles.flexWrap,
        ]}>
        {question.options.map((opt, index) => {
          const isChecked = field.value?.includes(opt.title);
          return (
            <View style={styles.questionOption} key={index}>
              <View>
                <CheckBox
                  title={opt.title}
                  checked={isChecked}
                  disabled={true}
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
    </View>
  );
};

// INPUT TEXT Read Only
const InputTextRender = ({question}) => {
  const {field} = useController({
    name: question?.code,
  });

  return (
    <View style={styles.rowGap10}>
      <QuestionText questionText={question.question} />
      <View>
        <Input
          value={field.value}
          disabled={true}
          containerStyle={styles.paddingXNone}
          inputContainerStyle={styles.inputContainer}
        />
      </View>
    </View>
  );
};

// INPUT NUMBER Read Only
const InputNumberRender = ({question}) => {
  const {field} = useController({
    name: question?.code,
  });

  return (
    <View style={styles.rowGap10}>
      <QuestionText questionText={question.question} />
      <View>
        <Input
          keyboardType="numeric"
          value={field.value}
          disabled={true}
          containerStyle={styles.paddingXNone}
          inputContainerStyle={styles.inputContainer}
        />
      </View>
    </View>
  );
};

// SLIDER Read Only
const SliderRender = ({question}) => {
  const {field} = useController({
    name: question?.code,
  });

  return (
    <View style={styles.rowGap10}>
      <QuestionText questionText={question.question} />
      <Text style={styles.fontWeightMedium}>Level of Difficulty</Text>
      <View>
        <Text>Value: {field.value}</Text>
        <Slider
          value={field.value} // controlled value from RHF
          disabled={true}
          step={1}
          minimumValue={question.min.number}
          maximumValue={question.max.number}
          trackStyle={styles.trckHeight}
          thumbStyle={styles.thumbStyle}
        />

        <Text style={styles.textCenter}>
          {question.min.number}- {question.min.title} |{question.max.number}-{' '}
          {question.max.title}
        </Text>
      </View>
    </View>
  );
};

// AVAILABLE RENDERER
const componentMap = {
  NOTE: NoteRender,
  RADIO: RadioRender,
  TEXT: InputTextRender,
  NUMBER: InputNumberRender,
  SLIDER: SliderRender,
  CHECKBOX: CheckBoxRender,
};

const QuestionRendererViewOnly = ({question}) => {
  const Component = componentMap[question.type] ?? null;
  return Component ? <Component question={question} /> : null;
};

export default withTheme(QuestionRendererViewOnly);
