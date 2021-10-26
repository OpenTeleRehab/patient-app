/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import variables from '../variables';

export default {
  activityCardContainer: {
    padding: 0,
    borderRadius: 5,
  },
  activityCardImage: {
    height: 250,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  activityCardTitle: {
    margin: 10,
    fontSize: variables.fontSizeBase,
    height: 65,
  },
  activityCardFooterContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    backgroundColor: variables.primary,
  },
  activityCardFooterText: {
    color: variables.white,
    fontSize: variables.fontSizeBase,
    fontFamily: variables.fontFamilyBold,
    paddingTop: 3,
  },
  activityCardText: {
    margin: 10,
    fontSize: variables.fontSizeBase,
  },
  activityCardInfoWrapper: {
    height: 130,
  },
  activityCardDivider: {
    marginBottom: 0,
  },
  activityCardButton: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    justifyContent: 'flex-start',
  },
  activityPaginationView: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 5,
  },
  activityPaginationIconContainer: {
    height: 20,
  },
  activityPaginationButton: {
    height: 5,
    padding: 0,
  },
  activityPaginationContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 20,
  },
  activityTotalNumberContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 17,
  },
  activityTotalNumberText: {
    fontSize: 18,
    padding: 3,
    fontFamily: variables.fontFamilyBase,
  },
  activityCardVideo: {
    height: 250,
  },
  cardWithIconHeader: {
    height: 250,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cardWithIconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWithIconHeaderTitle: {
    fontSize: variables.fontSizeMd,
    fontFamily: variables.fontFamilyBold,
  },
  educationMaterialDownloadWrapper: {
    padding: variables.spacingMd,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  educationMaterialFileName: {
    maxWidth: '90%',
  },
  activityEntryTitle: {
    fontSize: 20,
    fontFamily: variables.fontFamilyBold,
  },
};
