import variables from '../variables';

export default {
  appointmentListWrapper: {
    marginBottom: 10,
  },
  appointmentListContainer: {
    borderRadius: 10,
    padding: 1,
    borderColor: variables.white,
  },
  appointmentListLeftContent: {
    backgroundColor: variables.primary,
    color: variables.white,
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    width: 120,
    height: '100%',
  },
  appointmentListMonth: {
    color: variables.white,
    fontSize: 18,
    fontWeight: variables.fontWeightBold,
    textTransform: 'uppercase',
  },
  appointmentListDay: {
    color: variables.white,
    fontSize: 36,
    fontWeight: variables.fontWeightBold,
  },
  appointmentListRightContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 10,
    paddingRight: 30,
  },
  borderRadius: {
    borderRadius: 10,
  },
  noBorderRadius: {
    borderRadius: 0,
  },
  borderRightRadius: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  noBorderTopRightRadius: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  appointmentAcceptButtonWrapper: {
    backgroundColor: variables.success,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
  },
  appointmentRejectButtonWrapper: {
    backgroundColor: variables.danger,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
  },
  appointmentActionButtonText: {
    color: variables.white,
    fontWeight: variables.fontWeightBold,
    paddingHorizontal: 10,
  },
  appointmentShowMoreButtonWrapper: {
    marginBottom: 40,
  },
  appointmentShowMoreButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  appointmentOverlayButtonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  appointmentOverlayLeftButtonContainer: {
    flex: 1,
    marginRight: 5,
  },
  appointmentOverlayRightButtonContainer: {
    flex: 1,
    marginLeft: 5,
  },
  appointmentStatus: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appointmentStatusAdditionalSpace: {
    paddingBottom: 15,
  },
};
