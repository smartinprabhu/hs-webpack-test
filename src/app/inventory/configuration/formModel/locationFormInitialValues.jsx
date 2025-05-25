import locationFormModel from './locationFormModel';

const {
  formField: {
    name,
    locationId,
    locationType,
    partnerId,
    posxLabel,
    posyLabel,
    poszLabel,
  },
} = locationFormModel;

export default {
  [name.name]: '',
  [locationId.name]: '',
  [locationType.name]: 'internal',
  [partnerId.name]: '',
  [posxLabel.name]: '0',
  [posyLabel.name]: '0',
  [poszLabel.name]: '0',
};
