import React from 'react';
import {CheckBox, Image, Input, Text} from 'react-native-elements';
import settings from '../../../../config/settings';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {View} from 'react-native';
import styles from '../../../assets/styles';

const containerStyle = {
  borderWidth: 1,
  padding: 10,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
};

const RenderQuestion = ({question, setPatientAnswers, patientAnswers}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);

  const handleOnClickRadio = (answer) => {
    setPatientAnswers({...patientAnswers, [question.id]: answer.id});
  };

  const handleOnClickCheckbox = (answer) => {
    let answers = patientAnswers[question.id] || [];
    const index = answers.findIndex((item) => item === answer.id);
    if (index > -1) {
      answers.splice(index, 1);
    } else {
      answers.push(answer.id);
    }
    setPatientAnswers({...patientAnswers, [question.id]: answers});
  };

  const handleOnChange = (value) => {
    setPatientAnswers({...patientAnswers, [question.id]: value});
  };

  return (
    <>
      {question.file && (
        <Image
          source={{uri: settings.adminApiBaseURL + '/file/' + question.file.id}}
          style={styles.questionImage}
          resizeMode={'contain'}
        />
      )}
      <View style={[styles.marginTopMd, styles.paddingXMd]}>
        <Text style={styles.marginBottom} h4>
          {question.title}
        </Text>
        {question.type === 'multiple' && (
          <>
            {question.answers.map((answer) => {
              return (
                <CheckBox
                  containerStyle={containerStyle}
                  title={answer.description}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  onPress={() => handleOnClickRadio(answer)}
                  key={answer.id}
                  checked={
                    patientAnswers[question.id]
                      ? answer.id === patientAnswers[question.id]
                      : false
                  }
                />
              );
            })}
          </>
        )}
        {question.type === 'checkbox' && (
          <>
            {question.answers.map((answer) => {
              return (
                <CheckBox
                  containerStyle={containerStyle}
                  title={answer.description}
                  onPress={() => handleOnClickCheckbox(answer)}
                  key={answer.id}
                  checked={
                    patientAnswers[question.id]
                      ? patientAnswers[question.id].includes(answer.id)
                      : false
                  }
                />
              );
            })}
          </>
        )}
        {question.type === 'open-number' && (
          <Input
            keyboardType="phone-pad"
            placeholder={translate('activity.enter_your_answer')}
            value={patientAnswers[question.id] || ''}
            onChangeText={(value) => handleOnChange(value)}
          />
        )}
        {question.type === 'open-text' && (
          <Input
            placeholder={translate('activity.enter_your_answer')}
            value={patientAnswers[question.id] || ''}
            onChangeText={(value) => handleOnChange(value)}
          />
        )}
      </View>
    </>
  );
};

export default RenderQuestion;
