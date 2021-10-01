import variables from '../variables';

export default {
  appointmentListWrapper: {
    marginBottom: 10,
  },
  appointmentListContainer: {
    borderRadius: 10,
    padding: 2,
    borderColor: variables.white,
    backgroundColor: variables.grey7,
  },
  appointmentListLeftContent: {
    backgroundColor: variables.primary,
    color: variables.white,
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    width: 120,
    height: '100%',
  },
  appointmentListMonth: {
    color: variables.white,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  appointmentListDay: {
    color: variables.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  appointmentListRightContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
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
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  appointmentShowMoreButtonWrapper: {
    marginBottom: 40,
  },
  appointmentShowMoreButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  appointmentOverlayContainer: {
    minWidth: '80%',
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
    paddingBottom: 30,
  },
};
