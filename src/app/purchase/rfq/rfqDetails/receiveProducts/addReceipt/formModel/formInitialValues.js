import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    partnerId,
    pickingTypeId,
    locationDestId,
    locationId,
    scheduledDate,
    origin,
    companyId,
    note,
    Priority,
    dcNo,
    poNo,
    useIn,
    spaceId,
    assetId,
    employeeId,
    departmentId,
    categoryId,
  },
} = checkoutFormModel;

export default {
  [partnerId.name]: '',
  [pickingTypeId.name]: '',
  [locationDestId.name]: '',
  [locationId.name]: '',
  [scheduledDate.name]: '',
  [origin.name]: '',
  [companyId.name]: '',
  [note.name]: '',
  [Priority.name]: '',
  [dcNo.name]: '',
  [poNo.name]: '',
  [useIn.name]: { value: 'Asset', label: 'Asset' },
  [spaceId.name]: '',
  [assetId.name]: '',
  [employeeId.name]: '',
  [departmentId.name]: '',
  [categoryId.name]: '',
};
