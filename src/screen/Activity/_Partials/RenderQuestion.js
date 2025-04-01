import React from 'react';
import {CheckBox, Image, Input, Text} from 'react-native-elements';
import {getTranslate} from 'react-localize-redux';
import {useSelector} from 'react-redux';
import {View} from 'react-native';
import styles from '../../../assets/styles';
import TTSButton from '../../../components/TTSButton';
import _ from 'lodash';

const containerStyle = {
  borderWidth: 1,
  padding: 10,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
};

const RenderQuestion = ({
  theme,
  question,
  setPatientAnswers,
  patientAnswers,
  notEditable,
  description,
  thresholdErrors,
  setThresholdErrors,
}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {adminApiBaseURL} = useSelector((state) => state.phone);

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
    if (thresholdErrors[question.id]) {
      setThresholdErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[question.id];
        return updatedErrors;
      });
    }
  };

  const getTextsToSpeech = () => {
    const texts = [question.title];
    if (description) {
      texts.unshift(description);
    }

    if (['multiple', 'checkbox'].includes(question.type)) {
      question.answers.forEach((answer) => {
        texts.push(answer.description);
      });
    }

    // Answer
    if (patientAnswers[question.id]) {
      if (question.type === 'multiple') {
        texts.push(translate('tts.question.selected'));
        const answer = _.find(question.answers, {
          id: patientAnswers[question.id],
        });
        texts.push(answer.description);
      } else if (question.type === 'checkbox') {
        texts.push(translate('tts.question.selected'));
        patientAnswers[question.id].forEach((answerId) => {
          const answer = _.find(question.answers, {id: answerId});
          texts.push(answer.description);
        });
      } else if (patientAnswers[question.id].trim() !== '') {
        texts.push(translate('tts.question.answered'));
        texts.push(patientAnswers[question.id]);
      }
    }

    return texts;
  };

  return (
    <>
      {question.file && (
        <Image
          source={{uri: adminApiBaseURL + '/file/' + question.file.id}}
          style={styles.questionImage}
          resizeMode={'contain'}
        />
      )}
      <View style={[styles.marginTopMd, styles.paddingXMd]}>
        <View style={[styles.flexRow, styles.marginBottom]}>
          <Text style={[styles.activityEntryTitle, styles.flexRow]}>
            {question.title}
          </Text>
          <TTSButton
            textsToSpeech={getTextsToSpeech()}
            style={styles.marginLeft}
          />
        </View>
        {question.type === 'multiple' && (
          <>
            {question.answers.map((answer) => {
              return (
                <CheckBox
                  containerStyle={containerStyle}
                  title={
                    <Text style={styles.textDefaultBold}>
                      {answer.description}
                    </Text>
                  }
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  onPress={() => handleOnClickRadio(answer)}
                  key={answer.id}
                  checked={
                    patientAnswers[question.id]
                      ? answer.id === patientAnswers[question.id]
                      : false
                  }
                  disabled={notEditable}
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
                  title={
                    <Text style={styles.textDefaultBold}>
                      {answer.description}
                    </Text>
                  }
                  onPress={() => handleOnClickCheckbox(answer)}
                  key={answer.id}
                  checked={
                    patientAnswers[question.id]
                      ? patientAnswers[question.id].includes(answer.id)
                      : false
                  }
                  disabled={notEditable}
                />
              );
            })}
          </>
        )}
        {question.type === 'open-number' && (
          <Input
            style={[styles.textDefault]}
            labelStyle={styles.textDefault}
            placeholderStyle={styles.textDefault}
            keyboardType="phone-pad"
            placeholder={translate('activity.enter_your_answer')}
            value={patientAnswers[question.id] || ''}
            onChangeText={(value) => handleOnChange(value)}
            maxLength={15}
            disabled={notEditable}
          />
        )}
        {question.type === 'open-text' && (
          <Input
            style={[styles.textDefault]}
            labelStyle={styles.textDefault}
            placeholderStyle={styles.textDefault}
            placeholder={translate('activity.enter_your_answer')}
            value={patientAnswers[question.id] || ''}
            onChangeText={(value) => handleOnChange(value)}
            maxLength={255}
            disabled={notEditable}
          />
        )}
        {thresholdErrors[question && question.id] && (
          <Text style={{color: theme.colors.danger}}>{thresholdErrors[question && question.id]}</Text>
        )}
      </View>
    </>
  );
};

export default RenderQuestion;
