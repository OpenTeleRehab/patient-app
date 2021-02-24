/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeLocalData = async (key, data, isJson = false) => {
  if (!data) {
    return;
  }

  let value = data.toString();
  if (isJson) {
    value = JSON.stringify(data);
  }
  await AsyncStorage.setItem(`@OrgHiPatientApp:${key}`, value);
};

export const getLocalData = async (key, isJson = false) => {
  const value = await AsyncStorage.getItem(`@OrgHiPatientApp:${key}`);

  if (isJson) {
    return value != null ? JSON.parse(value) : null;
  }

  return value;
};
