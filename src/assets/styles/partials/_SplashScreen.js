import variables from '../variables';

export default {
  splashScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: variables.primary,
  },
  splashScreenLogo: {
    width: 305,
    height: 82,
  },
  splashScreenLoading: {
    marginTop: 50,
  },
  splashScreenPoweredByContainer: {
    backgroundColor: variables.primary,
    alignItems: 'center',
  },
  splashScreenPoweredByLogo: {
    width: 40,
    height: 50,
  },
  splashScreenPoweredByWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  splashScreenSponsorsContainer: {
    backgroundColor: variables.white,
    alignItems: 'center',
  },
  splashScreenSponsorLogos: {
    marginVertical: 10,
    width: 300,
    height: 48,
  },
};
