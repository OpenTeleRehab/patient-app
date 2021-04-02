import variables from '../variables';

export default {
  appointmentListWrapper: {
    marginBottom: 10,
  },
  appointmentListContainer: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 2,
    borderColor: variables.white,
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    paddingRight: 30,
  },
  appointmentSwipeableContainer: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  appointmentCancelButtonWrapper: {
    backgroundColor: variables.error,
    justifyContent: 'center',
  },
  appointmentCancelButtonText: {
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
    maxWidth: 500,
    minWidth: 300,
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
};
