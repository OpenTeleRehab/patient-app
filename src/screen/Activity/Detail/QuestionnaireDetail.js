import React, {useEffect, useState} from 'react';
import {Button, Divider, Icon, Text, withTheme} from 'react-native-elements';
import {Pagination} from 'react-native-snap-carousel';
import styles from '../../../assets/styles';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView, View} from 'react-native';
import HeaderBar from '../../../components/Common/HeaderBar';
import {ROUTES} from '../../../variables/constants';
import {getTranslate} from 'react-localize-redux';
import _ from 'lodash';
import RenderQuestion from '../_Partials/RenderQuestion';
import {
  completeQuestionnaire,
  completeQuestionnaireOffline,
} from '../../../store/activity/actions';
import {useNetInfo} from '@react-native-community/netinfo';
import Tts from 'react-native-tts';
import moment from 'moment';

const RenderPaginateDots = (questions, patientAnswers, activeIndex, theme) =>
  questions.map((question, i) => (
    <View style={styles.activityPaginationView} key={i}>
      <View style={styles.activityPaginationIconContainer}>
        {i === activeIndex && (
          <Icon
            name="caret-down"
            color={theme.colors.orangeDark}
            type="font-awesome-5"
          />
        )}
      </View>
      <Button
        type={
          (patientAnswers[question.id] && patientAnswers[question.id].length) ||
          patientAnswers[question.id] > 0
            ? 'solid'
            : 'outline'
        }
        buttonStyle={styles.activityPaginationButton}
      />
    </View>
  ));

const QuestionnaireDetail = ({theme, route, navigation}) => {
  const dispatch = useDispatch();
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {id} = route.params;
  const {treatmentPlan, isLoading, offlineQuestionnaireAnswers} = useSelector(
    (state) => state.activity,
  );
  const [questionnaire, setQuestionnaire] = useState(undefined);
  const [isCompletedOffline, setIsCompletedOffline] = useState(false);
  const [activePaginationIndex, setActivePaginationIndex] = useState(0);
  const [question, setQuestion] = useState(undefined);
  const [patientAnswers, setPatientAnswers] = useState([]);
  const isOnline = useNetInfo().isConnected;

  useEffect(() => {
    navigation.dangerouslyGetParent().setOptions({tabBarVisible: false});
    return () => {
      navigation.dangerouslyGetParent().setOptions({tabBarVisible: true});
    };
  }, [navigation]);

  useEffect(() => {
    if (id && treatmentPlan.activities.length) {
      const selectedQuestionnaire = _.find(treatmentPlan.activities, {
        id,
      });

      if (selectedQuestionnaire) {
        setQuestionnaire(selectedQuestionnaire);
      }
    }
  }, [id, treatmentPlan]);

  useEffect(() => {
    if (questionnaire) {
      let answers = [];
      if (questionnaire.completed) {
        questionnaire.answers.map((item) => {
          answers[item.question_id] = item.answer;
        });

        setPatientAnswers(answers);
      } else {
        const offlineQuestionnaireAnswer = offlineQuestionnaireAnswers.find(
          (item) => {
            return item.id === parseInt(id, 10);
          },
        );
        if (offlineQuestionnaireAnswer) {
          setPatientAnswers(offlineQuestionnaireAnswer.answers);
          setIsCompletedOffline(true);
        }
      }
    }
  }, [questionnaire, id, offlineQuestionnaireAnswers]);

  useEffect(() => {
    if (questionnaire?.questions.length) {
      setQuestion(questionnaire.questions[activePaginationIndex]);
    }
  }, [activePaginationIndex, questionnaire]);

  const handleNext = () => {
    if (activePaginationIndex < questionnaire.questions.length - 1) {
      Tts.stop();
      setActivePaginationIndex(activePaginationIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (activePaginationIndex > 0) {
      Tts.stop();
      setActivePaginationIndex(activePaginationIndex - 1);
    }
  };

  const handleCompleteTask = () => {
    Tts.stop();
    if (isOnline) {
      const data = {
        id: id,
        answers: patientAnswers,
      };
      dispatch(completeQuestionnaire(data)).then((res) => {
        if (res) {
          navigation.navigate(ROUTES.ACTIVITY);
        }
      });
    } else {
      let offlineQuestionnaireAnswersObj = _.cloneDeep(
        offlineQuestionnaireAnswers,
      );
      offlineQuestionnaireAnswersObj.push({id: id, answers: patientAnswers});
      dispatch(completeQuestionnaireOffline(offlineQuestionnaireAnswersObj));
      navigation.navigate(ROUTES.ACTIVITY);
    }
  };

  if (!questionnaire) {
    return (
      <HeaderBar
        leftContent={{label: ''}}
        rightContent={{
          label: translate('common.close'),
          onPress: () => navigation.navigate(ROUTES.ACTIVITY),
        }}
      />
    );
  }

  return (
    <>
      <HeaderBar
        leftContent={
          <Text
            numberOfLines={1}
            h4
            style={[styles.textLight, styles.marginRight]}>
            {questionnaire.title}
            {!!questionnaire.completed && (
              <Icon
                name="check"
                type="font-awesome-5"
                color={theme.colors.white}
                size={18}
                style={styles.marginLeft}
              />
            )}
          </Text>
        }
        rightContent={{
          label: translate('common.close'),
          onPress: () => navigation.navigate(ROUTES.ACTIVITY),
        }}
      />
      <View
        style={[
          styles.flexColumn,
          styles.mainContainerLight,
          styles.noPadding,
        ]}>
        <View>
          <Pagination
            dotsLength={questionnaire.questions.length}
            activeDotIndex={activePaginationIndex}
            containerStyle={styles.activityPaginationContainer}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            renderDots={(activeIndex) =>
              RenderPaginateDots(
                questionnaire.questions,
                patientAnswers,
                activeIndex,
                theme,
              )
            }
          />
          {questionnaire.questions.length === 1 && (
            <View style={styles.activityPaginationContainer}>
              {RenderPaginateDots(
                questionnaire.questions,
                patientAnswers,
                0,
                theme,
              )}
            </View>
          )}
          <View
            style={[
              styles.activityTotalNumberContainer,
              styles.marginTopMd,
              styles.marginBottomMd,
            ]}>
            <Text
              style={[
                {color: theme.colors.orangeDark},
                styles.activityTotalNumberText,
              ]}>
              {activePaginationIndex + 1}
            </Text>
            <Text style={styles.activityTotalNumberText}>
              {translate('common.of_total_number', {
                number: questionnaire.questions.length,
              })}
            </Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={[styles.marginBottom]}>
          {activePaginationIndex === 0 &&
            questionnaire.description.trim() !== '' && (
              <Text style={[styles.marginBottom, styles.paddingXMd]}>
                {questionnaire.description}
              </Text>
            )}
          {question && (
            <RenderQuestion
              question={question}
              patientAnswers={patientAnswers}
              setPatientAnswers={setPatientAnswers}
              notEditable={!!questionnaire.completed}
              description={
                activePaginationIndex === 0 ? questionnaire.description : null
              }
            />
          )}
        </ScrollView>

        <Divider />
        <View style={styles.stickyButtonWrapper}>
          {activePaginationIndex > 0 && questionnaire.questions.length > 1 && (
            <Button
              containerStyle={styles.stickyButtonContainer}
              icon={{
                name: 'angle-left',
                type: 'font-awesome',
                color: theme.colors.primary,
              }}
              title={translate('activity.previous')}
              titleStyle={styles.textUpperCase}
              onPress={handlePrevious}
              type="outline"
            />
          )}
          {activePaginationIndex < questionnaire.questions.length - 1 &&
            questionnaire.questions.length > 1 && (
              <Button
                containerStyle={styles.stickyButtonContainer}
                icon={{
                  name: 'angle-right',
                  type: 'font-awesome',
                  color: theme.colors.primary,
                }}
                title={translate('activity.continue')}
                titleStyle={styles.textUpperCase}
                iconRight={true}
                onPress={handleNext}
                type="outline"
              />
            )}
          {activePaginationIndex === questionnaire.questions.length - 1 && (
            <Button
              containerStyle={styles.stickyButtonContainer}
              icon={{
                name: 'angle-right',
                type: 'font-awesome',
                color:
                  isLoading ||
                  !!questionnaire.completed ||
                  isCompletedOffline ||
                  moment().isBefore(questionnaire.date, 'day')
                    ? theme.colors.grey1
                    : theme.colors.white,
              }}
              title={translate(
                questionnaire.completed ? 'common.submitted' : 'common.submit',
              )}
              titleStyle={[styles.textUpperCase]}
              iconRight={true}
              onPress={handleCompleteTask}
              disabled={
                isLoading ||
                !!questionnaire.completed ||
                isCompletedOffline ||
                moment().isBefore(questionnaire.date, 'day')
              }
              disabledTitleStyle={styles.stickyDisabledTitleStyle}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default withTheme(QuestionnaireDetail);
