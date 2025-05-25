import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    categoryType,
    assetCategoryId,
    equipmentCategoryId,
    duration,
    maintenanceType,
    checkListIds,
    toolIds,
  },
} = checkoutFormModel;

export default {
  [title.name]: '',
  [categoryType.name]: { value: 'equipment', label: 'Equipment' },
  [assetCategoryId.name]: '',
  [equipmentCategoryId.name]: '',
  [duration.name]: 0,
  [checkListIds.name]: '',
  [maintenanceType.name]: '',
  [toolIds.name]: '',
};
