import store from '../store';
import moment from 'moment';
import settings from '../../config/settings';
import {TREATMENT_STATUS} from '../variables/constants';

export const getRegionName = () => {
  const profile = store.getState().user.profile;
  const regions = store.getState().region.regions;
  const region = regions.find((item) => item.id === profile?.region_id);

  return region ? region.name : '';
};

export const getProvinceName = () => {
  const profile = store.getState().user.profile;
  const provinces = store.getState().province.provinces;
  const province = provinces.find((item) => item.id === profile?.province_id);

  return province ? province.name : '';
};

export const getPhcServiceName = () => {
  const profile = store.getState().user.profile;
  const phcServices = store.getState().phcService.phcServices;
  const phcService = phcServices.find((item) => item.id === profile?.phc_service_id);

  return phcService ? phcService.name : '';
};

export const getPhcServiceIdentity = () => {
  const profile = store.getState().user.profile;
  const phcServices = store.getState().phcService.phcServices;
  const phcService = phcServices.find((item) => item.id === profile?.phc_service_id);

  return phcService ? phcService.identity : '';
};

export const getTransferStatus = (patientId) => {
  const transfers = store.getState().transfer.transfers;
  const transfer = transfers.find((item) => item.patient_id === patientId && item.therapist_type !== 'supplementary');
  return transfer ? transfer.status : '';
};

export const getTreatmentStatus = (treatmentPlan) => {
  if (!treatmentPlan) {
    return null;
  }

  const today = moment().startOf('day');
  const start = moment(treatmentPlan.start_date, settings.format.date);
  const end = moment(treatmentPlan.end_date, settings.format.date);
  let status = '';
  if (start.isSameOrBefore(today) && end.isSameOrAfter(today)) {
    status = TREATMENT_STATUS.ONGOING;
  } else if (start.isAfter(today)) {
    status = TREATMENT_STATUS.PLANNED;
  } else if (end.isBefore(today)) {
    status = TREATMENT_STATUS.FINISHED;
  }
  return status;
};
