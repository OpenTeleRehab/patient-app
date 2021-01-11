/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const appointmentFetchSuccess = (data) => {
  return {
    type: 'APPOINTMENT_FETCH_SUCCEED',
    data,
  };
};

const appointmentFetchFailure = () => {
  return {
    type: 'APPOINTMENT_FETCH_FAILED',
  };
};

export const mutation = {
  appointmentFetchSuccess,
  appointmentFetchFailure,
};
