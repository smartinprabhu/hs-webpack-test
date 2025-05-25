export default {
  formId: 'spaceCategoryForm',
  formField: {
    name: {
      name: 'name',
      label: 'Category Name',
      requiredErrorMsg: 'Category Name is required',
    },
    sequenceValue: {
      name: 'sequence',
      label: 'Sequence',
    },
    typeValue: {
      name: 'type',
      label: 'Type',
    },
    allowMultipleBookings: {
      name: 'allow_multiple_bookings',
      label: 'Allow multiple bookings per shift',
    },
    allowedBookingInAdvance: {
      name: 'allowed_booking_in_advance',
      label: 'Allowed Booking In Advance (Days)',
    },
    multiDayBookingLimit: {
      name: 'multi_day_booking_limit',
      label: 'Multi Day Booking Limit (Days)',
    },
    parentId: {
      name: 'parent_id',
      label: 'Parent Space Category',
    },
    isBookable: {
      name: 'is_bookable',
      label: 'Is Bookable',
    },
    filePath: {
      name: 'file_path',
      label: 'File Path',
    },
  },
};
