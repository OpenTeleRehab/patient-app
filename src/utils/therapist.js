import _ from 'lodash';

export const getTherapistName = (id, therapists) => {
  const therapist = _.findLast(therapists, {id: parseInt(id, 10)});

  return therapist ? therapist.last_name + ' ' + therapist.first_name : '';
};
