import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getPublishSurvey} from '../../store/survey/actions';
import {getTreatmentPlanRequest} from '../../store/activity/actions';
import {useNetInfo} from '@react-native-community/netinfo';
import moment from 'moment';
import SurveyModal from './SurveyModal';

const Survey = () => {
  const dispatch = useDispatch();
  const languages = useSelector(state => state.language.languages);
  const {profile} = useSelector((state) => state.user);
  const {publishSurveys} = useSelector(state => state.survey);
  const {treatmentPlan} = useSelector((state) => state.activity);
  const {organization} = useSelector((state) => state.phone);
  const [surveyPhase, setSurveyPhase] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const isOnline = useNetInfo().isConnected;

  useEffect(() => {
    if (publishSurveys.length) {
      setSurveys(publishSurveys);
    }
  }, [publishSurveys]);

  useEffect(() => {
    if (surveys.length > 0) {
      setCurrentSurvey(surveys[0]);
    } else {
      setCurrentSurvey(null);
    }
  }, [surveys]);

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
        gender: profile.gender,
        treatment_plan_id: treatmentPlan.id,
        survey_phase: surveyPhase,
      }));
    }
  }, [profile, dispatch, isOnline, organization, languages, treatmentPlan, surveyPhase]);

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

  return (
    <>
      {currentSurvey && (
        <SurveyModal publishSurvey={currentSurvey} surveyPhase={surveyPhase} setSurveys={setSurveys} />
      )}
    </>
  );
};

export default Survey;
