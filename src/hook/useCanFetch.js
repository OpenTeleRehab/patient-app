import {useSelector} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';

export default function useCanFetch() {
  const netInfo = useNetInfo();
  const {accessToken, isDataUpToDate} = useSelector((state) => state.user);

  return (
    !!accessToken &&
    !!netInfo.isConnected &&
    // null means not checked yet; only a known-unreachable network blocks fetching
    netInfo.isInternetReachable !== false &&
    isDataUpToDate !== false
  );
}
