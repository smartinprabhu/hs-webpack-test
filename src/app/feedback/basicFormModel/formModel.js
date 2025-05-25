export default {
  formId: 'feedbackForm',
  formField: {
    nameValue: {
      name: 'name',
      label: 'Name',
      required: true,
      requiredErrorMsg: 'Name is required',
    },
    mobileValue: {
      name: 'mobile',
      label: 'Mobile',
      required: true,
      requiredErrorMsg: 'Mobile is required',
    },
    diclaimerValue: {
      name: 'disclaimer_text',
      label: 'Disclaimer Text',
      required: true,
      requiredErrorMsg: 'Disclaimer Text is Required',
    },
    diclaimer: {
      name: 'has_disclaimer',
      label: 'Disclaimer',
      required: true,
    },
    emailValue: {
      name: 'email',
      label: 'Email',
      required: true,
      requiredErrorMsg: 'Email is required',
    },
    employeeCode: {
      name: 'employeeCode',
      label: 'Employee Code',
      required: true,
      requiredErrorMsg: 'Employee Code is required',
    },
    otp: {
      name: 'otp_code',
      label: 'OTP Code',
      required: true,
      requiredErrorMsg: 'OTP Code is required',
    },
    isOTPVerified: {
      name: 'is_otp_verified',
      label: 'Is OTP Verified',
      required: true,
      requiredErrorMsg: 'OTP not verified',
    },
    locationId: {
      name: 'location_id',
      label: 'Location',
      requiredErrorMsg: 'Location is Required',
    },
    partnerId: {
      name: 'partner_id',
      label: 'Tenant',
      requiredErrorMsg: 'Tenant is Required',
    },
  },
};
