export default {
  formId: 'wpStateEmailForm',
  formField: {
    requestState: {
      name: 'state',
      label: 'Status',
      requiredErrorMsg: 'State is required',
    },
    messageType: {
      name: 'message_type',
      label: 'Message Type',
      requiredErrorMsg: 'Message Type is required',
    },
    isAuthorizer: {
      name: 'is_authorizer',
      label: 'Authorizer?',
    },
    isEhs: {
      name: 'is_ehs',
      label: 'EHS?',
    },
    isVendor: {
      name: 'is_vendor',
      label: 'Vendor?',
    },
    isRequestor: {
      name: 'is_requestor',
      label: 'Requestor?',
    },
    isSecurity: {
      name: 'is_security',
      label: 'Security?',
    },
    isRecipients: {
      name: 'recipients_ids',
      label: 'Recipients',
    },
  },
};
