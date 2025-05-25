export default {
  formId: 'operationsForm',
  formField: {
    title: {
      name: 'name',
      label: 'Title',
      requiredErrorMsg: 'Title is required',
      required: true,
    },
    categoryType: {
      name: 'type_category',
      label: 'Type',
      requiredErrorMsg: 'Type is required',
      required: true,
    },
    assetCategoryId: {
      name: 'asset_category_id',
      label: 'Space Category',
    },
    equipmentCategoryId: {
      name: 'category_id',
      label: 'Equipment Category',
    },
    duration: {
      name: 'order_duration',
      label: 'Duration (Hours)',
    },
    maintenanceType: {
      name: 'maintenance_type',
      label: 'Maintenance Type',
      requiredErrorMsg: 'Maintenance Type is required',
      required: true,
    },
    checkListIds: {
      name: 'check_list_id',
      label: 'Check List',
    },
    toolIds: {
      name: 'tool_id',
      label: 'Tools',
    },
    partsLine: {
      name: 'parts_line',
      label: 'Spare Parts',
    },
  },
};
