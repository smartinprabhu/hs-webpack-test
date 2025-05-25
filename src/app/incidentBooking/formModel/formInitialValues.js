import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    typeCategory,
    categoryId,
    subCategoryId,
    severityId,
    priorityId,
    maintenanceTeamId,
    description,
    equipmentId,
    assetId,
    incidentOn,
    probabilityId,
    incidentTypeId,
    personsWitnessed
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [typeCategory.name]: 'asset',
  [categoryId.name]: '',
  [subCategoryId.name]: '',
  [severityId.name]: '',
  [priorityId.name]: '',
  [maintenanceTeamId.name]: '',
  [description.name]: '',
  [equipmentId.name]: '',
  [probabilityId.name]: '',
  [assetId.name]: '',
  [incidentOn.name]: false,
  [incidentTypeId.name]: '',
  [personsWitnessed.name]: ''
};
