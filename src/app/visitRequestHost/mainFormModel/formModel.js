export default {
  formId: 'visitorVerificationForm',
  formField: {
    otp: {
      name: 'otp_code',
      label: 'OTP Code',
      required: true,
      requiredErrorMsg: 'OTP Code is required',
    },
    companyName: {
      name: 'organization',
      label: 'Visitor Company',
      required: true,
      requiredErrorMsg: 'Visitor Company is required',
    },
    idDetails: {
      name: 'Visitor_id_details',
      label: 'ID Proof Number',
      required: true,
      requiredErrorMsg: 'Id details is required',
      placeholder: 'Enter last 4 digits of ID proof',
    },
    Purpose: {
      name: 'purpose',
      label: 'Purpose',
      required: false,
      requiredErrorMsg: 'Purpose is required',
    },
    PurposeText: {
      name: 'purpose_text',
      label: 'Purpose',
      required: false,
      requiredErrorMsg: 'Purpose is required',
    },
    isOTPVerified: {
      name: 'is_otp_verified',
      label: 'Is OTP Verified',
      required: true,
      requiredErrorMsg: 'OTP not verified',
    },
    idProof: {
      name: 'id_proof',
      label: 'ID Proof',
      required: true,
      requiredErrorMsg: 'ID proof type is required',
    },
    documentProof: {
      name: 'attachment',
      label: 'Scan Proof',
      required: true,
      requiredErrorMsg: 'ID proof is required',
    },
    imageMedium: {
      name: 'image_medium',
      label: 'Profile Photo',
      required: true,
      requiredErrorMsg: 'Profile Photo is required',
    },
    Disclaimer: {
      name: 'disclaimer',
      label: 'I Agree',
      required: true,
      requiredErrorMsg: 'Agree to continue',
    },
  },
};
