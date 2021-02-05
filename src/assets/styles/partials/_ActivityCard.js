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
    paddingTop: 3,
    fontWeight: 'bold',
    fontSize: variables.fontSizeBase,
    color: variables.white,
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
  },
  activityPaginationIconContainer: {
    height: 20,
  },
  activityPaginationButton: {
    height: 7,
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
  },
  activityTotalNumberText: {
    fontSize: 18,
    padding: 3,
  },
  activityCardVideo: {
    height: 250,
  },
  educationMaterialCardHeader: {
    height: 250,
    backgroundColor: variables.primary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  educationMaterialIconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  educationMaterialCardHeaderTitle: {
    color: variables.white,
    fontWeight: 'bold',
    fontSize: variables.fontSizeMd,
  },
  educationMaterialDownloadWrapper: {
    padding: variables.spacingMd,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  educationMaterialFileName: {
    maxWidth: '90%',
  },
};
