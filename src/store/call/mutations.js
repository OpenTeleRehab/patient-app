/*
 * Copyright (c) 2026 Web Essentials Co., Ltd
 */
const accepted = (data) => {
  return {
    type: 'ACCEPTED',
    data,
  };
};

const rejected = (data) => {
  return {
    type: 'REJECTED',
    data,
  };
};

export const mutation = {
  accepted,
  rejected,
};
