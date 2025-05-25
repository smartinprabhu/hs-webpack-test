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
      label: 'Your Organization',
      required: true,
      requiredErrorMsg: 'Your Organization is required',
    },
    plannedIn: {
      name: 'planned_in',
      label: 'Planned In',
      required: true,
      requiredErrorMsg: 'Planned In is required',
    },
    Company: {
      name: 'host_name',
      label: 'Host Name',
      required: true,
      requiredErrorMsg: 'Host Name is required',
    },
    contactPerson: {
      name: 'host_email',
      label: 'Host Official Email',
      required: true,
      requiredErrorMsg: 'Host Email is required',
    },
    hostCompany: {
      name: 'allowed_sites_ids',
      label: 'Host Company',
      required: true,
      requiredErrorMsg: 'Host Company is required',
    },
    Purpose: {
      name: 'purpose',
      label: 'Purpose (optional)',
      required: false,
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
  },
};
