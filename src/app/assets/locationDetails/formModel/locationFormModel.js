export default {
  formId: 'locationForm',
  formField: {
    spaceName: {
      name: 'space_name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    shortCode: {
      name: 'name',
      label: 'Short Code',
      required: true,
      requiredErrorMsg: 'Short Code is required',
    },
    areaSqft: {
      name: 'area_sqft',
      label: 'Area Sqft',
      required: false,
    },
    Type: {
      name: 'asset_category_id',
      label: 'Type',
      required: true,
      requiredErrorMsg: 'Type is required',
    },
    parentId: {
      name: 'parent_id',
      label: 'Parent Location',
      required: true,
      requiredErrorMsg: 'Parent Location is required',
    },
    company: {
      name: 'company_id',
      label: 'Company',
      required: true,
      requiredErrorMsg: 'Company is required',
    },
    vendorId: {
      name: 'vendor_id',
      label: 'Vendor',
    },
    subType: {
      name: 'sub_type_id',
      label: 'Sub Type',
      required: false,
    },
    spaceStatus: {
      name: 'space_status',
      label: 'Space Status',
      required: false,
      requiredErrorMsg: 'Space Status is required',
    },
    spaceType: {
      name: 'type_id',
      label: 'Space Type',
      required: false,
    },
    maintenanceTeam: {
      name: 'maintenance_team_id',
      label: 'Maintenance Team',
      required: true,
      requiredErrorMsg: 'Maintenance Team is required',
    },
    maxOccupancy: {
      name: 'max_occupancy',
      label: 'Max Occupancy',
      required: false,
    },
    bookingAllowed: {
      name: 'is_booking_allowed',
      label: 'Yes',
      label1: 'No',
      required: true,
    },
  },
};
