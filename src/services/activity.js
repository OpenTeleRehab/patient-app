/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const getActivities = () => {
  return {};
};

const getTodayActivitySummary = () => {
  return {
    success: true,
    data: {
      all: 6,
      completed: 4,
    },
  };
};

export const Activity = {
  getActivities,
  getTodayActivitySummary,
};
