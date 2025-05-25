export default {
  formId: 'externalReportForm',
  formField: {
    personName: {
      name: 'person_name',
      label: 'Name',
      requiredErrorMsg: 'Name is required',
    },
    mobileValue: {
      name: 'mobile',
      label: 'Mobile',
      invalidErrorMsg: 'Invalid Mobile Number',
      requiredErrorMsg: 'Mobile is required',
    },
    emailValue: {
      name: 'email',
      label: 'Email',
      requiredErrorMsg: 'Email is required',
      invalidErrorMsg: 'Email is not valid (e.g. abc@example.com)',
    },
    space: {
      name: 'asset_id',
      label: 'Space',
      requiredErrorMsg: 'Space is required',
    },
    subject: {
      name: 'subject',
      label: 'Subject',
      requiredErrorMsg: 'Subject is required',
    },
    categoryId: {
      name: 'category_id',
      label: 'Category',
      requiredErrorMsg: 'Category is required',
    },
    subCategorId: {
      name: 'sub_category_id',
      label: 'Sub Category',
      requiredErrorMsg: 'Sub Category is required',
    },
    descriptionValue: {
      name: 'description',
      label: 'Description',
      requiredErrorMsg: 'Description is required',
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
    attachmentValue: {
      name: 'attachment',
      label: 'Attachment',
      required: true,
      requiredErrorMsg: 'Attachment is required',
    },
    attachmentType: {
      name: 'attachment_type',
      label: 'attachment_type',
    },
    workLocation: {
      name: 'work_location',
      label: 'Work Station Number',
      requiredErrorMsg: 'Work Station Number is required',
    },
  },
};
