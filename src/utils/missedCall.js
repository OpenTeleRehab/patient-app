/*
 * Copyright (c) 2026 Web Essentials Co., Ltd
 */
import store, {persistor} from '../store';
import {Rocketchat} from '../services/rocketchat';
import {CALL_STATUS} from '../variables/constants';

// Launched headless for a call, the store starts empty; profile and chat URL come back with rehydration.
const waitForRehydration = () =>
  new Promise((resolve) => {
    if (persistor.getState().bootstrapped) {
      resolve();
      return;
    }

    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        unsubscribe();
        resolve();
      }
    });
  });

/**
 * Marks a declined incoming call as missed straight over Rocket.Chat's REST API, so the app needn't be opened
 * (and its chat socket logged in) for the caller to see it. Same update rejectCallHandler sends over the socket.
 *
 * @returns {Promise<boolean>} false when it couldn't be sent (offline, chat down, logged out): the caller keeps
 *   REJECTED_CALL so rejectCallHandler sends it on the next chat login.
 */
export const sendMissedCallUpdate = async (callInfo) => {
  if (!callInfo?._id || !callInfo?.rid) {
    return false;
  }

  await waitForRehydration();

  // Chat credentials only: the API accessToken isn't persisted, so it's always empty when launched headless.
  const {profile} = store.getState().user;
  if (!profile?.identity || !profile?.chat_password) {
    return false;
  }

  const login = await Rocketchat.login(profile.identity, {
    digest: profile.chat_password,
    algorithm: 'sha-256',
  });
  if (!login?.data?.userId) {
    return false;
  }

  const status = callInfo.body?.includes('audio') ? CALL_STATUS.AUDIO_MISSED : CALL_STATUS.VIDEO_MISSED;
  const result = await Rocketchat.updateMessage(
    login.data.userId,
    login.data.authToken,
    callInfo.rid,
    callInfo._id,
    status,
  );

  return !!result?.success;
};
