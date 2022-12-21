import store from '../store';

export const getAssistiveTechnologyName = (id) => {
  const {assistiveTechnologies} = store.getState().assistiveTechnology;
  const assistiveTechnology = assistiveTechnologies.find(
    (item) => item.id === id,
  );

  return assistiveTechnology ? assistiveTechnology.name : '';
};
