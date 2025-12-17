import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {withTheme} from 'react-native-elements';
import HeaderBar from '../../components/Common/HeaderBar';
import styles from '../../assets/styles';
import {Text} from 'react-native';
import InterviewItemCard from '../../components/ScreeningQuestionnaire/InterviewItemCard';
import {ROUTES} from '../../variables/constants';
import {useDispatch, useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {getScreeningQuestionnarieListRequest} from '../../store/screeningQuestionnaire/actions';

const InterviewList = ({navigation, route}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const dispatch = useDispatch();
  const {screeningQuestionnaireList, loading} = useSelector(
    (state) => state.screeningQuestionnaire,
  );

  useEffect(() => {
    dispatch(getScreeningQuestionnarieListRequest());
  }, [dispatch]);

  return (
    <>
      <HeaderBar
        backgroundPrimary
        onGoBack={() => {
          navigation.goBack();
        }}
        title={translate('phc.interview_list')}
      />
      {loading ? (
        <></>
      ) : (
        <ScrollView contentContainerStyle={styles.mainContainerLightPaddingMd}>
          <Text style={[styles.fontSizeBase, styles.fontWeightBold]}>
            {translate('phc.interview_list')}
          </Text>
          <View style={[styles.marginTopMd, styles.rowGap15]}>
            {screeningQuestionnaireList.map((interview, index) => {
              return (
                <InterviewItemCard
                  key={index}
                  onClickInterview={() => {
                    navigation.push(ROUTES.INTERVIEW, {
                      screeningQuestionnaire: interview,
                    });
                  }}
                  onClickViewInterviewHistory={() => {
                    navigation.push(ROUTES.INTERVIEW_HISTORY_LIST);
                  }}
                  interview={interview}
                  isDisable={index % 2 === 1}
                />
              );
            })}
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default withTheme(InterviewList);
