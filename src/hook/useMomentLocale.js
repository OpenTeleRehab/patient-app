import {useEffect} from 'react';
import moment from 'moment/min/moment-with-locales';

export default function useMomentLocale(languages, languageId) {
  useEffect(() => {
    const languageCode = languages.find(({id}) => id === languageId)?.code;
    moment.locale(
      languageCode && moment.locales().includes(languageCode)
        ? languageCode
        : 'en',
    );
  }, [languages, languageId]);
}
