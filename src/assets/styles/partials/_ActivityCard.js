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
  },
  activityCardFooterText: {
    paddingTop: 3,
    fontWeight: 'bold',
    fontSize: variables.fontSizeBase,
  },
  activityCardText: {
    margin: 10,
    fontSize: variables.fontSizeBase,
    height: 20,
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
    alignItems: 'center',
  },
  activityPaginationText: {
    padding: 0,
    marginBottom: 0,
    height: 20,
  },
  activityPaginationButton: {
    width: 65,
    height: 5,
    padding: 0,
  },
  activityPaginationContainer: {
    paddingTop: 5,
    paddingBottom: 5,
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
};
