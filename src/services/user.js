/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
const login = () => {
  return {
    id: 1,
    firstName: 'Luke',
    lastName: 'Cameron',
    mobile: '012222333',
    accessToken: 'CIkc4AwU5c5mC7h8vcpdRqV99w6nS5nm',
    isFirstTimeLogin: false,
  };
};

const logout = () => {
  return {};
};

export const User = {
  login,
  logout,
};
