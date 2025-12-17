import store from '../store';

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
