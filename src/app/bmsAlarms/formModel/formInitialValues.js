import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    raisedBy,
    raisedOn,
    title,
    incidentDate,
    categoryId,
    subCategoryId,
    descriptionOfBreakdown,
    Severity,
    maintenanceTeamId,
    companyId,
    types,
    spaceId,
    equipmentId,
  },
} = checkoutFormModel;

export default {
  [raisedBy.name]: '',
  [raisedOn.name]: '',
  [title.name]: '',
  [incidentDate.name]: false,
  [categoryId.name]: '',
  [subCategoryId.name]: '',
  [descriptionOfBreakdown.name]: '',
  [Severity.name]: '',
  [maintenanceTeamId.name]: '',
  [companyId.name]: '',
  [types.name]: 'Space',
  [spaceId.name]: '',
  [equipmentId.name]: '',
};
