import _ from 'lodash';

export const getLanguageName = (id, languages) => {
  const language = _.findLast(languages, {id: parseInt(id, 10)});

  return language ? language.name : '';
};
