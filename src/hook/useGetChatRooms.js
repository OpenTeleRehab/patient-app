import {useEffect} from 'react';
import {getChatRooms} from '../store/rocketchat/actions';

export const useGetChatRooms = (dispatch, accessToken, chatAuth) => {
  useEffect(() => {
    if (accessToken && chatAuth && chatAuth.userId && chatAuth.token) {
      dispatch(getChatRooms());
    }
  }, [accessToken, chatAuth, dispatch]);
};
