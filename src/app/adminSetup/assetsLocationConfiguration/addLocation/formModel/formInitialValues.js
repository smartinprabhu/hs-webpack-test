import userFormModel from './userFormModel';

const {
  formField: {
    spaceName,
    Type,
    BuildingValue,
    maxOccupancy,
    areaSqft,
  },
} = userFormModel;

export default {
  [spaceName.name]: '',
  [Type.name]: '',
  [BuildingValue.name]: '',
  [maxOccupancy.name]: '',
  [areaSqft.name]: '',
};
