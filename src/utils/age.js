import moment from 'moment';
import settings from '../../config/settings';

export const ageCalculation = (value, translate) => {
  const today = moment();
  const birthDate = moment(value, settings.format.date);

  const year = today.format('YYYY') - birthDate.format('YYYY');
  const month = today.format('M') - birthDate.format('M');
  const day = today.format('D') - birthDate.format('D');
  let totalAge = 0;

  if (year > 0) {
    totalAge =
      year === 1
        ? year + ' ' + translate('age.single_year')
        : year + ' ' + translate('age.plural_year');
  } else if (month > 0) {
    totalAge =
      month === 1
        ? month + ' ' + translate('age.single_month')
        : month + ' ' + translate('age.plural_month');
  } else {
    totalAge =
      day === 1
        ? day + ' ' + translate('age.single_day')
        : day + ' ' + translate('age.plural_day');
  }

  return totalAge;
};
