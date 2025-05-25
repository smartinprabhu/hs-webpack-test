import checkoutFormModel from './problemCategorycheckoutFormModel';

const {
  formField: {
    name,
    teamCategoryId,
    categoryUserId,
    incidentType,
    incidentCategory,
    accessGroupIds,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [teamCategoryId.name]: '',
  [categoryUserId.name]: '',
  [incidentType.name]: '',
  [incidentCategory.name]: '',
  [accessGroupIds.name]: '',
};
