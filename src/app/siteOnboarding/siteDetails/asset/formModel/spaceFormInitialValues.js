import checkoutFormModel from './spaceCheckoutFormModel';

const {
  formField: {
    name,
    sequenceValue,
    typeValue,
    allowMultipleBookings,
    allowedBookingInAdvance,
    multiDayBookingLimit,
    parentId,
    isBookable,
    filePath,
  },
} = checkoutFormModel;

export default {
  [name.name]: '',
  [sequenceValue.name]: 1,
  [typeValue.name]: { value: 'building', label: 'Building' },
  [allowMultipleBookings.name]: '',
  [allowedBookingInAdvance.name]: '',
  [multiDayBookingLimit.name]: '',
  [parentId.name]: '',
  [isBookable.name]: '',
  [filePath.name]: '',
};
