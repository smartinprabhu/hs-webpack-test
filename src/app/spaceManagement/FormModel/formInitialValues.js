import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    spaceName,
    spaceNumber,
    spaceCategory,
    subCategory,
    maintainedBy,
    area,
    maxOccupancy,
    spaceType,
    subType,
    spaceStatus,
    assignEmployee,
    bookingAllowed,
    latitude,
    longitude,
  },
} = checkoutFormModel;

export default {
  [spaceName.name]: '',
  [spaceNumber.name]: '',
  [spaceCategory.name]: '',
  [subCategory.name]: '',
  [maintainedBy.name]: false,
  [area.name]: '',
  [maxOccupancy.name]: false,
  [spaceType.name]: false,
  [subType.name]: '',
  [spaceStatus.name]: false,
  [assignEmployee.name]: '',
  [bookingAllowed.name]: '',
  [latitude.name]: '',
  [longitude.name]: '',
};
