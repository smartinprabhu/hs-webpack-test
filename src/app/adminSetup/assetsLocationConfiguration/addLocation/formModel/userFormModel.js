export default {
  formId: 'locationForm',
  formField: {
    spaceName: {
      name: 'space_name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    Type: {
      name: 'asset_category_id',
      label: 'Type',
      required: true,
      requiredErrorMsg: 'Type is required',
    },
    BuildingValue: {
      name: 'parent_id',
      label: 'Parent Space',
      required: true,
      requiredErrorMsg: 'Parent Space is required',
      requiredErrorMsg1: 'Building is required',
    },
    maxOccupancy: {
      name: 'max_occupancy',
      label: 'Max Occupancy',
      required: false,
    },
    areaSqft: {
      name: 'area_sqft',
      label: 'Area Sqft',
      required: false,
    },
  },
};
