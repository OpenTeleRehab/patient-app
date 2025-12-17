import variables from '../variables';
import colors from '../variables/colors';

export default {
  questionOption: {
    width: '48%',
    rowGap: 10,
  },
  trckHeight: {
    height: 4,
  },
  thumbStyle: {
    height: 15,
    width: 15,
    background: colors.primary,
  },
  inputContainer: {
    backgroundColor: '#E6E8EA',
    borderRadius: 6,
    borderBottomWidth: 0,
    paddingHorizontal: 8,
  },
  interviewItemCard: {
    backgroundColor: colors.blueLight5,
    padding: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chipDiagnosis: {
    backgroundColor: variables.orangeDark1,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
};
