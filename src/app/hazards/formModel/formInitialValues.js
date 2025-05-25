import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    typeCategory,
    categoryId,
    priorityId,
    maintenanceTeamId,
    description,
    equipmentId,
    assetId,
    incidentOn,
    incidentTypeId,
    companyId,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [typeCategory.name]: 'asset',
  [categoryId.name]: '',
  [priorityId.name]: '',
  [maintenanceTeamId.name]: '',
  [description.name]: '',
  [equipmentId.name]: '',
  [assetId.name]: '',
  [companyId.name]: '',
  [incidentOn.name]: false,
  [incidentTypeId.name]: '',
};
