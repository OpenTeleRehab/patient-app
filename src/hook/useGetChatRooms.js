import {useEffect} from 'react';
import {getChatRooms} from '../store/rocketchat/actions';

// The single place chat rooms are fetched: runs on every chat login (chatAuth) and on a new API token.
export const useGetChatRooms = (dispatch, accessToken, chatAuth, isDataUpToDate, chatUserId) => {
  useEffect(() => {
    // Skip the offline-login placeholder token; the re-login sets a real one and this runs then.
    // chatAuth must be this profile's: right after switching accounts it can still be the previous user's, and
    // their subscriptions combined with this user's contacts would show the previous user's conversations.
    if (
      accessToken &&
      isDataUpToDate !== false &&
      chatAuth?.userId &&
      chatAuth.token &&
      chatAuth.userId === chatUserId
    ) {
      dispatch(getChatRooms());
    }
  }, [accessToken, chatAuth, chatUserId, dispatch, isDataUpToDate]);
};
