import React, {createContext, useEffect, useState} from 'react';
import JailMonkey from 'jail-monkey';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import CommonPopup from '../components/Common/Popup';

const DeviceSecurityContext = createContext(null);

export const DeviceSecurityContextProvider = ({children}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const [isJailedBroken, setIsJailedBroken] = useState(null);

  useEffect(() => {
    setIsJailedBroken(JailMonkey.isJailBroken());
  }, []);

  return (
    <DeviceSecurityContext.Provider value={{isJailedBroken}}>
      {isJailedBroken ? (
        <CommonPopup
          popup={isJailedBroken}
          iconType="material"
          iconName="warning"
          tittle={translate('device.root.detected')}
          message={translate('device.root.detected.message')}
        />
      ) : (
        <>{children}</>
      )}
    </DeviceSecurityContext.Provider>
  );
};
